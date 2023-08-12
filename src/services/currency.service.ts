import axios from "axios";

import { configs } from "../configs/config";
import { ECurrency } from "../enums";
import { ApiError } from "../errors/api.error";
import { ICurrency, IResponseCurrency } from "../types";

class CurrencyService {
  public async getCurrency(): Promise<ICurrency[]> {
    const { data, status } = await axios.get(configs.PRIVAT_API_URL);

    if (status !== 200) {
      throw new ApiError("Something gone wrong with privat API.", 400);
    }

    return data;
  }
  public async updatePrices(
    price: number,
    type: ECurrency,
    data: ICurrency[],
  ): Promise<IResponseCurrency> {
    try {
      switch (type) {
        case ECurrency.UAH:
          return {
            currencyEUR_UAH: parseFloat(data[0].sale),
            priceEUR: Math.floor(price / +data[0].sale),
            currencyUSD_UAH: parseFloat(data[1].sale),
            priceUSD: Math.floor(price / +data[1].sale),
            priceUAH: null,
          };
        case ECurrency.EUR:
          return {
            currencyEUR_UAH: parseFloat(data[0].sale),
            priceUAH: Math.floor(price * +data[0].sale),
            priceEUR: null,
            currencyUSD_UAH: null,
            priceUSD: null,
          };
        case ECurrency.USD:
          return {
            currencyUSD_UAH: parseFloat(data[1].sale),
            priceUAH: Math.floor(price * +data[1].sale),
            priceUSD: null,
            priceEUR: null,
            currencyEUR_UAH: null,
          };
      }
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const currencyService = new CurrencyService();
