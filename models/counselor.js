"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Counselor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Counselor.belongsTo(models.User);
      Counselor.hasMany(models.Review)
    }
  }
  Counselor.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User Id Cannot be null" },
          notEmpty: { msg: "User Id Cannot be Empty" },
        },
      },
      motto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Motto Id Cannot be null" },
          notEmpty: { msg: "Motto Id Cannot be Empty" },
        },
      },
      specialist: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Specialist Cannot be null" },
          notEmpty: { msg: "Specialist Cannot be Empty" },
        },
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "About Cannot be null" },
          notEmpty: { msg: "About Cannot be Empty" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Price Cannot be null" },
          notEmpty: { msg: "Price Cannot be Empty" },
          minPrice(value) {
            if (+value < 100000) {
              throw new Error("Minimum price is 100000");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Counselor",
    }
  );
  return Counselor;
};
