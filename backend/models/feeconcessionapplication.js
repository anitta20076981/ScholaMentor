'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FeeConcessionApplication extends Model {
    static associate(models) {
      // define association here
      FeeConcessionApplication.belongsTo(models.Student, { foreignKey: 'student_id' });
    }
  }
  FeeConcessionApplication.init({
    student_id: DataTypes.INTEGER,
    course: DataTypes.STRING,
    semester: DataTypes.STRING,
    family_income: DataTypes.DECIMAL,
    reason: DataTypes.TEXT,
    concession_requested: DataTypes.STRING,
    supporting_doc: DataTypes.STRING,
    status: DataTypes.ENUM('Pending','Approved','Rejected'),
    concession_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    admin_remarks: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FeeConcessionApplication',
    tableName: 'fee_concession_applications',
    paranoid: true, // enables soft deletes
    underscored: true
  });
  return FeeConcessionApplication;
};
