import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import BooksService from "../services/books.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { validateUUID, handlePaginationSort } from "../utils/helpers.mjs";

export default class BooksController {
  // Function to create a new book
  static async createBook(req, res) {
    const { error } = BooksService.createBookSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingBook = await BooksService.getBook({ ISBN: req.body.ISBN }, [
      "id",
    ]);
    if (existingBook) {
      throw new BadRequestError(MESSAGES.ISBN_UNIQUE);
    }
    let book = await BooksService.addBook(req.body);

    res.status(201).send({ data: book });
  }

  // Function to get all books
  static async getBooks(req, res) {
    const { order, orderBy, limit, offset } = handlePaginationSort(req.query);

    const options = {
      order,
      orderBy,
      limit,
      offset,
    };

    const filters = {};
    const rows = await BooksService.getBooks(filters, null, options);

    res.send({ data: rows });
  }

  // Function to get book by ID
  static async getBook(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let book = await BooksService.getBookById(id);
    if (!book) {
      throw new NotFoundError(MESSAGES.BOOK_NOT_FOUND);
    }

    res.send({ data: book });
  }

  // Function to update book by ID
  static async updateBook(req, res) {
    const { id } = req.params;
    validateUUID(id);

    const { error } = BooksService.updateBookSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const book = await BooksService.getBookById(id, ["id"]);
    if (!book) {
      throw new NotFoundError(MESSAGES.BOOK_NOT_FOUND);
    }

    if (req.body.ISBN) {
      const existingBook = await BooksService.getBook({ ISBN: req.body.ISBN }, [
        "id",
      ]);
      if (existingBook && existingBook.id !== id) {
        throw new BadRequestError(MESSAGES.ISBN_UNIQUE);
      }
    }

    let updatedBook = await BooksService.updateBook({ id }, req.body);

    res.send({ data: updatedBook });
  }

  // Function to delete book by ID
  static async deleteBook(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let book = await BooksService.getBookById(id, ["id"]);
    if (!book) {
      throw new NotFoundError(MESSAGES.BOOK_NOT_FOUND);
    }

    book = await BooksService.deleteBook({ id });

    res.send({ data: { message: MESSAGES.BOOK_DELETED_SUCCESSFULLY } });
  }
}
