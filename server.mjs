import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
import Team from "./src/model/team-model.js";
import User from "./src/model/user-model.js";
import Request from "./src/model/request-model.js";

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
    //     try {
    //       const requests = await Request.find({
    //         "reciever.id": { $eq: userId },
    //       });
    //       if (!requests) {
    //         throw new Error("Requests not found!");
    //       }

    //       socket.emit("invite", { data: requests });
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
