import { DataTypes, Model } from "sequelize";

import sequelize from "../database/connection.mjs";

export default class Book extends Model {}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shelfLocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Book",
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["title"],
      },
      {
        fields: ["author"],
      },
      {
        fields: ["ISBN"],
      },
    ],
  }
);
