import { NextFunction, Request, Response } from "express";

import { photosConfig } from "../configs";
import { ApiError } from "../errors/api.error";

class FileMiddleware {
  public isPhotosValid(req: Request, res: Response, next: NextFunction) {
    try {
      if (Array.isArray(req.files.photos)) {
        throw new ApiError("Avatar should contain just one file", 400);
      }

      const { mimetype, size } = req.files.photos;

      if (!photosConfig.MIMETYPES.includes(mimetype)) {
        throw new ApiError("Photo had invalid type of file", 400);
      }

      if (size > photosConfig.MAX_SIZE) {
        throw new ApiError("Photo is too big", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
