
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

import config from "./config/config.mjs";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan.mjs";

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

export default app;
