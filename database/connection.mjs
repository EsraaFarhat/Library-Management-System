import Sequelize from "sequelize";

import config from "../config/config.mjs";
import logger from "../shared/logger.mjs";

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
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => logger.info("Connected to the database successfully.."))
  .catch((error) => {
    logger.error("Unable to connect to the database: " + error);
  });

export default sequelize;
