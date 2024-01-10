import XLSX from "xlsx";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import BooksEntity from "../models/books.model.mjs";
import BorrowersEntity from "../models/borrowers.model.mjs";
import BorrowingsEntity from "../models/borrowings.model.mjs";

export default class BorrowingsService {
  static async getBorrowingById(id, attributes) {
    const borrowing = await BorrowingsEntity.findByPk(id, {
      attributes: attributes
        ? attributes
        : ["id", "checkoutDate", "returnDate", "dueDate"],
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

  static async createXLSXReport(borrowings) {
    let rows = [];
    borrowings.rows.forEach((row) => {
      rows.push([
        row.book.title,
        row.borrower.name,
        new Date(row.checkoutDate).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        row.returnDate
          ? new Date(row.returnDate).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        new Date(row.dueDate).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      ]);
    });

    const xlsxFile = `analytical_report_${new Date().toISOString()}.xlsx`;
    const filePath = path.join(
      dirname(fileURLToPath(import.meta.url)),
      "../downloads/",
      xlsxFile
    );

    try {
      const workbook = XLSX.utils.book_new();
      const dataSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(
        dataSheet,
        [
          [
            "BookTitle",
            "BorrowerName",
            "CheckoutDate",
            "ReturnDate",
            "DueDate",
          ],
        ],
        { origin: "A1" }
      );
      XLSX.utils.sheet_add_aoa(dataSheet, rows, { origin: "A2" });
      XLSX.utils.book_append_sheet(workbook, dataSheet, "analytics");
      XLSX.writeFile(workbook, filePath);
    } catch (error) {
      console.log(error);
    }
  }
}
