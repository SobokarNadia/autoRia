import { NextFunction, Request, Response } from "express";

import { userService } from "../services";
import { IUser } from "../types";

class UserController {
  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const data = req.body;
      const userId = req.params.userId;

      await userService.update(data, userId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async getUserWithCarAds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const userId = req.params.userId;
      const user = await userService.getUserWithCarAds(userId);

      return res.status(200).json(user);
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
      const userId = req.params.userId;

      await userService.delete(userId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async setPremiumAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { _id } = req.res.locals.payload;

      await userService.setPremiumAccount(_id);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async createManager(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const data = req.body;

      await userService.createManager(data);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
