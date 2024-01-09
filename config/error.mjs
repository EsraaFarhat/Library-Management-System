import { InternalServerError, NotFoundError } from "../shared/app-error.mjs";

export default class AppErrorHandler {
  static handler(err, req, res, next) {
    const error = !err.isOperational
      ? new InternalServerError(undefined, err)
      : err;
    res.locals.errorMessage = err.message;
    const response = {
      error: error.message,
    };
    response.error =
      typeof response.error === "object"
        ? response.error[req.lang] || JSON.stringify(response.error)
        : response.error;
    res.status(error.statusCode).send(response);
  }

  static notFound(req, res, next) {
    const error = new NotFoundError();
    res.status(error.statusCode).send({ error: error.message });
  }
}
