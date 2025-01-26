import mongoose from "mongoose";

const teamModel = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, maxlength: 100, required: true },
    email: { type: String, required: true },
    members: {
      type: Array,
      items: {
        name: { type: String, required: true },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: {
      type: Array,
      items: { type: String },
      required: true,
    },
    messages: {
      type: Array,
      items: {
        attachment: {
          public_id: { type: String, required: true },
          url: { type: String, required: true },
        },
        message: { type: String },
        sentOn: { type: String, required: true },
        sender: {
          name: { type: String, required: true },
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
      },
    },
    links: {
      type: Array,
      items: {
        name: { type: String, required: true },
        link: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

const Team = mongoose.models.Team ?? mongoose.model("Team", teamModel);

export default Team;
