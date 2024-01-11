import { Router } from "express";
import asyncWrapper from "../shared/async-wrapper.mjs";
import AuthController from "../controllers/auth.controller.mjs";

const authRoutes = Router();

authRoutes
  .route("/login")
  // Route to login
  .post(asyncWrapper(AuthController.login));

export default authRoutes;
