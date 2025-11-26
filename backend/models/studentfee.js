'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentFee extends Model {
    static associate(models) {
      // define association here
      // StudentFee.belongsTo(models.Student, { foreignKey: 'student_id' });
    }
  }
  StudentFee.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      tuition_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      scholarship_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      fee_concession_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      fee_balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.ENUM('Pending','Paid','Overdue'),
        defaultValue: 'Pending',
      },
      remarks: DataTypes.TEXT,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'StudentFee',
      tableName: 'student_fees',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true, // enables soft delete (uses deleted_at)
    }
  );
  return StudentFee;
};
