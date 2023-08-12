import { model, Schema, Types } from "mongoose";

import { CarAd } from "./CarAd.model";

const viewsSchema = new Schema(
  {
    _carAdId: {
      type: Types.ObjectId,
      ref: CarAd,
    },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

export const Views = model("views", viewsSchema);
