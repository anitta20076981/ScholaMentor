'use strict';
// copy code of previous migration
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('studentdetails', 'family_income', {
      type: Sequelize.INTEGER,
      allowNull: false,     // NOT NULL
      defaultValue: 0       // default 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('studentdetails', 'family_income');
  }
};
