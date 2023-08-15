import { Types } from "mongoose";

import { ApiError } from "../errors/api.error";
import { OldPassword, Token, User } from "../models";
import {
  IChangePassword,
  ICredentials,
  ITokenPair,
  ITokenPayload,
  IUser,
} from "../types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser): Promise<IUser> {
    try {
      const { password } = data;

      const hashedPassword = await passwordService.hash(password);

      return await User.create({ ...data, password: hashedPassword });
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

  public async changePassword(
    data: IChangePassword,
    userId: Types.ObjectId,
  ): Promise<void> {
    try {
      const user = await User.findById(userId).select("password");

      if (data.newPassword === data.oldPassword) {
        throw new ApiError(
          "You should set a new password if you want to change it.",
          400,
        );
      }

      const oldPasswords = await OldPassword.find({ _user: userId });
      await oldPasswords.map(async ({ password: hash }) => {
        const isMatched = await passwordService.compare(data.newPassword, hash);

        if (isMatched) {
          throw new ApiError(
            "This password has already been your password. You should create total new one.",
            400,
          );
        }
      });

      const isMatched = await passwordService.compare(
        data.oldPassword,
        user.password,
      );

      if (!isMatched) {
        throw new ApiError("Wrong old password", 400);
      }

      const newHash = await passwordService.hash(data.newPassword);
      await Promise.all([
        User.updateOne({ _id: userId }, { password: newHash }),
        OldPassword.create({ password: user.password, _user: userId }),
      ]);
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
