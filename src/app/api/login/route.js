import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";
import { generateToken } from "@/lib/generateToken";

export const POST = async (request) => {
  const { email, password } = await request.json();

  //db connection
  await dbConn();

  try {
    //check if the user exists
    const userExists = await User.findOne({ email: email });
    if (userExists && (await userExists.matchPassword(password))) {
      const token = generateToken(userExists._id);
      const response = NextResponse.json(
        { message: "Logged in successfully!" },
        { status: 200 }
      );
      response.cookies.set("token", JSON.stringify(token), { httpOnly: true });
      return response;
    } else {
      return new NextResponse("User doesn't exist", {
        status: 500,
      });
    }
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
