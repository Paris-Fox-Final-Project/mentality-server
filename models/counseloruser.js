"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class CounselorUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CounselorUser.belongsTo(models.User)
    }
  }
  CounselorUser.init(
    {
      CounselorId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      TopicId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      isDone: DataTypes.BOOLEAN,
      isPaid: DataTypes.BOOLEAN,
      transactionAmount: {
        type: DataTypes.INTEGER,
        validate: {
          min: {
            args: [0],
            msg: "transaction amount must be greater then 0",
          },
        },
      },
      schedule: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: "invalid schedule",
          },
          isAfter: {
            args: new Date().toISOString().substring(0, 10),
            msg: "invalid schedule",
          },
        },
      },
      totalSession: {
        type: DataTypes.INTEGER,
        validate: {
          min: {
            args: [0],
            msg: "Total session must be greater then 0",
          },
        },
      },
      orderId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "CounselorUser",
    }
  );
  CounselorUser.beforeCreate((counselorUser) => {
    counselorUser.isDone = false;
    counselorUser.isPaid = false;
  });
  CounselorUser.afterValidate((counselorUser) => {
    counselorUser.schedule = `${counselorUser.schedule}+07`;
  });
  return CounselorUser;
};
