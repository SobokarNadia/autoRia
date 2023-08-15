import { Types } from "mongoose";

import { EUserRole } from "../enums";
import { ApiError } from "../errors/api.error";
import { CarAd, Company, User } from "../models";
import { ICompany, IUser } from "../types";
import { authService } from "./auth.service";

class CompanyService {
  public async create(data: ICompany, userId: string): Promise<void> {
    try {
      const company = await Company.create({
        ...data,
        _users: [new Types.ObjectId(userId)],
      });
      await User.findByIdAndUpdate(userId, {
        role: EUserRole.COMPANY_ADMINISTRATOR,
        _company: company._id,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(data: ICompany, companyId: string): Promise<void> {
    try {
      await Company.findByIdAndUpdate(companyId, { ...data });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getCompanyWithUsersAndCarAds(
    companyId: string,
  ): Promise<ICompany> {
    try {
      return await Company.findById(companyId)
        .populate("_carAds")
        .populate("_users");
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async delete(companyId: string): Promise<void> {
    try {
      await Promise.all([
        await Company.findByIdAndDelete(companyId),
        await User.updateMany(
          { _company: companyId },
          { _company: null, role: EUserRole.SELLER },
        ),
        await CarAd.deleteMany({ _company: companyId }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async createCompanyManager(
    data: IUser,
    companyId: string,
  ): Promise<void> {
    try {
      const newManager = await authService.register({
        ...data,
        _company: new Types.ObjectId(companyId),
        role: EUserRole.COMPANY_MANAGER,
      });

      await Company.findByIdAndUpdate(companyId, {
        $push: { _users: newManager._id },
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const companyService = new CompanyService();
