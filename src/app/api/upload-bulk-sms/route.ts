import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import twilio from "twilio";
import { addMessage } from "@/lib/messageStorage";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Please upload an Excel file (.xlsx or .xls)" },
        { status: 400 }
      );
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate the data structure
    if (data.length === 0) {
      return NextResponse.json(
        { error: "Excel file is empty" },
        { status: 400 }
      );
    }

    // Check for required columns
    const firstRow = data[0] as any;
    const requiredColumns = ["Phone Number", "Message"];
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required columns: ${missingColumns.join(", ")}`,
          requiredColumns: ["Phone Number", "Message"],
          optionalColumns: ["Name", "Sender ID"],
        },
        { status: 400 }
      );
    }

    // Process and validate each row
    const processedData = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      const rowNumber = i + 2; // +2 because Excel is 1-indexed and we skip header

      // Validate phone number
      const phoneNumber = row["Phone Number"]?.toString().trim();
      if (!phoneNumber) {
        errors.push(`Row ${rowNumber}: Phone number is required`);
        continue;
      }

      // Basic phone number validation (should start with +)
      if (!phoneNumber.startsWith("+")) {
        errors.push(
          `Row ${rowNumber}: Phone number should start with + (e.g., +1234567890)`
        );
        continue;
      }

      // Validate message
      const message = row["Message"]?.toString().trim();
      if (!message) {
        errors.push(`Row ${rowNumber}: Message is required`);
        continue;
      }

      if (message.length > 160) {
        errors.push(
          `Row ${rowNumber}: Message is too long (max 160 characters)`
        );
        continue;
      }

      processedData.push({
        phoneNumber,
        message,
        name: row["Name"]?.toString().trim() || "",
        fromName: row["Sender ID"]?.toString().trim() || "",
        rowNumber,
      });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation errors found",
          errors,
          validRows: processedData.length,
          totalRows: data.length,
        },
        { status: 400 }
      );
    }

    // Validate Twilio credentials
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      return NextResponse.json(
        {
          error:
            "Twilio credentials not configured. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    // Send SMS messages using Twilio
    const results = [];
    for (const item of processedData) {
      try {
        // Validate sender ID if provided
        if (item.fromName) {
          // Check length (max 11 characters)
          if (item.fromName.length > 11) {
            throw new Error(
              `Row ${item.rowNumber}: Sender ID must be 11 characters or less`
            );
          }

          // Check format (must contain at least one letter, alphanumeric only)
          const alphanumericRegex = /^[A-Za-z0-9\s+\-_&]+$/;
          if (!alphanumericRegex.test(item.fromName)) {
            throw new Error(
              `Row ${item.rowNumber}: Sender ID can only contain letters, numbers, spaces, +, -, _, and &`
            );
          }

          // Must contain at least one letter
          if (!/[A-Za-z]/.test(item.fromName)) {
            throw new Error(
              `Row ${item.rowNumber}: Sender ID must contain at least one letter`
            );
          }
        }

        // Determine sender (alphanumeric ID or phone number)
        const sender = item.fromName
          ? item.fromName.trim()
          : process.env.TWILIO_PHONE_NUMBER;

        // Send SMS using Twilio
        const twilioMessage = await client.messages.create({
          body: item.message,
          from: sender,
          to: item.phoneNumber,
        });

        // Save successful message to storage
        const storedMessage = addMessage({
          phoneNumber: item.phoneNumber,
          message: item.message,
          status: "sent",
          messageId: twilioMessage.sid,
          name: item.name,
          fromName: item.fromName || undefined,
        });

        results.push({
          ...item,
          status: "sent",
          messageId: twilioMessage.sid,
          error: null,
          id: storedMessage.id,
        });
      } catch (error: any) {
        console.error(`Error sending SMS to ${item.phoneNumber}:`, error);

        // Save failed message to storage
        const storedMessage = addMessage({
          phoneNumber: item.phoneNumber,
          message: item.message,
          status: "failed",
          messageId: null,
          error: error.message || "Failed to send SMS",
          name: item.name,
          fromName: item.fromName || undefined,
        });

        results.push({
          ...item,
          status: "failed",
          messageId: null,
          error: error.message || "Failed to send SMS",
          id: storedMessage.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedData.length} SMS messages`,
      results,
      summary: {
        total: processedData.length,
        sent: results.filter((r) => r.status === "sent").length,
        failed: results.filter((r) => r.status === "failed").length,
      },
    });
  } catch (error) {
    console.error("Error processing bulk SMS:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
