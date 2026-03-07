import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";
import Team from "@/model/team-model";

export const GET = async () => {
  await dbConn();

  try {
    const teams = await Team.aggregate([
      {
        $addFields: {
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
      },

      {
        $addFields: {
          weekOfMonth: {
            $ceil: { $divide: ["$day", 7] },
          },
        },
      },

      {
        $group: {
          _id: {
            month: "$month",
            week: "$weekOfMonth",
          },
          teams: { $sum: 1 },
        },
      },

      {
        $sort: {
          "_id.month": 1,
          "_id.week": 1,
        },
      },

      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              {
                $arrayElemAt: [
                  [
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
                  ],
                  "$_id.month",
                ],
              },
              " Week ",
              { $toString: "$_id.week" },
            ],
          },
          teams: 1,
        },
      },
    ]);

    return NextResponse.json({ teams });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};
