import { Schema, model } from "mongoose";

const foundRequestSchema = new Schema(
  {
    founderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    founderName: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    image: { type: String }, // optional proof image
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const lostItemSchema = new Schema(
  {
    losterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    losterName: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    // Secret info as key:value array
    secretInfo: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],

    bounty: { type: Number, required: true, min: 5 }, // token bounty
    status: {
      type: String,
      enum: ["Lost", "Verifying", "Found", "Rejected"],
      default: "Lost",
    },

    verified: { type: Boolean, default: false }, // whether the loster has confirmed

    image: { type: String }, // optional image URL

    // Instead of single founder → collection of requests
    foundRequests: [foundRequestSchema],
  },
  { timestamps: true }
);

export default model("LostItem", lostItemSchema);
