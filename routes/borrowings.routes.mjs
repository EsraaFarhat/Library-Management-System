import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import BorrowingsController from "../controllers/borrowings.controller.mjs";
import authMiddleware from "../middlewares/auth.middleware.mjs";

const borrowingsRoutes = Router();

borrowingsRoutes.use(asyncWrapper(authMiddleware));
borrowingsRoutes
  .route("/")
  // Route to get all borrowings for the current user
  .get(asyncWrapper(BorrowingsController.getBorrowings));

borrowingsRoutes
  .route("/analytics/by_date/:startDate/:endDate")
  // Route to get analytics report of the borrowing process in a specific period
  .get(asyncWrapper(BorrowingsController.getBorrowingsAnalyticsInPeriod));

borrowingsRoutes
  .route("/analytics/by_month")
  // Route to get analytics report of the borrowing process
  .get(asyncWrapper(BorrowingsController.getBorrowingsAnalytics));

borrowingsRoutes
  .route("/:id")
  // Route to get borrowing by ID
  .get(asyncWrapper(BorrowingsController.getBorrowing));

export default borrowingsRoutes;
