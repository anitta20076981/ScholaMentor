'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.ENUM('admin', 'student', 'sponsor', 'mentor', 'donor'),
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true  
  });

  return User;
};
