import { UploadedFile } from "express-fileupload";
import { Types } from "mongoose";

import { ECurrency, EUserRole } from "../enums";
import { ApiError } from "../errors/api.error";
import { CarAd, Company, User, Views } from "../models";
import { ICarAd, ICarAdUpdate, IPaginationResponse, IQuery } from "../types";
import { currencyService } from "./currency.service";
import { s3Service } from "./s3.service";

class CarAdService {
  public async create(
    data: ICarAd,
    userId: string,
    role: string,
  ): Promise<void> {
    try {
      const user = await User.findById(userId);

      const currencyData = await currencyService.getCurrency();
      const currency = await currencyService.updatePrices(
        data.price,
        data.currency as ECurrency,
        currencyData,
      );

      if (
        role === EUserRole.MANAGER ||
        role === EUserRole.SELLER ||
        role === EUserRole.ADMINISTRATOR
      ) {
        const carAd = await CarAd.create({
          ...data,
          _user: new Types.ObjectId(userId),
          ...currency,
        });

        await User.findByIdAndUpdate(userId, { $push: { _carAds: carAd._id } });
      } else if (
        role === EUserRole.COMPANY_MANAGER ||
        role === EUserRole.COMPANY_ADMINISTRATOR
      ) {
        const carAd = await CarAd.create({
          ...data,
          _company: user._company,
          ...currency,
        });

        await Company.findByIdAndUpdate(user._company, {
          $push: { _carAds: carAd._id },
        });
      } else {
        throw new ApiError("Problems with car creation.", 400);
      }
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getAll(query: IQuery): Promise<IPaginationResponse<ICarAd>> {
    try {
      const queryStr = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
      );

      const {
        page = 1,
        limit = 10,
        sortedBy = "createdAt",
        ...searchObj
      } = queryObj;

      const [entities, totalCount, itemsFound] = await Promise.all([
        CarAd.find(searchObj)
          .limit(+limit)
          .skip(+limit * (+page - 1))
          .sort(sortedBy),
        CarAd.count(),
        CarAd.count(searchObj),
      ]);

      return {
        page: +page,
        perPage: +limit,
        totalCount,
        itemsFound,
        entities,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(data: ICarAdUpdate, carAdId: string): Promise<void> {
    try {
      if (data.price || data.currency) {
        const user = await CarAd.findById(carAdId);

        const currencyData = await currencyService.getCurrency();
        const currency = await currencyService.updatePrices(
          data.price || user.price,
          (data.currency || user.currency) as ECurrency,
          currencyData,
        );
        await CarAd.findByIdAndUpdate(carAdId, { ...data, ...currency });
      } else {
        await CarAd.findByIdAndUpdate(carAdId, { ...data });
      }
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async uploadPhoto(
    carAdId: string,
    photos: UploadedFile,
  ): Promise<void> {
    const pathToFile = await s3Service.uploadFile(photos, "carAd", carAdId);
    await CarAd.findByIdAndUpdate(carAdId, { $push: { photos: pathToFile } });
  }

  public async deletePhoto(
    carAdId: string,
    photoId: string,
    carAd: ICarAd,
  ): Promise<void> {
    const photo = carAd.photos.find((val) => val.includes(photoId));

    await Promise.all([
      s3Service.deleteFile(photo),
      CarAd.findByIdAndUpdate(carAdId, {
        $pull: { photos: photo },
      }),
    ]);
  }

  public async delete(
    carAdId: string,
    userId: string,
    companyId: string,
    carAd: ICarAd,
  ): Promise<void> {
    try {
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $pull: { _carAds: carAdId },
        });
      } else if (companyId) {
        await Company.findByIdAndUpdate(companyId, {
          $pull: { _carAds: carAdId },
        });
      }

      carAd.photos.map(async (photo) => await s3Service.deleteFile(photo));

      await Promise.all([
        CarAd.findByIdAndDelete(carAdId),
        Views.deleteMany({ _carAdId: carAdId }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const carAdService = new CarAdService();
