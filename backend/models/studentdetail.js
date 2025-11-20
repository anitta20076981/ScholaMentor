'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentDetail extends Model {
    static associate(models) {
      // e.g., StudentDetail.belongsTo(models.User, { foreignKey: 'student_id' });
    }
  }
  StudentDetail.init({
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phone: DataTypes.STRING(20),
    dob: DataTypes.DATE,
    gender: DataTypes.ENUM('Male', 'Female', 'Other'),
    address: DataTypes.TEXT,
    pincode: DataTypes.STRING(20),
    school_or_college: DataTypes.STRING(255),
    course: DataTypes.STRING(255),
    department: DataTypes.STRING(255),
    year: DataTypes.STRING(10),
    cgpa: DataTypes.DECIMAL(4,2),
    family_income: DataTypes.INTEGER,
    profile_photo: DataTypes.STRING(255),
    id_proof: DataTypes.STRING(255),
    address_proof: DataTypes.STRING(255),
    marksheet: DataTypes.STRING(255),
    income_proof: DataTypes.STRING(255),
    deleted_at: DataTypes.DATE,   
  }, {
    sequelize,
    modelName: 'StudentDetail',
    tableName: 'student_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,             
    deletedAt: 'deleted_at'
  });
  return StudentDetail;
};
