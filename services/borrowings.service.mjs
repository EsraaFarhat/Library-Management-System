import BooksEntity from "../models/books.model.mjs";
import BorrowersEntity from "../models/borrowers.model.mjs";
import BorrowingsEntity from "../models/borrowings.model.mjs";

export default class BorrowingsService {
  static async getBorrowingById(id, attributes) {
    const borrowing = await BorrowingsEntity.findByPk(id, {
      attributes,
    });
    return borrowing;
  }

  static async getBorrowing(filters, attributes) {
    const borrowing = await BorrowingsEntity.findOne({
      attributes,
      where: filters,
    });
    return borrowing;
  }

  static async getBorrowings(filters, attributes, options) {
    const { order, orderBy, limit, offset } = options;

    const borrowings = await BorrowingsEntity.findAndCountAll({
      attributes: attributes
        ? attributes
        : ["id", "checkoutDate", "returnDate", "dueDate"],
      where: filters,
      include: [
        {
          model: BooksEntity,
          as: "book",
          attributes: ["id", "title", "author", "ISBN"],
        },
        {
          model: BorrowersEntity,
          as: "borrower",
          attributes: ["id", "name", "email"],
        },
      ],
      offset,
      limit,
      order: [[orderBy, order]],
    });
    return borrowings;
  }

  static async addBorrowing(body) {
    let borrowing = await BorrowingsEntity.create(body);
    return borrowing;
  }

  static async addBorrowings(body) {
    let borrowing = await BorrowingsEntity.bulkCreate(body);
    return borrowing;
  }

  static async updateBorrowing(filters, body) {
    const borrowing = await BorrowingsEntity.update(body, {
      where: filters,
      returning: true,
    });
    if (borrowing[0] == 0) return null;
    return borrowing[1][0];
  }

  static async count(filters) {
    const count = await BorrowingsEntity.count(filters);
    return count;
  }

  static async deleteBorrowing(filters) {
    const borrowing = await BorrowingsEntity.destroy({ where: filters });
    return borrowing;
  }
}
