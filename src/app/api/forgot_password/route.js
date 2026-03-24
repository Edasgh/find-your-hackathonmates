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
    <!DOCTYPE html>

<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>

  <body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">


        <table table width = "100%" cellpadding = "0" cellspacing = "0" style = "padding:40px 0;" >
          <tr>
            <td align="center">

              <!-- Main Card -->
              <table width="100%" max-width="520" cellpadding="0" cellspacing="0"
                style="background:#111827; border-radius:16px; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.4);">

                <!-- Logo / Branding -->
                <tr>
                  <td style="text-align:center; padding-bottom:24px;">
                    <p style="margin:0; font-size:18px; font-weight:600;">
                      <span style="font-weight:300; font-size:14px; color:#E3E3E3;">find your</span>
                      <span style="color:#B98EFD;"> HackathonMates</span>
                    </p>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:600;">
                      Reset your password
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="color:#cbd5e1; font-size:15px; line-height:1.6; padding-bottom:24px;">
                    <p style="margin:0 0 10px 0;">
                      Hi <strong>${userExists.name}</strong>,
                    </p>

                    <p style="margin:0 0 10px 0;">
                      We received a request to reset your password. Click the button below to set a new one.
                    </p>

                    <p style="margin:0;">
                      If you didn’t request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset_password?id=${userExists._id}"
                      style="
                      display:inline-block;
                      padding:12px 24px;
                      background:linear-gradient(135deg,#6366f1,#8b5cf6);
                      color:#ffffff;
                      text-decoration:none;
                      font-size:14px;
                      font-weight:600;
                      border-radius:8px;
                      box-shadow:0 6px 20px rgba(99,102,241,0.4);
                    ">
                      Reset Password
                    </a>
                  </td>
                </tr>

                <!-- Backup Link -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="color:#6b7280; font-size:12px; word-break:break-all; margin:0;">
                      Or copy and paste this link into your browser:<br />
                      ${process.env.NEXT_PUBLIC_BASE_URL}/reset_password?id=${userExists._id}
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="border-top:1px solid #1f2937; padding-top:20px;">
                    <p style="color:#6b7280; font-size:12px; margin:0; text-align:center;">
                      This link will expire in 15 minutes for security reasons.
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Footer -->
              <table width="100%" max-width="520" style="margin-top:16px;">
                <tr>
                  <td style="text-align:center; color:#6b7280; font-size:12px;">
                    © ${new Date().getFullYear()} HackathonMates. All rights reserved.
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>


      </body>
    </html>
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
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  //return a success response
  return new NextResponse("Email sent successfully!", {
    status: 200,
  });
};
