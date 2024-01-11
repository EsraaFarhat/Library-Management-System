import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

import config from "./config/config.mjs";
import "./database/connection.mjs";
import AppErrorHandler from "./config/error.mjs";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan.mjs";
import authRoutes from "./routes/auth.routes.mjs";
import booksRoutes from "./routes/books.routes.mjs";
import borrowersRoutes from "./routes/borrowers.routes.mjs";
import borrowingsRoutes from "./routes/borrowings.routes.mjs";

const app = express();

app.use(morganSuccessHandler);
app.use(morganErrorHandler);
app.use(cors());

app.use(helmet());

app.use(express.json({ limit: config.router.limit.request }));
app.use(
  express.urlencoded({
    extended: true,
    limit: config.router.limit.request,
    parameterLimit: config.router.limit.parameter,
  })
);

app.use(compression());

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/borrowers", borrowersRoutes);
app.use("/borrowings", borrowingsRoutes);

app.use(AppErrorHandler.handler);
app.use(AppErrorHandler.notFound);

export default app;
