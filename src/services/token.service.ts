import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { EToken } from "../enums";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../types";

class TokenService {
  public createTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: EToken): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case EToken.ACCESSTOKEN:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case EToken.REFRESHTOKEN:
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token is not valid.", 401);
    }
  }
}

export const tokenService = new TokenService();
