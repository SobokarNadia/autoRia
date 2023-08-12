import bcrypt from "bcrypt";

import { configs } from "../configs/config";

class PasswordService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, +configs.SECRET_SALT);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export const passwordService = new PasswordService();
