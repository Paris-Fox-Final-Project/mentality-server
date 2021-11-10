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
      Counselor.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Counselor.init(
    {
      UserId: DataTypes.INTEGER,
      motto: DataTypes.STRING,
      specialist: DataTypes.STRING,
      about: DataTypes.TEXT,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Counselor",
    }
  );
  return Counselor;
};
