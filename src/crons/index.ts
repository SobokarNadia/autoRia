import { updateCurrency } from "./currencyUpdate.cron";
import { removeOldPasswords } from "./oldPasswordDelete";
import { removeOldTokens } from "./oldTokenDelete";

export const cronRunner = () => {
  updateCurrency.start();
  removeOldPasswords.start();
  removeOldTokens.start();
};
