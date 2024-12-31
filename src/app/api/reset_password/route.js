import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";

export async function POST(request) {
  const { id, password } = await request.json();

  //db connection
  await dbConn();

  try {
    const userExists = await User.findById(id);
    if (userExists) {
      userExists.password = password;
      const res = await userExists.save();
      if (res) {
        //return a success response
        return new NextResponse("Password changed successfully!", {
          status: 200,
        });
      } else {
        throw new Error("Something went wrong!");
    
      }
    } else {
      throw new Error("User not found!");
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
