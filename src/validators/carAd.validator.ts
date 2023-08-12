import Joi from "joi";

import {
  ECarBodyType,
  ECarBrand,
  ECarModel,
  ECurrency,
  ETransportType,
} from "../enums";

export class CarAdValidator {
  static transportType = Joi.valid(...Object.values(ETransportType));
  static brand = Joi.valid(...Object.values(ECarBrand));
  static model = Joi.valid(...Object.values(ECarModel));
  static releaseYear = Joi.number().min(1900).max(2023);
  static mileage = Joi.number();
  static bodyType = Joi.valid(...Object.values(ECarBodyType));
  static city = Joi.string();
  static price = Joi.number();
  static currency = Joi.valid(...Object.values(ECurrency));
  static VIN = Joi.number().unsafe();

  static create = Joi.object({
    transportType: this.transportType.required(),
    brand: this.brand.required(),
    model: this.model.required(),
    releaseYear: this.releaseYear.required(),
    mileage: this.mileage.required(),
    bodyType: this.bodyType.required(),
    city: this.city.required(),
    price: this.price.required(),
    currency: this.currency.required(),
    VIN: this.VIN.required(),
  });

  static update = Joi.object({
    transportType: this.transportType,
    brand: this.brand,
    model: this.model,
    releaseYear: this.releaseYear,
    bodyType: this.bodyType,
    city: this.city,
    price: this.price,
    currency: this.currency,
  });
}
