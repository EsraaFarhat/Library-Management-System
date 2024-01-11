import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

import sequelize from "../database/connection.mjs";

export default class Borrower extends Model {
  async comparePassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }
}

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
    password: {
      type: DataTypes.STRING(1024),
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
    hooks: {
      beforeCreate: async (borrower) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(borrower.password, salt);
        borrower.password = hashedPassword;
      },
      beforeBulkUpdate: async (borrower) => {
        if (borrower.attributes.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(borrower.attributes.password, salt);
          borrower.attributes.password = hashedPassword;
        }
      },
    },
  }
);
