import mongoose from "mongoose";

const requestModel = mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: {
      name: { type: String, required: true },
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    team: {
      name: { type: String, required: true },
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    },
    reciever: {
      name: { type: String, required: true },
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
  },
  { timestamps: true }
);

const Request =
  mongoose.models.Request ?? mongoose.model("Request", requestModel);

export default Request;
