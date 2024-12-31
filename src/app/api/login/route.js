import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";
import { generateToken } from "@/lib/generateToken";


export const POST = async (request) => {
  const { email, password } = await request.json();

  //db connection
  await dbConn();

  //check if the user exists

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists && (await userExists.matchPassword(password))) {
      const user = {
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        token: generateToken(userExists._id),
        success: true,
      };
      const response = NextResponse.json({message:"Logged in successfully!"}, { status: 200 });
      response.cookies.set("token",user.token,{httpOnly:true});
      return response;
    }else
    {
       return new NextResponse("User doesn't exist", {
         status: 500,
       });
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return new NextResponse(error.message, {
      status: 500,
    });
  }

};
