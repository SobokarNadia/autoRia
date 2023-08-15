import { NextFunction, Request, Response } from "express";

import { companyService } from "../services/company.service";
import { ICompany } from "../types";

class CompanyController {
  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { _id: userId } = req.res.locals.payload;

      await companyService.create(req.body, userId);

      return res.sendStatus(200);
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
      const data = req.body;
      const companyId = req.params.companyId;

      await companyService.update(data, companyId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async getCompanyWithUsersAndCarAds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICompany>> {
    try {
      const companyId = req.params.companyId;

      const company = await companyService.getCompanyWithUsersAndCarAds(
        companyId,
      );

      return res.status(200).json(company);
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
      const companyId = req.params.companyId;

      await companyService.delete(companyId);

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
      const companyId = req.params.companyId;

      await companyService.createCompanyManager(data, companyId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const companyController = new CompanyController();
