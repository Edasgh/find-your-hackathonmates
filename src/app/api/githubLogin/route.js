import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";
import { generateToken } from "@/lib/generateToken";
import axios from "axios";

export const POST = async (request) => {
  const { code } = await request.json();
  await dbConn();

  try {
    const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;
    const fetchUrl = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;
    const getAccessTokenResponse = await axios.post(fetchUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (getAccessTokenResponse.status !== 200) {
      throw new Error("Something went wrong!");
    }

    const data = await getAccessTokenResponse.data;
    const access_token = new URLSearchParams(data).get("access_token");
    const getGithubUserResponse = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (getGithubUserResponse.status !== 200) {
      throw new Error("Something went wrong!");
    }

    const userEmail = getGithubUserResponse.data.email;

    const userExists = await User.findOne({ email: userEmail });
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
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
