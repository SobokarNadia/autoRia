import { Types } from "mongoose";

// import { ICarAd } from "./carAd.type";

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  account?: string;
  password?: string;
  _carAds?: any;
}

export type ICredentials = Pick<IUser, "email" | "password">;

export type IUserUpdate = Pick<
  IUser,
  "email" | "firstName" | "lastName" | "phone"
>;
