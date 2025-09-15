import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // owner
  balance: { type: Number, default: 0 }, // ERC-20 token balance

  // Transaction history array
  history: [
    {
      sender: { type: String, required: true },
      receiver: { type: String, required: true },
      tokenAmount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      itemId: { type: Schema.Types.ObjectId, ref: "LostItem" }, // optional link to item
      type: { type: String, enum: ["Lost", "Found", "Reward"], required: true },
    }
  ]
}, { timestamps: true });

export default model("Transaction", transactionSchema);
