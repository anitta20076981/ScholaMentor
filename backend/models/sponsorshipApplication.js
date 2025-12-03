'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SponsorshipApplication extends Model {
    static associate(models) {
      SponsorshipApplication.belongsTo(models.users, { foreignKey: 'studentId' });
    }
  }
  SponsorshipApplication.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      purpose: {
        type: DataTypes.ENUM('Studies', 'Laptop', 'Books', 'Hostel'),
        allowNull: false
      },
      required_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      cgpa: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      background: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      marksheet: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('Pending','Approved','Rejected','MoreInfo','InfoSubmitted','ApprovedBySponsor','RejectedBySponsor'),
        defaultValue: 'Pending'
      },
      admin_remarks: {
        type: DataTypes.TEXT,
        allowNull: true
      },
       approved_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      sponsor_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      approval_type: {
        type: DataTypes.ENUM('Full','Partial'),
        allowNull: true
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      remarks_from_sponsor: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      remaining_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      previous_request_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      remaining_requested: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No',
      }
    },
    {
      sequelize,
      modelName: 'SponsorshipApplication',
      tableName: 'SponsorshipApplications'
    }
  );
  return SponsorshipApplication;
};
