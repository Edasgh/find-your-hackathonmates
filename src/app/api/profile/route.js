import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";
import { getLoggedInUser } from "@/queries/users";
import { cookies } from "next/headers";
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
      const token = JSON.parse((await cookies()).get("token").value);
      const user = {
        _id: token._id,
        name: name,
        email: email,
        country: country,
        githubID: githubID,
        skills: skills,
        bio: bio,
        teams: token.teams,
        isAdmin: token.isAdmin,
        token: token.token,
        success: true,
      };
      const response = new NextResponse("User updated successfully!", {
        status: 200,
      });
      //reset the cookie
      response.cookies.set("token", JSON.stringify(user), { httpOnly: true });
      return response;
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
