import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ExcelJS from "exceljs";

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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SMS Recipients");

    // Set column headers and widths
    worksheet.columns = [
      { header: "Phone Number", key: "phoneNumber", width: 15 },
      { header: "Message", key: "message", width: 30 },
      { header: "Sender ID", key: "senderId", width: 15 },
    ];

    // Add data rows
    templateData.forEach((row) => {
      worksheet.addRow({
        phoneNumber: row["Phone Number"],
        message: row.Message,
        senderId: row["Sender ID"],
      });
    });

    // Generate Excel file buffer
    const excelBuffer = await workbook.xlsx.writeBuffer();

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
