'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('scholarship_settings', [
      { type: 'Merit', amount_type: 'fixed', amount_value: 1000, percentage: null, active: true, created_at: new Date(), updated_at: new Date() },
      { type: 'Need-based', amount_type: 'fixed', amount_value: 2000, percentage: null, active: true, created_at: new Date(), updated_at: new Date() },
      { type: 'Sports', amount_type: 'fixed', amount_value: 1500, percentage: null, active: true, created_at: new Date(), updated_at: new Date() },
      { type: 'Special Scheme', amount_type: 'custom', amount_value: null, percentage: null, active: true, created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('scholarship_settings', null, {});
  }
};
