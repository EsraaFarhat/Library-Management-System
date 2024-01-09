import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import BorrowersController from "../controllers/borrowers.controller.mjs";

const borrowersRoutes = Router();

borrowersRoutes
  .route("/")
  // Route to create a new borrower
  .post(asyncWrapper(BorrowersController.createBorrower))
  // Route to get all borrowers for the current user
  .get(asyncWrapper(BorrowersController.getBorrowers));

borrowersRoutes
  .route("/:id")
  // Route to get borrower by ID
  .get(asyncWrapper(BorrowersController.getBorrower))
  // Route to update borrower by ID
  .put(asyncWrapper(BorrowersController.updateBorrower))
  // Route to delete borrower by ID
  .delete(asyncWrapper(BorrowersController.deleteBorrower));


export default borrowersRoutes;
