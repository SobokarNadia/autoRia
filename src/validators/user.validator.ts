import Joi from "joi";

import { regexConstants } from "../constants/regex.constants";
import { EUserAccount, EUserRole } from "../enums";

export class UserValidator {
  static firstName = Joi.string().min(2).max(30).trim();
  static lastName = Joi.string().min(2).max(30).trim();
  static role = Joi.valid(...Object.values(EUserRole));
  static account = Joi.valid(...Object.values(EUserAccount));
  static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim()
    .messages({
      "string.empty": "this field cannot be empty",
      "string.email": "your email is incorrect",
    });
  static password = Joi.string().regex(regexConstants.PASSWORD).trim();
  static phone = Joi.string().regex(regexConstants.PHONE).trim();

  static register = Joi.object({
    firstName: this.firstName.required(),
    lastName: this.lastName.required(),
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone,
  });

  static login = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static update = Joi.object({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
  });

  static changePassword = Joi.object({
    newPassword: this.password.required(),
    oldPassword: this.password.required(),
  });
}
