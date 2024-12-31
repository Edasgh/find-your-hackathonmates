import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";
import { createTransport } from "nodemailer";

import User from "@/model/user-model";

export const POST = async (request) => {
  const { email } = await request.json();

  //db connection
  await dbConn();
  //check if the user exists

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      //send an email to the user with reset password link
      const html = `
    <p>Hi, ${userExists.name},</p>
    <p>Here's your password recovery link</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset_password?id=${userExists._id}">Reset password here</a>
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
        from: `"Hackathonmates ${process.env.GOOGLE_ACCOUNT_USER}"`, // sender address
        to: email,
        subject: `Reset your Hackathonmates password`, // Subject line
        text: "Regarding your password recovery!",
        html: html, // html body
      });

      if (info.accepted)
        return new NextResponse("Email sent successfully!", {
          status: 200,
        });
      else if (info.rejected)
        return new NextResponse("Something went wrong!", {
          status: 500,
        });
    } else {
      return new NextResponse("User not found!", {
        status: 500,
      });
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  //return a success response
  return new NextResponse("Email sent successfully!", {
    status: 200,
  });
};
