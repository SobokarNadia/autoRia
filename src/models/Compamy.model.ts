import { model, Schema, Types } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    description: String,
    foundationYear: {
      type: Number,
      min: 1700,
      max: 2023,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    _carAds: [
      {
        type: Types.ObjectId,
        ref: "carAd",
      },
    ],
    _users: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Company = model("company", companySchema);
