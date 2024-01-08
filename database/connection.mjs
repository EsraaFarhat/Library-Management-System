import Sequelize from "sequelize";

import config from "../config/config.mjs";
import logger from "../shared/logger.mjs";

const db_name = process.env.DATABASE_NAME;
const db_username = process.env.DATABASE_USERNAME;
const db_password = process.env.DATABASE_PASSWORD;
const db_host = process.env.DATABASE_HOST;
const db_PORT = process.env.DATABASE_PORT;
const db_dialect = process.env.DATABASE_DIALECT;

export const sequelize = new Sequelize(
  config.sequelize.dbName,
  config.sequelize.dbUsername,
  config.sequelize.dbPassword,
  {
    host: config.sequelize.dbHost,
    port: config.sequelize.dbPort,
    pool: {
      max: 100,
      min: 1,
      acquire: 90000,
      idle: 60000,
    },
    dialect: config.sequelize.dbDialect,
    logging: false
  },
);

sequelize
  .authenticate()
  .then(() => logger.info("Connected to the database successfully.."))
  .catch((error) => {
    logger.error("Unable to connect to the database: " + error);
  });
