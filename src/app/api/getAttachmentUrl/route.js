"use server";
import { cloudinary } from "@/lib/cloudinaryConfig";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");

    if (!file || !fileName) {
      return NextResponse.json(
        { message: "File and fileName are required" },
        { status: 400 }
      );
    }

    // Debug: Inspect the file object
    // console.log("File object:", file);
    // console.log("File name:", fileName);

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!buffer || buffer.length === 0) {
      throw new Error("File buffer is empty or invalid");
    }

    // console.log("Buffer size:", buffer.length); // Debug buffer size

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, fileName);

    // Return a successful response
    return NextResponse.json(
      {
        message: `${fileName} sent!`,
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error during upload:", err.message);

    // Return an error response
    return NextResponse.json(
      { message: "File upload failed", error: err.message },
      { status: 500 }
    );
  }
};

// Utility function to handle Cloudinary upload
const uploadToCloudinary = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "fyh-folder",
      },
      (error, result) => {
        if (error) {
          // console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer); // Properly end the stream
  });
};
