import { Types } from "mongoose";

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
  _company?: any;
}

export type ICredentials = Pick<IUser, "email" | "password">;

export type IUserUpdate = Pick<
  IUser,
  "email" | "firstName" | "lastName" | "phone"
>;

export interface IChangePassword {
  newPassword: string;
  oldPassword: string;
}
