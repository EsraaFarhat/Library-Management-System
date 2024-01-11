import Joi from "joi";

import BorrowersEntity from "../models/borrowers.model.mjs";

export default class BorrowersService {
  static async getBorrowerById(id, attributes) {
    const borrower = await BorrowersEntity.findByPk(id, {
      attributes,
    });
    return borrower;
  }

  static async getBorrower(filters, attributes) {
    const borrower = await BorrowersEntity.findOne({
      attributes,
      where: filters,
    });
    return borrower;
  }

  static async getBorrowers(filters, attributes, options) {
    const { order, orderBy, limit, offset } = options;

    const borrowers = await BorrowersEntity.findAndCountAll({
      attributes,
      where: filters,
      offset,
      limit,
      order: [[orderBy, order]],
    });
    return borrowers;
  }

  static async addBorrower(body) {
    let borrower = await BorrowersEntity.create(body);
    return borrower;
  }

  static async updateBorrower(filters, body) {
    const borrower = await BorrowersEntity.update(body, {
      where: filters,
      returning: true,
    });
    if (borrower[0] == 0) return null;
    return borrower[1][0];
  }

  static async count(filters) {
    const count = await BorrowersEntity.count(filters);
    return count;
  }

  static async deleteBorrower(filters) {
    const borrower = await BorrowersEntity.destroy({ where: filters });
    return borrower;
  }

  static createBorrowerSchema = (borrower) => {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      email: Joi.string().email().max(255).required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .trim()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,}$/
        )
        .messages({
          "string.base": "Password must be a string.",
          "string.empty": "Password cannot be empty.",
          "string.min": "Password must be at least 6 characters long.",
          "string.pattern.base": `password must include at least one number, an uppercase letter, a lowercase letter and a special character.`,
          "any.required": "Password is required and cannot be null.",
        })
        .required(),
    });

    return schema.validate(borrower);
  };

  static updateBorrowerSchema = (borrower) => {
    const schema = Joi.object({
      name: Joi.string().max(255),
      email: Joi.string().email().max(255),
      password: Joi.string()
        .min(6)
        .max(30)
        .trim()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,}$/
        )
        .messages({
          "string.base": "Password must be a string.",
          "string.empty": "Password cannot be empty.",
          "string.min": "Password must be at least 6 characters long.",
          "string.pattern.base": `password must include at least one number, an uppercase letter, a lowercase letter and a special character.`,
          "any.required": "Password is required and cannot be null.",
        }),
    });

    return schema.validate(borrower);
  };

  static borrowBooksSchema = (body) => {
    const schema = Joi.object({
      booksIds: Joi.array().items(Joi.string().uuid()).required(),
      dueDate: Joi.date().required(),
    });

    return schema.validate(body);
  };

  static returnBooksSchema = (body) => {
    const schema = Joi.object({
      borrowingsIds: Joi.array().items(Joi.string().uuid()).required(),
    });

    return schema.validate(body);
  };

  static borrowerLoginSchema = (body) => {
    const schema = Joi.object({
      email: Joi.string().max(255).email().required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .trim()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,}$/
        )
        .messages({
          "string.base": "Password must be a string.",
          "string.empty": "Password cannot be empty.",
          "string.min": "Password must be at least 6 characters long.",
          "string.pattern.base": `password must include at least one number, an uppercase letter, a lowercase letter and a special character.`,
          "any.required": "Password is required and cannot be null.",
        })
        .required(),
    });
    return schema.validate(body);
  };
}
