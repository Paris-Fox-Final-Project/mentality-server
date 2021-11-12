'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Topic.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Topic is required"
        },
        notNull: {
          args: true,
          msg: "Topic cannot null!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Topic',
  });
  return Topic;
};