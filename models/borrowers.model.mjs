import { DataTypes, Model } from "sequelize";

import sequelize from "../database/connection.mjs";

export class Borrower extends Model {}

Borrower.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    registeredDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Borrower",
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["name"],
      },
      {
        fields: ["email"],
      },
    ],
  }
);
