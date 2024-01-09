import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import BorrowingsController from "../controllers/borrowings.controller.mjs";

const borrowingsRoutes = Router();

// borrowingsRoutes
//   .route("/")
//   // Route to get all borrowings for the current user
//   .get(asyncWrapper(BorrowingsController.getBorrowings));

// borrowingsRoutes
//   .route("/:id")
//   // Route to get borrowing by ID
//   .get(asyncWrapper(BorrowingsController.getBorrowing));

export default borrowingsRoutes;
