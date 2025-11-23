'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fee_concession_applications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      course: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      semester: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      family_income: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      concession_requested: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      supporting_doc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Pending','Approved','Rejected'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      admin_remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fee_concession_applications');
  }
};
