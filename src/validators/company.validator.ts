import Joi from "joi";

import { regexConstants } from "../constants/regex.constants";

export class CompanyValidator {
  static companyName = Joi.string().min(2).max(30).trim();
  static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim()
    .messages({
      "string.empty": "this field cannot be empty",
      "string.email": "your email is incorrect",
    });
  static phone = Joi.string().regex(regexConstants.PHONE).trim();
  static description = Joi.string();
  static foundationYear = Joi.number().min(1700).max(2023);

  static create = Joi.object({
    companyName: this.companyName.required(),
    email: this.email.required(),
    description: this.description,
    foundationYear: this.foundationYear,
    phone: this.phone,
  });

  static update = Joi.object({
    companyName: this.companyName,
    email: this.email,
    phone: this.phone,
    foundationYear: this.foundationYear,
    description: this.description,
  });
}
