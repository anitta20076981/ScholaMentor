'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT
      },
      pincode: {
        type: Sequelize.STRING
      },
      school_or_college: {
        type: Sequelize.STRING
      },
      course: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.STRING
      },
      cgpa: {
        type: Sequelize.DECIMAL
      },
      family_income: {
        type: Sequelize.INTEGER
      },
      profile_photo: {
        type: Sequelize.STRING
      },
      id_proof: {
        type: Sequelize.STRING
      },
      address_proof: {
        type: Sequelize.STRING
      },
      marksheet: {
        type: Sequelize.STRING
      },
      income_proof: {
        type: Sequelize.STRING
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudentDetails');
  }
};