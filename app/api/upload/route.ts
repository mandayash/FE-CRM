import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop() || "";
    // Generate unique filename
    const fileName = `${uuidv4()}.${fileExtension}`;
    // Create path relative to public directory
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure uploads directory exists
    await writeFile(filePath, buffer);

    // Return the path that can be used in <img> tags
    return NextResponse.json({
      url: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
