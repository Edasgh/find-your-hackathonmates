import mongoose from "mongoose";

const unreadModel = mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
);

const Unread = mongoose.models.Unread ?? mongoose.model("Unread", unreadModel);

export default Unread;
