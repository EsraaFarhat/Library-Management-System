import Joi from "joi";

import BooksEntity from "../models/books.model.mjs";

export default class BooksService {
  static async getBookById(id, attributes) {
    const book = await BooksEntity.findByPk(id, {
      attributes,
    });
    return book;
  }

  static async getBook(filters, attributes) {
    const book = await BooksEntity.findOne({
      attributes,
      where: filters,
    });
    return book;
  }

  static async getBooks(filters, attributes, options) {
    const { order, orderBy, limit, offset } = options;

    const books = await BooksEntity.findAndCountAll({
      attributes,
      where: filters,
      offset,
      limit,
      order: [[orderBy, order]],
    });
    return books;
  }

  static async addBook(body) {
    let book = await BooksEntity.create(body);
    return book;
  }

  static async updateBook(filters, body) {
    const book = await BooksEntity.update(body, {
      where: filters,
      returning: true,
    });
    if (book[0] == 0) return null;
    return book[1][0];
  }

  static async count(filters) {
    const count = await BooksEntity.count(filters);
    return count;
  }

  static async deleteBook(filters) {
    const book = await BooksEntity.destroy({ where: filters });
    return book;
  }

  static createBookSchema = (book) => {
    const schema = Joi.object({
      title: Joi.string().max(255).required(),
      author: Joi.string().max(255).required(),
      ISBN: Joi.string().max(255).required(),
      availableQuantity: Joi.number().min(0).required(),
      shelfLocation: Joi.string().max(255).required(),
    });

    return schema.validate(book);
  };

  static updateBookSchema = (book) => {
    const schema = Joi.object({
      title: Joi.string().max(255),
      author: Joi.string().max(255),
      ISBN: Joi.string().max(255),
      availableQuantity: Joi.number().min(0),
      shelfLocation: Joi.string().max(255),
    });

    return schema.validate(book);
  };
}
