import { Types } from "mongoose";

export interface ICarAd {
  _id?: Types.ObjectId;
  transportType?: string;
  brand?: string;
  model?: string;
  releaseYear?: number;
  mileage?: number;
  bodyType?: string;
  city?: string;
  price?: number;
  currency?: string;
  currencyUSD_UAH?: number;
  priceUSD?: number;
  priceUAH?: number;
  currencyEUR_UAH?: number;
  priceEUR?: number;
  VIN?: number;
  _user?: any;
  _company?: any;
}

export interface ICurrency {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export interface IResponseCurrency {
  currencyEUR_UAH?: number;
  priceEUR?: number;
  currencyUSD_UAH?: number;
  priceUSD?: number;
  priceUAH?: number;
}

export type ICarAdUpdate = Pick<
  ICarAd,
  | "transportType"
  | "brand"
  | "model"
  | "bodyType"
  | "city"
  | "price"
  | "currency"
  | "releaseYear"
>;
