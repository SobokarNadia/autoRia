import { Types } from "mongoose";

export interface ICompany {
  _id?: Types.ObjectId;
  companyName?: string;
  email?: string;
  phone?: string;
  description?: string;
  foundationYear?: number;
  _carAds?: any;
  _users?: any;
}
