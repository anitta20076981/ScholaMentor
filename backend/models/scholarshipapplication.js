'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ScholarshipApplication extends Model {
    static associate(models) {
      ScholarshipApplication.belongsTo(models.Student, { foreignKey: 'student_id' });
    }
  }
  
  ScholarshipApplication.init({
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    scholarship_type: { type: DataTypes.ENUM('Merit','Need-based','Sports','Special Scheme'), allowNull: false },
    course: { type: DataTypes.STRING(50), allowNull: false },
    semester: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.ENUM('Pending','Approved','Rejected'), allowNull: false, defaultValue: 'Pending' },
    approved_date: { type: DataTypes.DATE, allowNull: true },
    scholarship_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    admin_remarks: { type: DataTypes.TEXT },
    academic_percentage: { type: DataTypes.DECIMAL(5,2) },
    attendance_percentage: { type: DataTypes.DECIMAL(5,2) },
    marksheet_file: { type: DataTypes.STRING(255) },
    merit_reason: { type: DataTypes.TEXT },
    family_income: { type: DataTypes.DECIMAL(10,2) },
    father_occupation: { type: DataTypes.STRING(50) },
    mother_occupation: { type: DataTypes.STRING(50) },
    dependents: { type: DataTypes.INTEGER },
    income_certificate: { type: DataTypes.STRING(255) },
    need_reason: { type: DataTypes.TEXT },
    sport_name: { type: DataTypes.STRING(50) },
    level: { type: DataTypes.ENUM('District','State','National','International') },
    team_or_individual: { type: DataTypes.STRING(20) },
    sports_certificate: { type: DataTypes.STRING(255) },
    coach_name: { type: DataTypes.STRING(50) },
    coach_contact: { type: DataTypes.STRING(20) },
    sports_reason: { type: DataTypes.TEXT },
    category_type: { type: DataTypes.STRING(50) },
    category_certificate: { type: DataTypes.STRING(255) },
    disability_certificate: { type: DataTypes.STRING(255) },
    scheme_reason: { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'ScholarshipApplication',
    tableName: 'scholarship_applications'
  });

  return ScholarshipApplication;
};
