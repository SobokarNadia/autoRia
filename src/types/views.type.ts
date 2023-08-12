import { Types } from "mongoose";

export interface IViews {
  _id?: Types.ObjectId;
  _carAdId: Types.ObjectId;
}

// export interface IStatisticResponse{
//   viewsTotal: number;
//   viewsDay: number;
//   viewsWeek: number;
//   viewsMonth: number;
//   cityAveragePrice: number;
//   avaragePrice: number;
// }
