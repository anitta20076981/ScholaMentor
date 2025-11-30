'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification belongs to a User/Student (optional)
      Notification.belongsTo(models.Student, {
        foreignKey: "user_id",
        as: "student",
      });
    }
  }

  Notification.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING, // e.g. 'approval', 'rejection'
      allowNull: false,
    },
     data: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("unread", "read"),
      defaultValue: "unread",
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    underscored: true,  
  });

  return Notification;
};
