'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SponsorshipApplications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // must match your Users table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        // unique: true // optional if one-to-one
      },
      purpose: {
        type: Sequelize.ENUM('Studies', 'Laptop', 'Books', 'Hostel'),
        allowNull: false
      },
      required_amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      cgpa: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      background: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      marksheet: {
        type: Sequelize.STRING, // store file name/path
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Pending','Approved','Rejected','MoreInfo','InfoSubmitted','ApprovedBySponsor','RejectedBySponsor'),
        defaultValue: 'Pending'
      },
      approved_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      admin_remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      approved_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      sponsor_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      approval_type: {
        type: DataTypes.ENUM('Full', 'Partial'),
        allowNull: true,
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      remarks_from_sponsor: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      remaining_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      previous_request_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      remaining_requested: {      
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'No'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SponsorshipApplications');
  }
};
