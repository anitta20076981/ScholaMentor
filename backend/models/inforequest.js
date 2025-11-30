'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InfoRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InfoRequest.init({
    application_id: DataTypes.INTEGER,
    sponsor_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    required_document: DataTypes.STRING,
    status: DataTypes.STRING,
    response_document: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'InfoRequest',
  });
  return InfoRequest;
};