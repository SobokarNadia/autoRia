import { Types } from "mongoose";

import { ECurrency, EUserAccount } from "../enums";
import { ApiError } from "../errors/api.error";
import { CarAd, User, Views } from "../models";
import { ICarAd, ICarAdUpdate, IPaginationResponse, IQuery } from "../types";
import { currencyService } from "./currency.service";

class CarAdService {
  public async create(data: ICarAd, userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (user.account === EUserAccount.BASIC && user._carAds.length !== 0) {
        throw new ApiError(
          "As you have basic account, you can add just one ad.",
          400,
        );
      }

      const currencyData = await currencyService.getCurrency();
      const currency = await currencyService.updatePrices(
        data.price,
        data.currency as ECurrency,
        currencyData,
      );

      const carAd = await CarAd.create({
        ...data,
        _user: new Types.ObjectId(userId),
        ...currency,
      });
      await user.updateOne({ $push: { _carAds: carAd._id } });
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

  public async delete(carAdId: string, userId: string): Promise<void> {
    try {
      await Promise.all([
        CarAd.findByIdAndDelete(carAdId),
        User.findByIdAndUpdate(userId, {
          $pull: { _carAds: carAdId },
        }),
        Views.deleteMany({ _carAdId: carAdId }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const carAdService = new CarAdService();
