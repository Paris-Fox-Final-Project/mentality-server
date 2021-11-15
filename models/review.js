"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Counselor)
      Review.belongsTo(models.User)
    }
  }
  Review.init(
    {
      CounselorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Counselor Id Cannot be null" },
          notEmpty: { msg: "Counselor Id Cannot be empty" }
        }
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User Id Cannot be null" },
          notEmpty: { msg: "User Id Cannot be empty" }
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Message Cannot be null" },
          notEmpty: { msg: "Message Cannot be Empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
