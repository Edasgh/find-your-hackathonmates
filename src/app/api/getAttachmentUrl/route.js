"use server";
import { cloudinary } from "@/lib/cloudinaryConfig";
import { getConvexClient } from "@/lib/convex";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

//for uploading to convex cloud
const convexClient = getConvexClient();

// Utility function to handle Cloudinary upload with timeout
const uploadToCloudinary = (buffer, fileName, timeout = 10000) => {
  return Promise.race([
    new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "fyh-folder",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer); // Properly end the stream
    }),
    new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error("Upload timed out"));
      }, timeout)
    ),
  ]);
};

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

    //upload in convex cloud
    //generate a short lived upload url
    const postUrl = await convexClient.mutation(
      api.fileControls.generateuploadUrl
    );
    // POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await result.json();

    const fileUrl = await convexClient.query(api.fileControls.getFileUrl, {
      storageId,
    });

    // Return a successful response
    return NextResponse.json(
      {
        message: `${fileName} sent!`,
        url: fileUrl,
        public_id: storageId,
      },
      { status: 200 }
    );

    //For uploading to cloudinary
    // Convert the file to a buffer
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);

    // if (!buffer || buffer.length === 0) {
    //   throw new Error("File buffer is empty or invalid");
    // }

    // Upload to Cloudinary with a timeout
    // const result = await uploadToCloudinary(buffer, fileName, 65000); // 10 seconds timeout

    // Return a successful response
    // return NextResponse.json(
    //   {
    //     message: `${fileName} sent!`,
    //     url: result.secure_url,
    //     public_id: result.public_id,
    //   },
    //   { status: 200 }
    // );
  } catch (err) {
    console.log(err);
    // Return an error response
    return NextResponse.json(
      { message: "File upload failed", error: err.message },
      { status: 500 }
    );
  }
};
