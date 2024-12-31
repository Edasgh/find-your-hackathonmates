import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    githubID: { type: String, required: true },
    bio: { type: String, required: true, maxlength: 100 },
    skills: { type: Array, items: { type: String, required: true },minlength:5 },
    teams:{type:Array,items:{type:mongoose.Schema.Types.ObjectId,ref:"Team"}},
    password: { type: String, required: true, minlength: 8 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userModel.methods.matchPassword = async function (enteredPW) {
  return await bcrypt.compare(enteredPW, this.password);
};


userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.models.User ?? mongoose.model("User", userModel);

export default User;
