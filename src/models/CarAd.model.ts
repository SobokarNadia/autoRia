import { model, Schema, Types } from "mongoose";

import {
  ECarBodyType,
  ECarBrand,
  ECarModel,
  ECurrency,
  ETransportType,
} from "../enums";

const carAdSchema = new Schema(
  {
    transportType: {
      type: String,
      enum: ETransportType,
      required: true,
    },
    brand: {
      type: String,
      enum: ECarBrand,
      required: true,
    },
    model: {
      type: String,
      enum: ECarModel,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 1990,
      max: 2023,
    },
    mileage: {
      type: Number,
      required: true,
    },
    bodyType: {
      type: String,
      enum: ECarBodyType,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ECurrency,
      required: true,
    },
    currencyUSD_UAH: {
      type: Number,
    },
    priceUSD: {
      type: Number,
    },
    currencyEUR_UAH: {
      type: Number,
    },
    priceEUR: {
      type: Number,
    },
    priceUAH: {
      type: Number,
    },
    VIN: {
      type: Number,
      required: true,
      length: 17,
    },
    _user: {
      type: Types.ObjectId,
      ref: "user",
    },
    _company: {
      type: Types.ObjectId,
      ref: "company",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const CarAd = model("carAd", carAdSchema);
