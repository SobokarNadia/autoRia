import { NextFunction, Request, Response } from "express";

import { carAdService, statisticInfoService } from "../services";
import { ICarAd, IPaginationResponse, IQuery } from "../types";

class CarAdController {
  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { _id, role } = req.res.locals.payload;

      await carAdService.create(req.body, _id, role);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IPaginationResponse<ICarAd>>> {
    try {
      const result = await carAdService.getAll(req.query as IQuery);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICarAd>> {
    try {
      await statisticInfoService.addView(req.params.carAdId);

      return res.status(200).json(req.res.locals.carAd);
    } catch (e) {
      next(e);
    }
  }

  public async getStatisticInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const carAd = req.res.locals.carAd;

      const statistic = await statisticInfoService.getStatisticInfo(
        req.params.carAdId,
        carAd,
      );
      return res.status(200).json(statistic);
    } catch (e) {
      next(e);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await carAdService.update(req.body, req.params.carAdId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { _user: userId, _company: companyId } = req.res.locals.carAd;
      await carAdService.delete(req.params.carAdId, userId, companyId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const carAdController = new CarAdController();
