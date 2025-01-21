import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
import Team from "./src/model/team-model.js";
import User from "./src/model/user-model.js";
import Request from "./src/model/request-model.js";
import { createTransport } from "nodemailer";

const onlineUsers = new Map();

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

    socket.on("visit", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on(
      "message",
      async ({
        roomId,
        public_id,
        url,
        message,
        senderId,
        senderName,
        sentOn,
      }) => {
        try {
          const saveMsg = await Team.findByIdAndUpdate(
            { _id: roomId },
            {
              $push: {
                messages: {
                  attachment: {
                    public_id,
                    url,
                  },
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
            .emit("message", {
              message,
              public_id,
              url,
              senderId,
              senderName,
              sentOn,
            });
        } catch (error) {
          console.log(error);
          console.log(error.message);
        }
      }
    );

    socket.on(
      "remove-msg",
      async ({
        roomId,
        public_id,
        url,
        message,
        senderId,
        senderName,
        sentOn,
      }) => {
        try {
          const delMsg = await Team.findByIdAndUpdate(
            roomId,
            {
              $pull: {
                messages: {
                  attachment: { public_id, url },
                  message: message,
                  sentOn: sentOn,
                  sender: {
                    name: senderName,
                    id: senderId,
                  },
                },
              },
            },
            { new: true }
          );
          if (!delMsg) {
            throw new Error("Message not deleted!");
          }

          io.to(roomId).emit("remove-msg", { data: delMsg.messages });
        } catch (error) {
          console.log(error);
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
              message: "Team mate already exists in team!",
            });
          }
          const sendInvite = await Request.create(invitationData);
          if (!sendInvite) {
            throw new Error("Can't send invitation!");
          }

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

          if (info.accepted) {
            const recieverSocketId = onlineUsers.get(recieverId);
            if (recieverSocketId) {
              const notifs = await Request.find({
                "reciever.id": { $eq: recieverId },
              });
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
            throw new Error("Something went wrong!");
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    );

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

          const ApplyToJoin = await Request.create(requestData);
          if (!ApplyToJoin) {
            throw new Error("Application not successful!");
          }

          //send an email to the user with notification link
          const html = `
          <p>Hi ${recieverName}, I would like to join your team ${teamName}</p>
          <p>${myName} has applied to you to join the ${teamName} team</p>
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
            from: `"${myName} via Hackathonmates ${process.env.GOOGLE_ACCOUNT_USER}"`, // sender address
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
              });
              if (!notifs) {
                throw new Error("Notifications not found!");
              }
              io.to(recieverSocketId).emit("get_alerts", {
                data: notifs,
              });
            }

            socket.emit("apply-to-join", {
              status: 200,
              message: "Applied successfully!",
            });
          } else if (info.rejected) {
            throw new Error("Something went wrong!");
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    );

    //accept & reject invitations & applications
    //accept
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
              });

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
              });

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
      }
    );
    //reject
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
          });

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
    if (dev) {
      console.log(`Server running on http://${hostname}:${port}`);
    } else {
      console.log("find your HackathonMates server is running!");
    }
  });
});
