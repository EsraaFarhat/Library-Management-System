import logger from "../shared/logger.mjs";
import sequelize from "./connection.mjs";

import "../models/books.model.mjs";
import "../models/borrowers.model.mjs";
import "../models/borrowings.model.mjs";

(async function createTables() {
  try {
    await sequelize.sync({force: true});

    logger.info("Tables created successfully...");
    process.exit();
  } catch (error) {
    logger.error(error.message);
    process.exit();
  }
})();
