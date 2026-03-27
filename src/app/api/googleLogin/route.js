import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";
import { generateToken } from "@/lib/generateToken";

export const POST = async (request) => {
  const { email } = await request.json();
  await dbConn();
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      const token = generateToken(userExists._id);
      const user = await User.findById(userExists._id).select("-password");
      const response = NextResponse.json(
        { message: "Logged in successfully!", user },
        { status: 200 }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax", // 🔥 IMPORTANT for localhost
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    } else {
      const res = NextResponse.json(
        { message: "User doesn't exist!" },
        { status: 401 }
      );
      return res;
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
