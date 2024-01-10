import Sequelize from "sequelize";

import config from "../config/config.mjs";
import logger from "../shared/logger.mjs";

export const sequelize = new Sequelize(
  // config.sequelize.dbName,
  null,
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

async function createDatabase() {
  try {
    // Check if the database already exists
    const databaseExists = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${config.sequelize.dbName}';`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (!databaseExists.length) {
      // If the database does not exist, create it
      await sequelize.query(`CREATE DATABASE ${config.sequelize.dbName};`);
      logger.info(
        `Database "${config.sequelize.dbName}" created successfully.`
      );
    } else {
      logger.info(`Database "${config.sequelize.dbName}" already exists.`);
    }
  } catch (error) {
    logger.error("Error creating/checking database:", error);
  } 
}

createDatabase()
  .then(() => {
    return sequelize.authenticate();
  })
  .then(() => {
    logger.info("Connected to the database successfully.");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database: " + error);
  });

export default sequelize;
