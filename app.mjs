import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import config from "./config/config.mjs";
import "./database/connection.mjs";
import AppErrorHandler from "./config/error.mjs";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan.mjs";
import authRoutes from "./routes/auth.routes.mjs";
import booksRoutes from "./routes/books.routes.mjs";
import borrowersRoutes from "./routes/borrowers.routes.mjs";
import borrowingsRoutes from "./routes/borrowings.routes.mjs";
import docs from "./swagger-docs.json" assert { type: "json" };

const app = express();

const options = {
  swaggerDefinition: {
    info: {
      title: "My API",
      version: "1.0.0",
      description: "My API Information",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.mjs"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serveFiles(docs), swaggerUi.setup(docs));

app.use(morganSuccessHandler);
app.use(morganErrorHandler);
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/files", express.static(path.join(__dirname, "./downloads")));

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
