import Book from "./books.model.mjs";
import { Borrower } from "./borrowers.model.mjs";

import { DataTypes, Model } from "sequelize";

import sequelize from "../database/connection.mjs";

export class Borrowing extends Model {}

Borrowing.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    checkoutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
    },
    dueDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Borrowing",
    indexes: [
      {
        fields: ["id"],
      },
    ],
  }
);

Book.hasMany(Borrowing);
Borrower.hasMany(Borrowing);
Borrowing.belongsTo(Book);
Borrowing.belongsTo(Borrower);