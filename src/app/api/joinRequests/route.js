import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import Request from "@/model/request-model";

import { getLoggedInUser } from "@/queries/users";

export const GET = async (request) => {
  await dbConn();

  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("User not found!");
    }
    const requests = await Request.find({ "reciever.id": { $eq: user._id } });
    if (!requests) {
      throw new Error("Requests not found!");
    }
    const resp = NextResponse.json(requests, { status: 200 });
    return resp;
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
