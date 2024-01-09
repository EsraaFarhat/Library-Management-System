import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import BooksController from "../controllers/books.controller.mjs";

const booksRoutes = Router();

booksRoutes
  .route("/")
  // Route to create a new book
  .post(asyncWrapper(BooksController.createBook))
  // Route to get all books for the current user
  .get(asyncWrapper(BooksController.getBooks));

booksRoutes
  .route("/:id")
  // Route to get book by ID
  .get(asyncWrapper(BooksController.getBook))
  // Route to update book by ID
  .put(asyncWrapper(BooksController.updateBook))
  // Route to delete book by ID
  .delete(asyncWrapper(BooksController.deleteBook));


export default booksRoutes;
