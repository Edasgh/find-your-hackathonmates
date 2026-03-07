import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";

export const GET = async () => {
  await dbConn();

  try {
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          users: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = monthlyUsers.map((item) => ({
      month: months[item._id.month],
      users: item.users,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};
