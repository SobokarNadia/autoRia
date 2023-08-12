import { updateCurrency } from "./currencyUpdate.cron";

export const cronRunner = () => {
  updateCurrency.start();
};
