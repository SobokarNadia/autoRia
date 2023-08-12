import { EUserAccount, EUserRole } from "../enums";
import { ApiError } from "../errors/api.error";
import { CarAd, User } from "../models";
import { IUser, IUserUpdate } from "../types";
import { authService } from "./auth.service";

class UserService {
  public async update(data: IUserUpdate, userId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { ...data });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getUserWithCarAds(userId: string): Promise<IUser> {
    try {
      return await User.findById(userId).populate("_carAds");
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async delete(userId: string): Promise<void> {
    try {
      await Promise.all([
        await User.findByIdAndDelete(userId),
        await CarAd.deleteMany({ _user: userId }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async setPremiumAccount(userId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { account: EUserAccount.PREMIUM });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async createManager(data: IUser): Promise<void> {
    try {
      await authService.register({ ...data, role: EUserRole.MANAGER });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
