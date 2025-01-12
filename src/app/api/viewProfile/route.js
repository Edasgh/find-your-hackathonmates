import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  await dbConn();
  const url = request.url;
  const params = new URLSearchParams(new URL(url).search);
  const id = params.get("id");
  try {
    const user = await User.findById(id);
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      throw new Error("Can't fetch details, try again later!");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
