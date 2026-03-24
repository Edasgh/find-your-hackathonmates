import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
import Team from "./src/model/team-model.js";
import User from "./src/model/user-model.js";
import Request from "./src/model/request-model.js";
import Unread from "./src/model/unread-model.js";
import { createTransport } from "nodemailer";

const onlineUsers = new Map();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

function getKeyByValue(map, searchValue) {
  for (let [key, value] of map) {
    if (value === searchValue) {
      return key;
    }
  }
  return null; // Value not found
}

const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = createServer(handle);

  const io = new Server(server);

  // set up socket connection
  io.on("connection", (socket) => {
    console.log(`New connection ${socket.id}`);
    socket.on("join-room", async (roomId) => {
      try {
        socket.join(roomId);
        console.log(`Joined room ${roomId}`);
        socket.to(roomId).emit("user_joined", "Joined the room");
      } catch (error) {
        console.log(e);
      }
    });

    // add to onlineUsers map on visiting the app
    socket.on("visit", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    // send a message to the team
    socket.on(
      "message",
      async ({
        roomId,
        public_id,
        fileName,
        url,
        message,
        senderId,
        senderName,
        sentOn,
      }) => {
        try {
          // 1. Save and get the updated team in one go
          // Use .select('members') to keep the returned object small if you only need members
          const updatedTeam = await Team.findByIdAndUpdate(
            roomId,
            {
              $push: {
                messages: {
                  attachment: {
                    public_id,
                    url: url?.trim().length > 0 ? url : "N/A",
                    name: fileName,
                  },
                  message,
                  sentOn,
                  sender: { name: senderName, id: senderId },
                },
              },
            },
            { new: true, runValidators: true }
          );

          if (!updatedTeam) throw new Error("Team not found or message not saved");

          // 2. Broadcast the last message (with its new MongoDB _id) to everyone in the room
          const savedMessage = updatedTeam.messages[updatedTeam.messages.length - 1];
          io.to(roomId).emit("message", savedMessage);

          // 3. Handle Notifications for users NOT in the room
          // Get all member IDs except the sender
          const recipientIds = updatedTeam.members
            .map(m => m.id.toString())
            .filter(id => id !== senderId);

          for (const userId of recipientIds) {
            const userSocketId = onlineUsers.get(userId);
            let shouldNotify = true;

            if (userSocketId) {
              const userSocket = io.sockets.sockets.get(userSocketId);
              // If they are online AND in the room, don't create an "Unread" record
              if (userSocket?.rooms.has(roomId)) {
                shouldNotify = false;
              }
            }

            if (shouldNotify) {
              // Create the notification
               await Unread.create({
                team: roomId,
                reciever: userId,
              });

              // If they are online (but not in the room), push the live alert
              if (userSocketId) {
                const allAlerts = await Unread.find({ reciever: userId });
                io.to(userSocketId).emit("get_notifs", { data: allAlerts });
              }
            }
          }
        } catch (error) {
          console.error("Socket Message Error:", error.message);
          socket.emit("error_message", { message: "Failed to send message" });
        }
      },
    );

    // get message notification in real time
    socket.on("get_notifs", async ({ userId }) => {
      try {
        const findAlerts = await Unread.find({ reciever: userId });
        if (!findAlerts) {
          throw new Error("notifications not found!");
        }
        socket.emit("get_notifs", { data: findAlerts });
      } catch (error) {
        console.log(error.message);
      }
    });

    // read team message(s)
    socket.on("read_msg", async ({ userId, roomId }) => {
      try {
        const delAlerts = await Unread.deleteMany({
          team: roomId,
          reciever: userId,
        });
        if (!delAlerts) {
          throw new Error("notifications not deleted!");
        }
        const findAlerts = await Unread.find({ reciever: userId });
        if (!findAlerts) {
          throw new Error("notifications not found!");
        }
        const findSocketId = getKeyByValue(onlineUsers, userId);
        if (findSocketId !== null || findSocketId !== undefined) {
          io.to(findSocketId).emit("get_notifs", { data: findAlerts });
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    // delete your own team message
    socket.on(
      "remove-msg",
      async ({
        roomId,
        messageId,
      }) => {
        try {
          const delMsg = await Team.findByIdAndUpdate(
            roomId,
            {
              $pull: {
                messages: { _id: messageId }, // Match ONLY by the unique ID
              },
            },
            { new: true },
          );
          if (!delMsg) {
            throw new Error("Message not deleted!");
          }

          io.to(roomId).emit("remove-msg", { data: delMsg.messages });
        } catch (error) {
          console.log(error);
        }
      },
    );

    // get join requests in real time
    socket.on("get_join_alerts", async ({ userId }) => {
      try {
        const requests = await Request.find({
          "reciever.id": { $eq: userId },
        }).populate("sender.id")
          .populate("team.id")
          .lean();

        if (!requests) {
          throw new Error("Requests not found!");
        }

        socket.emit("get_alerts", { data: requests });
      } catch (error) {
        console.log(error.message);
      }
    });

    // send invitation to join a team
    socket.on(
      "invite",
      async ({
        senderName,
        senderId,
        teamName,
        teamId,
        recieverName,
        recieverId,
        email,
      }) => {
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
          if (members.some((m) => m.id === recieverId)) {
            return socket.emit("invite", {
              status: 403,
              message: "Already a member of the team!",
            });
          }

          //find same request
          const foundRequest = await Request.findOne({
            "sender.id": { $eq: senderId },
            "reciever.id": { $eq: recieverId },
            "team.id": { $eq: teamId },
          });
          if (foundRequest) {
            return socket.emit("invite", {
              status: 500,
              message: "Invitation already sent!",
            });
          }

          // if no request found, send invitation
          const sendInvite = await Request.create(invitationData);
          if (!sendInvite) {
            return socket.emit("invite", {
              status: 500,
              message: "Can't send invitation!",
            });
          }

          //send an email to the user with notification link
          const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>Team Invitation</title>
            </head>
            <body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table table width = "100%" cellpadding = "0" cellspacing = "0" style = "padding:40px 0;" >
              <tr>
                <td align="center">

                  <!-- Main Card -->
                  <table width="100%" max-width="520" cellpadding="0" cellspacing="0"
                    style="background:#111827; border-radius:16px; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.4);">

                    <!-- Logo / App Name -->
                    <tr>
                      <td style="text-align:center; padding-bottom:24px;">
                        <p style="margin:0; font-size:18px; font-weight:600;">
                          <span style="font-weight:300; font-size:14px; color:#E3E3E3;">find your</span>
                          <span style="color:#B98EFD;"> HackathonMates</span>
                        </p>
                      </td>
                    </tr>

                    <!-- Heading -->
                    <tr>
                      <td style="padding-bottom:16px;">
                        <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:600;">
                          You're invited to join a team
                        </h1>
                      </td>
                    </tr>

                    <!-- Body Text -->
                    <tr>
                      <td style="color:#cbd5e1; font-size:15px; line-height:1.6; padding-bottom:24px;">
                        <p style="margin:0 0 10px 0;">Hi <strong>${recieverName}</strong>,</p>
                        <p style="margin:0 0 10px 0;">
                          <strong>${senderName}</strong> has invited you to join the team
                          <strong style="color:#ffffff;">${teamName}</strong>.
                        </p>
                        <p style="margin:0;">
                          Click the button below to view your invitation and get started.
                        </p>
                      </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                      <td align="center" style="padding-bottom:28px;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile/joinRequests"
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
                          View Invitation
                        </a>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="border-top:1px solid #1f2937; padding-top:20px;">
                        <p style="color:#6b7280; font-size:12px; margin:0; text-align:center;">
                          If you didn’t expect this invitation, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                  </table>

                  <!-- Footer -->
                  <table width="100%" max-width="520" style="margin-top:16px;">
                    <tr>
                      <td style="text-align:center; color:#6b7280; font-size:12px;">
                        © ${new Date().getFullYear()} Your App. All rights reserved.
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table >
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
            from: `"The Admin of ${teamName}, via findYourHackathonmates"`, // sender address
            to: email,
            subject: `Team joining Invitation from ${teamName}`, // Subject line
            text: "Regarding your team joining invitation!",
            html: html, // html body
          });

          if (info.accepted) {
            const recieverSocketId = onlineUsers.get(recieverId);
            if (recieverSocketId) {
              const notifs = await Request.find({
                "reciever.id": { $eq: recieverId },
              }).populate("team.id").populate("sender.id").lean();
              if (!notifs) {
                throw new Error("Notifications not found!");
              }
              io.to(recieverSocketId).emit("get_alerts", {
                data: notifs,
              });
            }

            socket.emit("invite", {
              status: 200,
              message: "Invitation sent successfully!",
            });
          } else if (info.rejected) {
            return socket.emit("invite", {
              status: 500,
              message: "Something went wrong! Please try again later.",
            });
          }
        } catch (error) {
          console.log(error.message);
        }
      },
    );

    // send join request to the team admin
    socket.on(
      "apply-to-join",
      async ({ teamName, teamId, recieverId, teamEmail, myId, myName }) => {
        try {
          const getReciever = await User.findById(recieverId);
          if (!getReciever) {
            throw new Error("Reciever not found!");
          }

          const recieverName = getReciever.name;

          const requestData = {
            message: `${myName} sent a request to join your team ${teamName}`,
            team: {
              name: teamName,
              id: teamId,
            },
            reciever: {
              name: recieverName,
              id: recieverId,
            },
            sender: {
              name: myName,
              id: myId,
            },
          };

          //find same join application
          const foundRequest = await Request.findOne({
            "sender.id": { $eq: myId },
            "reciever.id": { $eq: recieverId },
            "team.id": { $eq: teamId },
          });
          if (foundRequest) {
            return socket.emit("applied-to-join", {
              status: 500,
              message: "Join application aleady sent!",
            });
          }

          const ApplyToJoin = await Request.create(requestData);
          if (!ApplyToJoin) {
            throw new Error("Application not successful!");
          }

          //send an email to the user with notification link
          const html = `
          <!DOCTYPE html>

            <html>
              <head>
                <meta charset="UTF-8" />
                <title>New Join Request</title>
              </head>

              <body style="margin:0; padding:0; background-color:#0f172a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">


                 <table width = "100%" cellpadding = "0" cellspacing = "0" style = "padding:40px 0;" >
                  <tr>
                    <td align="center">

                      <!-- Card Container -->
                      <table width="100%" max-width="520" cellpadding="0" cellspacing="0"
                        style="background:#111827; border-radius:16px; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.4);">

                        <!-- Header -->
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
                              New Team Join Request
                            </h1>
                          </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                          <td style="color:#cbd5e1; font-size:15px; line-height:1.6; padding-bottom:24px;">
                            <p style="margin:0 0 10px 0;">
                              Hi <strong>${recieverName}</strong>,
                            </p>

                            <p style="margin:0 0 10px 0;">
                              <strong style="color:#ffffff;">${myName}</strong> has requested to join your team
                              <strong style="color:#ffffff;">${teamName}</strong>.
                            </p>

                            <p style="margin:0;">
                              Review their request and decide whether to accept or decline.
                            </p>
                          </td>
                        </tr>

                        <!-- CTA Button -->
                        <tr>
                          <td align="center" style="padding-bottom:28px;">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile/joinRequests"
                              style="
                              display:inline-block;
                              padding:12px 24px;
                              background:linear-gradient(135deg,#22c55e,#16a34a);
                              color:#ffffff;
                              text-decoration:none;
                              font-size:14px;
                              font-weight:600;
                              border-radius:8px;
                              box-shadow:0 6px 20px rgba(34,197,94,0.4);
                            ">
                              Review Request
                            </a>
                          </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                          <td style="border-top:1px solid #1f2937; padding-top:20px;">
                            <p style="color:#6b7280; font-size:12px; margin:0; text-align:center;">
                              You can manage all join requests from your dashboard anytime.
                            </p>
                          </td>
                        </tr>

                  </table>

                  <!-- Footer -->
                  <table width="100%" max-width="520" style="margin-top:16px;">
                    <tr>
                      <td style="text-align:center; color:#6b7280; font-size:12px;">
                        © ${new Date().getFullYear()} Your App. All rights reserved.
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
            from: `"${myName} via findYourHackathonmates"`, // sender address
            to: teamEmail,
            subject: `Team joining request from ${myName}`, // Subject line
            text: "Regarding the request to join your team!",
            html: html, // html body
          });

          if (info.accepted) {
            const recieverSocketId = onlineUsers.get(recieverId);
            if (recieverSocketId) {
              const notifs = await Request.find({
                "reciever.id": { $eq: recieverId },
              }).populate("team.id").populate("sender.id").lean()
              if (!notifs) {
                throw new Error("Notifications not found!");
              }
              io.to(recieverSocketId).emit("get_alerts", {
                data: notifs,
              });
            }

            socket.emit("applied-to-join", {
              status: 200,
              message: "Applied successfully!",
            });
          } else if (info.rejected) {
            return socket.emit("applied-to-join", {
              status: 500,
              message: "Something went wrong! Please try again later.",
            });
          }
        } catch (error) {
          console.log(error.message);
        }
      },
    );

    //accept & reject invitations & applications

    //accept a join request
    socket.on(
      "accept-alert",
      async ({
        message,
        senderName,
        senderId,
        teamId,
        recieverName,
        recieverId,
        reqId,
      }) => {
        //invitation or application
        const isInvitation = message.includes("invited you to join");
        const findTeam = await Team.findById(teamId);
        try {
          if (isInvitation) {
            //find if the user is already in the team
            let members = findTeam.members;
            if (members.some((m) => m.id === recieverId)) {
              throw new Error("Team mate already exists in Team!");
            }
            //update the team
            const updateTeam = await Team.findByIdAndUpdate(teamId, {
              $push: {
                members: {
                  name: recieverName,
                  id: recieverId,
                },
              },
            });
            if (!updateTeam) {
              throw new Error("Team not updated!");
            }
            //update the user
            const updateUser = await User.findByIdAndUpdate(recieverId, {
              $push: {
                teams: teamId,
              },
            });
            if (!updateUser) {
              throw new Error("User not updated!");
            }
            //find the request & delete it
            const requestEl = await Request.findByIdAndDelete(reqId);
            if (!requestEl) {
              throw new Error("Request not deleted!");
            }

            const recieverSocketId = onlineUsers.get(recieverId);
            if (recieverSocketId) {
              const notifs = await Request.find({
                "reciever.id": { $eq: recieverId },
              }).populate("team.id").populate("sender.id").lean()

              io.to(recieverSocketId).emit("get_alerts", {
                data: notifs,
              });
            }

            socket.emit("accept-alert", {
              status: 200,
              message: "Accepted!",
            });
          } else {
            //application accepting
            // here the sender will be added to the team if application is accepted
            let members = findTeam.members;
            if (members.some((m) => m.id === senderId)) {
              throw new Error("Team mate already exists in Team!");
            }
            //update the team
            const updateTeam = await Team.findByIdAndUpdate(teamId, {
              $push: {
                members: {
                  name: senderName,
                  id: senderId,
                },
              },
            });
            if (!updateTeam) {
              throw new Error("Team not updated!");
            }
            //update the user
            //update the sender's teams
            const updateUser = await User.findByIdAndUpdate(senderId, {
              $push: {
                teams: teamId,
              },
            });
            if (!updateUser) {
              throw new Error("User not updated!");
            }

            //find the request & delete it
            const requestEl = await Request.findByIdAndDelete(reqId);
            if (!requestEl) {
              throw new Error("Request not deleted!");
            }

            const recieverSocketId = onlineUsers.get(recieverId);
            if (recieverSocketId) {
              const notifs = await Request.find({
                "reciever.id": { $eq: recieverId },
              }).populate("team.id").populate("sender.id").lean()

              io.to(recieverSocketId).emit("get_alerts", {
                data: notifs,
              });
            }

            socket.emit("accept-alert", {
              status: 200,
              message: "Accepted!",
            });
          }
        } catch (error) {
          return socket.emit("accept-alert", {
            status: 500,
            message: error.message,
          });
        }
      },
    );
    //reject a join request
    socket.on("reject-alert", async ({ reqId, myId }) => {
      try {
        const requestEl = await Request.findByIdAndDelete(reqId);

        if (!requestEl) {
          return socket.emit("reject-alert", {
            status: 404,
            message: "Request not found!",
          });
        }

        const recieverSocketId = onlineUsers.get(myId);
        if (recieverSocketId) {
          const notifs = await Request.find({
            "reciever.id": { $eq: myId },
          }).populate("team.id").populate("sender.id").lean()

          io.to(recieverSocketId).emit("get_alerts", {
            data: notifs,
          });
        }

        socket.emit("reject-alert", {
          status: 200,
          message: "Rejected!",
        });
      } catch (error) {
        console.log(error);
      }
    });

    // add a link into the group
    socket.on("set_link", async ({ teamId, linkName, link }) => {
      try {
        const saveLink = await Team.findByIdAndUpdate(
          { _id: teamId },
          {
            $push: {
              links: {
                name: linkName,
                link: link,
              },
            },
          },
        );

        if (!saveLink) {
          throw new Error("Link not saved");
        }
        socket.emit("set_link", { linkName, link });
      } catch (error) {
        console.log(error);
        console.log(error.message);
      }
    });
    // remove a team member from team
    socket.on("set_member", async ({ teamId, memberName, memberId }) => {
      try {
        const removeMember = await Team.findByIdAndUpdate(
          { _id: teamId },
          {
            $pull: {
              members: {
                name: memberName,
                id: memberId,
              },
            },
          },
        );
        if (!removeMember) {
          throw new Error("Member not removed");
        }
        const removeTeam = await User.findByIdAndUpdate(
          { _id: memberId },
          {
            $pull: {
              teams: teamId,
            },
          },
        );
        if (!removeTeam) {
          throw new Error("Team not removed");
        }
        socket.emit("set_member", { memberName, memberId }); // socket event
      } catch (error) {
        console.log(error);
        console.log(error.message);
      }
    });

    // leave the app
    socket.on("disconnect", () => {
      const key = getKeyByValue(onlineUsers, socket.id);
      if (key !== null) {
        onlineUsers.delete(key);
      }
      console.log(`Disconnected ${socket.id}`);
    });
  });

  // start the server
  server.listen(port, () => {
    if (dev) {
      console.log(`Server running on http://${hostname}:${port}`);
    } else {
      console.log("find your HackathonMates server is running!");
    }
  });
});
