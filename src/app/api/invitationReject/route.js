// Description: This file defines the routes for invitation reject API.
import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import Request from "@/model/request-model";

export const POST = async (request) => {
  const { reqId } = await request.json();
  await dbConn();

  try {
    const requestEl = await Request.findByIdAndDelete(reqId);
    console.log(requestEl)
    if (!requestEl) {
      throw new Error("Request not found!");
    }
  } catch (error) {
    console.log(error.message);
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  return new NextResponse("Request rejected!", { status: 200 });
};
