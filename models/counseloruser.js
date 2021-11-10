"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CounselorUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      isActive: DataTypes.BOOLEAN,
      transactionAmount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CounselorUser",
    }
  );
  CounselorUser.beforeCreate((counselorUser) => {
    counselorUser.isDone = false;
    counselorUser.isActive = false;
    counselorUser.isPaid = false;
  });
  return CounselorUser;
};
