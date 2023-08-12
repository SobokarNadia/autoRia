import { Types } from "mongoose";

import { ApiError } from "../errors/api.error";
import { Token, User } from "../models";
import { ICredentials, ITokenPair, ITokenPayload, IUser } from "../types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser): Promise<void> {
    try {
      const { password } = data;

      const hashedPassword = await passwordService.hash(password);

      await User.create({ ...data, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    userId: Types.ObjectId,
  ): Promise<ITokenPair> {
    try {
      const { role, password } = await User.findById(userId).select(
        "+password",
      );

      const isMatched = await passwordService.compare(
        credentials.password,
        password,
      );

      if (!isMatched) {
        throw new ApiError("Your email or password is not correct.", 400);
      }

      const tokenPair = tokenService.createTokenPair({
        _id: userId,
        role,
      });

      await Token.create({ ...tokenPair, _userId: userId });

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    oldTokenPair: ITokenPair,
  ): Promise<ITokenPair> {
    try {
      const newTokenPair = await tokenService.createTokenPair({
        _id: payload._id,
        role: payload.role,
      });

      await Promise.all([
        Token.deleteOne({ refresh: oldTokenPair.refreshToken }),
        Token.create({ ...newTokenPair, _userId: payload._id }),
      ]);

      return newTokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async logout(oldToken: ITokenPair): Promise<void> {
    try {
      await Token.deleteOne({ accessToken: oldToken.accessToken });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
