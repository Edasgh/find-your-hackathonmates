import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";

export const POST = async (request) => {
  const { name, email, githubID, bio, skills, country, password } =
    await request.json();
  console.log(name, email, githubID, bio, skills, country, password);
  //create a db connection
  await dbConn();
  //sign up the user & update the db

  const user = {
    name,
    email,
    githubID,
    bio,
    skills,
    country,
    password,
  };
  try {
    await User.create(user);
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  //return a success response
  return new NextResponse("Signed Up Successfully!", {
    status: 201,
  });
};
