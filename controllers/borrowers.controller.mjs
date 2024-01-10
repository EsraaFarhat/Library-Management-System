import { Op, Sequelize } from "sequelize";

import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import BorrowersService from "../services/borrowers.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { validateUUID, handlePaginationSort } from "../utils/helpers.mjs";
import BooksService from "../services/books.service.mjs";
import BorrowingsService from "../services/borrowings.service.mjs";

export default class BorrowersController {
  // Function to create a new borrower
  static async createBorrower(req, res) {
    const { error } = BorrowersService.createBorrowerSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    req.body.email = req.body.email.toLowerCase();
    const existingBorrower = await BorrowersService.getBorrower(
      { email: req.body.email },
      ["id"]
    );
    if (existingBorrower) {
      throw new BadRequestError(MESSAGES.EMAIL_UNIQUE);
    }
    let borrower = await BorrowersService.addBorrower(req.body);

    res.status(201).send({ data: borrower });
  }

  // Function to get all borrowers
  static async getBorrowers(req, res) {
    const { order, orderBy, limit, offset } = handlePaginationSort(req.query);

    const options = {
      order,
      orderBy,
      limit,
      offset,
    };

    const filters = {};
    if (req.query.name) {
      filters.name = {
        [Op.iLike]: `%${req.query.name}%`,
      };
    }
    if (req.query.email) {
      filters.email = req.query.email.toLowerCase();
    }

    const rows = await BorrowersService.getBorrowers(filters, null, options);

    res.send({ data: rows });
  }

  // Function to get borrower by ID
  static async getBorrower(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let borrower = await BorrowersService.getBorrowerById(id);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    res.send({ data: borrower });
  }

  // Function to update borrower by ID
  static async updateBorrower(req, res) {
    const { id } = req.params;
    validateUUID(id);

    const { error } = BorrowersService.updateBorrowerSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
      const existingBorrower = await BorrowersService.getBorrower(
        { email: req.body.email },
        ["id"]
      );
      if (existingBorrower && existingBorrower.id !== id) {
        throw new BadRequestError(MESSAGES.EMAIL_UNIQUE);
      }
    }

    let updatedBorrower = await BorrowersService.updateBorrower(
      { id },
      req.body
    );

    res.send({ data: updatedBorrower });
  }

  // Function to delete borrower by ID
  static async deleteBorrower(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    borrower = await BorrowersService.deleteBorrower({ id });

    res.send({ data: { message: MESSAGES.BORROWER_DELETED_SUCCESSFULLY } });
  }

  // Function to borrow books for a user
  static async borrowBooks(req, res) {
    const { id } = req.params;
    validateUUID(id);
    const { error } = BorrowersService.borrowBooksSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (new Date(req.body.dueDate) <= new Date()) {
      throw new BadRequestError(MESSAGES.BORROWING_DUE_DATE_VALIDATION);
    }

    let borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }
    let body = [];
    for (const bookId of req.body.booksIds) {
      const book = await BooksService.getBookById(bookId, [
        "title",
        "availableQuantity",
      ]);
      if (!book) {
        throw new NotFoundError(`${MESSAGES.BOOK_NOT_FOUND}: ${bookId}`);
      }
      if (book.availableQuantity == 0) {
        throw new BadRequestError(
          `${MESSAGES.BOOK_NOT_AVAILABLE}: ${book.title}`
        );
      }
      body.push({
        borrowerId: id,
        bookId,
        checkoutDate: new Date(),
        dueDate: req.body.dueDate,
      });
    }

    await BorrowingsService.addBorrowings(body);
    // Decrease the available quantity for these books
    await BooksService.updateBook(
      { id: req.body.booksIds },
      { availableQuantity: Sequelize.literal(`"availableQuantity" - 1`) }
    );

    res.send({ data: { message: MESSAGES.BOOKS_BORROWED_SUCCESSFULLY } });
  }

  // Function to return books for a user
  static async returnBooks(req, res) {
    const { id } = req.params;
    validateUUID(id);
    const { error } = BorrowersService.returnBooksSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    let borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    let booksIds = [];
    for (const borrowingId of req.body.borrowingsIds) {
      const borrowing = await BorrowingsService.getBorrowingById(borrowingId, [
        "id",
        "bookId",
        "returnDate",
      ]);
      if (!borrowing) {
        throw new NotFoundError(
          `${MESSAGES.BORROWING_NOT_FOUND}: ${borrowingId}`
        );
      }
      if (borrowing.returnDate) {
        throw new BadRequestError(
          `${MESSAGES.BOOK_ALREADY_RETURNED}: ${borrowingId}`
        );
      }
      booksIds.push(borrowing.bookId);
    }

    await BorrowingsService.updateBorrowing(
      { id: req.body.borrowingsIds },
      { returnDate: new Date() }
    );
    await BooksService.updateBook(
      { id: booksIds },
      { availableQuantity: Sequelize.literal(`"availableQuantity" + 1`) }
    );

    res.send({ data: { message: MESSAGES.BOOKS_RETURNED_SUCCESSFULLY } });
  }

  // Function to get the books that the user currently has
  static async getCurrentBooks(req, res) {
    const { id } = req.params;
    validateUUID(id);

    const { order, orderBy, limit, offset } = handlePaginationSort(req.query);

    const options = {
      order,
      orderBy,
      limit,
      offset,
    };

    let borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    const filters = { borrowerId: id };
    // By default, return all currently borrowed books only
    filters.returnDate = { [Op.is]: null };

    if (req.query.status) {
      let status = req.query.status;
      if (status === "all") {
        // return all books
        delete filters.returnDate;
      } else if (status === "returned") {
        // return all returned books only
        filters.returnDate = { [Op.not]: null };
      } else if (status === "overdue") {
        // return overdue books only
        filters.dueDate = { [Op.lt]: new Date() };
        filters.returnDate = { [Op.is]: null };
      }
    }

    const rows = await BorrowingsService.getBorrowings(filters, null, options);

    res.send({ data: rows });
  }
}
