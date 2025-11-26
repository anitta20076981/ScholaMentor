'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ScholarshipSetting extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  ScholarshipSetting.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount_type: {
        type: DataTypes.ENUM('fixed', 'custom'),
        allowNull: false,
      },
      amount_value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ScholarshipSetting',
      tableName: 'scholarship_settings',
      underscored: true,
    }
  );
  return ScholarshipSetting;
};
