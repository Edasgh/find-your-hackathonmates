import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";
import { createTransport } from "nodemailer";

import Request from "@/model/request-model";
import Team from "@/model/team-model";

export const POST = async (request) => {
  const {
    senderName,
    senderId,
    teamName,
    teamId,
    recieverName,
    recieverId,
    email,
  } = await request.json();

  await dbConn();

  //email = reciever's email

  const invitationData = {
    message: `${senderName} has invited you to join ${teamName} team`,
    sender: {
      name: senderName,
      id: senderId,
    },
    team: {
      name: teamName,
      id: teamId,
    },
    reciever: {
      name: recieverName,
      id: recieverId,
    },
  };
  try {
    const findTeam = await Team.findById(teamId);
    let members = findTeam.members;
    if(members.some(m=>m.id===recieverId))
    {
         return new NextResponse("Team mate already exists in team!", {
           status: 403,
         });
    }
    const sendInvite = await Request.create(invitationData);
    if (!sendInvite) {
      throw new Error("Invitation not sent!");
    } else {
      //send an email to the user with notification link
      const html = `
      <p>Hi, ${recieverName},</p>
      <p>${senderName} has invited you to join ${teamName} team</p>
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
        from: `"The Admin of ${teamName}, via Hackathonmates ${process.env.GOOGLE_ACCOUNT_USER}"`, // sender address
        to: email,
        subject: `Team joining Invitation from ${teamName}`, // Subject line
        text: "Regarding your team joining invitation!",
        html: html, // html body
      });

      if (info.accepted)
        return new NextResponse("Invitation Sent!", { status: 200 });
      else if (info.rejected) throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
