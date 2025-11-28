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
        unique: true // optional if one-to-one
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
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
      },
      admin_remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SponsorshipApplications');
  }
};
