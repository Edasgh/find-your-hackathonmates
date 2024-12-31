import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import Request from "@/model/request-model";
import { createTransport } from "nodemailer";

import { getLoggedInUser } from "@/queries/users";
import User from "@/model/user-model";

export const POST = async (request) => {
  const { teamName, teamId, recieverId, teamEmail} = await request.json();
  await dbConn();

  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("User not found!");
    }

    const getReciever = await User.findById(recieverId);
    if (!getReciever) {
      throw new Error("Reciever not found!");
    }

    const recieverName = getReciever.name;

    const requestData = {
      message: `Hi ${recieverName}, ${user.name} would like to join your team ${teamName}`,
      team: {
        name: teamName,
        id: teamId,
      },
      reciever: {
        name: recieverName,
        id: recieverId,
      },
      sender: {
        name: user.name,
        id: user._id,
      },
    };

    const ApplyToJoin = await Request.create(requestData);
    if (!ApplyToJoin) {
      throw new Error("Application not successful!");
    } else {
      //send an email to the user with notification link
      const html = `
            <p>Hi ${recieverName}, I would like to join your team ${teamName}</p>
            <p>${user.name} has applied to you to join the ${teamName} team</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile/joinRequests">View Here</a>
            <p>Best regards, happy Hacking!</p>
          `;

      const transporter = createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.GOOGLE_ACCOUNT_USER,
          pass: process.env.GOOGLE_ACCOUNT_PASS,
        },
      });

      // sending email with nodemailer
      const info = await transporter.sendMail({
        from: `"${user.name} via Hackathonmates ${process.env.GOOGLE_ACCOUNT_USER}"`, // sender address
        to: teamEmail,
        subject: `Team joining request from ${user.name}`, // Subject line
        text: "Regarding the request to join your team!",
        html: html, // html body
      });

      if (info.accepted)
        return new NextResponse("Applied successfully!", { status: 200 });
      else if (info.rejected) throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
