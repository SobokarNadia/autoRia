import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { OldPassword } from "../models";

dayjs.extend(utc);

const passwordsRemover = async () => {
  const oneYear = dayjs().utc().subtract(1, "y");

  await OldPassword.deleteMany({ createdAt: { $lte: oneYear } });
};

export const removeOldPasswords = new CronJob("0 0 0 * * *", passwordsRemover);
