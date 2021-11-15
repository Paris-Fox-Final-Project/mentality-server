"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Topic.hasMany(models.CounselorUser)
    }
  }
  Topic.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "topic name is required",
          },
          notNull: {
            args: true,
            msg: "topic name cannot null!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Topic",
    }
  );
  return Topic;
};
