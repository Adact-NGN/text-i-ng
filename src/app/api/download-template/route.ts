import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession();
    
    // Create sample data for the template with user-specific phone number
    const userPhoneNumber = session?.user?.phone || "+1234567890";

    const templateData = [
      {
        "Phone Number": userPhoneNumber,
        Message: "Hello! This is a sample message.",
        "Sender ID": "COMPANY",
      },
      {
        "Phone Number": "+1987654321",
        Message: "Another sample message here.",
        "Sender ID": "ALERTS",
      },
    ];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Phone Number
      { wch: 30 }, // Message
      { wch: 15 }, // Sender ID
    ];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "SMS Recipients");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Return the file as a download
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="sms-template.xlsx"',
        "Content-Length": excelBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
