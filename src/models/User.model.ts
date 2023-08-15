import { model, Schema, Types } from "mongoose";

import { EUserAccount, EUserRole } from "../enums";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: EUserRole,
      default: EUserRole.SELLER,
    },
    account: {
      type: String,
      enum: EUserAccount,
      default: EUserAccount.BASIC,
    },
    _company: {
      type: Types.ObjectId,
      ref: "company",
    },
    _carAds: [
      {
        type: Types.ObjectId,
        ref: "carAd",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const User = model("user", userSchema);
