import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";
import { getLoggedInUser } from "@/queries/users";
import { NextResponse } from "next/server";

export const GET = async () => {
  //dbconn
  await dbConn();

  try {
    const user = await getLoggedInUser();
    if (user) {
      const resp = NextResponse.json(user, { status: 200 });
      return resp;
    } else {
      return new NextResponse("Something went wrong!", {
        status: 500,
      });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  const { id, name, email, country, githubID, bio, skills } =
    await request.json();

  await dbConn();

  try {
    const resp = await User.findByIdAndUpdate(id, {
      name: name,
      email: email,
      country: country,
      githubID: githubID,
      skills: skills,
      bio: bio,
    });
    if (resp) {
      return new NextResponse("User updated successfully!", { status: 200 });
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
