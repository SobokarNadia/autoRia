import { CronJob } from "cron";

import { ECurrency } from "../enums";
import { CarAd } from "../models";
import { currencyService } from "../services";

const currencyUpdate = async (): Promise<void> => {
  const carAds = await CarAd.find();
  const currencyData = await currencyService.getCurrency();

  carAds.map(async (carAd) => {
    await currencyService.updatePrices(
      carAd.price,
      carAd.currency as ECurrency,
      currencyData,
    );
  });
};

export const updateCurrency = new CronJob("0 0 * * *", currencyUpdate);
