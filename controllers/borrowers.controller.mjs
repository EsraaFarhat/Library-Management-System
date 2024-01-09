import { Op } from "sequelize";

import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import BorrowersService from "../services/borrowers.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { validateUUID, handlePaginationSort } from "../utils/helpers.mjs";

export default class BorrowersController {
  // Function to create a new borrower
  static async createBorrower(req, res) {
    const { error } = BorrowersService.createBorrowerSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    req.body.email = req.body.email.toLowerCase();
    const existingBorrower = await BorrowersService.getBorrower(
      { email: req.body.email },
      ["id"]
    );
    if (existingBorrower) {
      throw new BadRequestError(MESSAGES.EMAIL_UNIQUE);
    }
    let borrower = await BorrowersService.addBorrower(req.body);

    res.status(201).send({ data: borrower });
  }

  // Function to get all borrowers
  static async getBorrowers(req, res) {
    const { order, orderBy, limit, offset } = handlePaginationSort(req.query);

    const options = {
      order,
      orderBy,
      limit,
      offset,
    };

    const filters = {};
    if (req.query.name) {
      filters.name = {
        [Op.iLike]: `%${req.query.name}%`,
      };
    }
    if (req.query.email) {
      filters.email = req.query.email.toLowerCase();
    }
    
    const rows = await BorrowersService.getBorrowers(filters, null, options);

    res.send({ data: rows });
  }

  // Function to get borrower by ID
  static async getBorrower(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let borrower = await BorrowersService.getBorrowerById(id);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    res.send({ data: borrower });
  }

  // Function to update borrower by ID
  static async updateBorrower(req, res) {
    const { id } = req.params;
    validateUUID(id);

    const { error } = BorrowersService.updateBorrowerSchema(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
      const existingBorrower = await BorrowersService.getBorrower(
        { email: req.body.email },
        ["id"]
      );
      if (existingBorrower && existingBorrower.id !== id) {
        throw new BadRequestError(MESSAGES.EMAIL_UNIQUE);
      }
    }

    let updatedBorrower = await BorrowersService.updateBorrower(
      { id },
      req.body
    );

    res.send({ data: updatedBorrower });
  }

  // Function to delete borrower by ID
  static async deleteBorrower(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let borrower = await BorrowersService.getBorrowerById(id, ["id"]);
    if (!borrower) {
      throw new NotFoundError(MESSAGES.BORROWER_NOT_FOUND);
    }

    borrower = await BorrowersService.deleteBorrower({ id });

    res.send({ data: { message: MESSAGES.BORROWER_DELETED_SUCCESSFULLY } });
  }
}
