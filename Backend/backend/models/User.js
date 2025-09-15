import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // bcrypt hashed password
  role: { type: String, enum: ["Student", "Staff", "Other"], default: "Student" },
  accountAddress: { type: String, required: true }, // ERC-20 wallet address
}, { timestamps: true });

export default model("User", userSchema);
