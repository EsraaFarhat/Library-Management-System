import { Op } from "sequelize";

import { BadRequestError, NotFoundError } from "../shared/app-error.mjs";
import BorrowingsService from "../services/borrowings.service.mjs";
import MESSAGES from "../shared/messages.mjs";
import { validateUUID, handlePaginationSort } from "../utils/helpers.mjs";

export default class BorrowingsController {
  // Function to get all borrowings
  static async getBorrowings(req, res) {
    const { order, orderBy, limit, offset } = handlePaginationSort(req.query);

    const options = {
      order,
      orderBy,
      limit,
      offset,
    };

    const filters = {};
    // By default, return all currently borrowed books only
    filters.returnDate = { [Op.is]: null };

    if (req.query.status) {
      let status = req.query.status;
      if (status === "all") {
        // return all books
        delete filters.returnDate;
      } else if (status === "returned") {
        // return all returned books only
        filters.returnDate = { [Op.not]: null };
      } else if (status === "overdue") {
        // return overdue books only
        filters.dueDate = { [Op.lt]: new Date() };
        filters.returnDate = { [Op.is]: null };
      }
    }
    const rows = await BorrowingsService.getBorrowings(filters, null, options);

    res.send({ data: rows });
  }

  // Function to get borrowing by ID
  static async getBorrowing(req, res) {
    const { id } = req.params;
    validateUUID(id);

    let borrowing = await BorrowingsService.getBorrowingById(id);
    if (!borrowing) {
      throw new NotFoundError(MESSAGES.BORROWING_NOT_FOUND);
    }

    res.send({ data: borrowing });
  }
}
