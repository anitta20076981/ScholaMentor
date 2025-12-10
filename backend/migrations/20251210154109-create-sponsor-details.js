'use strict';
/** @type {import('sequelize-cli').Migration} */
/** this page is the copy of student details*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sponsor_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sponsor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true // optional if one-to-one
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other")
      },
      occupation: {
        type: Sequelize.STRING
      },
      gov_id: {
        type: Sequelize.INTEGER
      },
      reason_for_sponsorship: {
        type: Sequelize.STRING
      },
      income_certificate: {
        type: Sequelize.STRING
      },
      bank_statement: {
        type: Sequelize.STRING
      },
      profile_photo: {
        type: Sequelize.STRING
      },  
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sponsor_details');
  }
};
