import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
import Team from "./src/model/team-model.js";
import User from "./src/model/user-model.js";
import Request from "./src/model/request-model.js";
// import { createTransport } from "nodemailer";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = createServer(handle);

  const io = new Server(server);

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
    socket.on(
      "message",
      async ({ roomId, message, senderId, senderName, sentOn }) => {
        try {
          const saveMsg = await Team.findByIdAndUpdate(
            { _id: roomId },
            {
              $push: {
                messages: {
                  message: message,
                  sentOn: sentOn,
                  sender: {
                    name: senderName,
                    id: senderId,
                  },
                },
              },
            }
          );
          if (!saveMsg) {
            throw new Error("Message not saved");
          }
          const currentTeam = await Team.findById(roomId);
          if (!currentTeam) {
            throw new Error("Team not found!");
          }
          socket
            .to(roomId)
            .emit("message", { message, senderId, senderName, sentOn });
        } catch (error) {
          console.log(error);
          console.log(error.message);
        }
      }
    );
    // get join requests in real time
    socket.on("get_alerts", async ({ userId }) => {
      try {
        const requests = await Request.find({
          "reciever.id": { $eq: userId },
        });
        if (!requests) {
          throw new Error("Requests not found!");
        }

        socket.emit("get_alerts", { data: requests });
      } catch (error) {
        console.log(error.message);
      }
    });

    // socket.on(
    //   "invite",
    //   async ({
    //     senderName,
    //     senderId,
    //     teamName,
    //     teamId,
    //     recieverName,
    //     recieverId,
    //     email,
    //   }) => {
    //     //email = reciever's email

    //     const invitationData = {
    //       message: `${senderName} has invited you to join ${teamName} team`,
    //       sender: {
    //         name: senderName,
    //         id: senderId,
    //       },
    //       team: {
    //         name: teamName,
    //         id: teamId,
    //       },
    //       reciever: {
    //         name: recieverName,
    //         id: recieverId,
    //       },
    //     };

    //     try {
    //       const findTeam = await Team.findById(teamId);
    //       let members = findTeam.members;
    //       if (members.some((m) => m.id === recieverId)) {
    //         return socket.emit("invite", {
    //           status: 403,
    //           message: "Team mate already exists in team!",
    //           data: null,
    //         });
    //       }
    //       const sendInvite = await Request.create(invitationData);
    //       if (!sendInvite) {
    //         throw new Error("Can't send invitation!");
    //       }

    //       //send an email to the user with notification link
    //       const html = `
    //     <p>Hi, ${recieverName},</p>
    //     <p>${senderName} has invited you to join ${teamName} team</p>
    //     <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile/joinRequests">View Here</a>
    //     <p>Best regards, happy Hacking!</p>
    //   `;
    //       const transporter = createTransport({
    //         service: "gmail",
    //         host: "smtp.gmail.com",
    //         port: 587,
    //         auth: {
    //           user: process.env.GOOGLE_ACCOUNT_USER,
    //           pass: process.env.GOOGLE_ACCOUNT_PASS,
    //         },
    //       });

    //       // sending email with nodemailer
    //       const info = await transporter.sendMail({
    //         from: `"The Admin of ${teamName}, via Hackathonmates ${process.env.GOOGLE_ACCOUNT_USER}"`, // sender address
    //         to: email,
    //         subject: `Team joining Invitation from ${teamName}`, // Subject line
    //         text: "Regarding your team joining invitation!",
    //         html: html, // html body
    //       });

    //       if (info.accepted) {
    //         return socket.emit("invite", {
    //           status: 200,
    //           message: "Invitation sent successfully!",
    //           data: sendInvite,
    //         });

    //       } else if (info.rejected) throw new Error("Something went wrong!");
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   }
    // );

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
          }
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
          }
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
          }
        );
        if (!removeTeam) {
          throw new Error("Team not removed");
        }
        socket.emit("set_member", { memberName, memberId });
      } catch (error) {
        console.log(error);
        console.log(error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected ${socket.id}`);
    });
  });

  server.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
