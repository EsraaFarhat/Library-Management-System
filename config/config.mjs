import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Joi from "joi";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid("development", "stage", "production").required(),
  PORT: Joi.number().required(),
  DATABASE_DIALECT: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  PARAMETER_LIMIT: Joi.number().required(),
  REQUEST_LIMIT: Joi.number().required(),
  PRIVATE_KEY: Joi.string().required(),
}).unknown();

const { value: env, error } = envSchema
  .validate(process.env);

if (error) {
  throw new Error(`Configuration Validation Error: ${error.message}`);
}

const config = {
  env: env.NODE_ENV,
  sequelize: {
    dbDialect: env.DATABASE_DIALECT,
    dbPort: env.DATABASE_PORT,
    dbHost: env.DATABASE_HOST,
    dbUsername: env.DATABASE_USERNAME,
    dbPassword: env.DATABASE_PASSWORD,
    dbName: env.DATABASE_NAME,
  },
  port: env.PORT,
  router: {
    limit: {
      parameter: env.PARAMETER_LIMIT,
      request: env.REQUEST_LIMIT,
    },
  },
  privateKey: env.PRIVATE_KEY,
  
};

export default config;
