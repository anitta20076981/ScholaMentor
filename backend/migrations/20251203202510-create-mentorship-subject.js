'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MentorshipSubjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active"
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at :{
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MentorshipSubjects');
  }
};