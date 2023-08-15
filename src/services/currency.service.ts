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
      if (type === ECurrency.UAH) {
        return {
          currencyEUR_UAH: parseFloat(data[0].sale),
          priceEUR: Math.floor(price / +data[0].sale),
          currencyUSD_UAH: parseFloat(data[1].sale),
          priceUSD: Math.floor(price / +data[1].sale),
          priceUAH: null,
        };
      } else if (type === ECurrency.EUR) {
        return {
          currencyEUR_UAH: parseFloat(data[0].buy),
          priceUAH: Math.floor(price * +data[0].buy),
          priceEUR: null,
          currencyUSD_UAH: parseFloat(data[1].sale),
          priceUSD: Math.floor(
            (price * parseFloat(data[0].buy)) / +data[1].sale,
          ),
        };
      } else if (type === ECurrency.USD) {
        return {
          currencyUSD_UAH: parseFloat(data[1].buy),
          priceUAH: Math.floor(price * +data[1].buy),
          priceUSD: null,
          priceEUR: Math.floor(
            (price * parseFloat(data[1].buy)) / +data[0].sale,
          ),
          currencyEUR_UAH: parseFloat(data[0].sale),
        };
      }
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const currencyService = new CurrencyService();
