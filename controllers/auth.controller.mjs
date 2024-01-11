import jwt from "jsonwebtoken";
import _ from "lodash";

import config from "../config/config.mjs";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
} from "../shared/app-error.mjs";
import MESSAGES from "../shared/messages.mjs";
import BorrowersService from "../services/borrowers.service.mjs";

const jwtSecret = config.privateKey;
export default class AuthController {
  // Function to login
  static async login(req, res) {
    try {
      const { error } = BorrowersService.borrowerLoginSchema(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      req.body.email = req.body.email.toLowerCase();
      let borrower = await BorrowersService.getBorrower({
        email: req.body.email,
      });
      if (!borrower || !(await borrower.comparePassword(req.body.password))) {
        throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate and sign the JWT token that expires in one day
      const token = jwt.sign({ borrowerId: borrower.id }, jwtSecret, {
        expiresIn: "1d",
      });

      res.send({
        data: {
          borrower: _.pick(borrower, ["id", "name", "email", "createdAt"]),
          token,
        },
      });
    } catch (error) {
      throw new AppError(error);
    }
  }
}
