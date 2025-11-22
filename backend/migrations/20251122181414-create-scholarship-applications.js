'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scholarship_applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      scholarship_type: {
        type: Sequelize.ENUM('Merit','Need-based','Sports','Special Scheme'),
        allowNull: false,
      },
      course: { type: Sequelize.STRING(50), allowNull: false },
      semester: { type: Sequelize.STRING(20), allowNull: false },
      status: {
        type: Sequelize.ENUM('Pending','Approved','Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      admin_remarks: { type: Sequelize.TEXT, allowNull: true },

      // Common fields
      academic_percentage: { type: Sequelize.DECIMAL(5,2), allowNull: true },
      attendance_percentage: { type: Sequelize.DECIMAL(5,2), allowNull: true },
      marksheet_file: { type: Sequelize.STRING(255), allowNull: true },
      merit_reason: { type: Sequelize.TEXT, allowNull: true },

      // Need-Based Scholarship
      family_income: { type: Sequelize.DECIMAL(10,2), allowNull: true },
      father_occupation: { type: Sequelize.STRING(50), allowNull: true },
      mother_occupation: { type: Sequelize.STRING(50), allowNull: true },
      dependents: { type: Sequelize.INTEGER, allowNull: true },
      income_certificate: { type: Sequelize.STRING(255), allowNull: true },
      need_reason: { type: Sequelize.TEXT, allowNull: true },

      // Sports Scholarship
      sport_name: { type: Sequelize.STRING(50), allowNull: true },
      level: { type: Sequelize.ENUM('District','State','National','International'), allowNull: true },
      team_or_individual: { type: Sequelize.STRING(20), allowNull: true },
      sports_certificate: { type: Sequelize.STRING(255), allowNull: true },
      coach_name: { type: Sequelize.STRING(50), allowNull: true },
      coach_contact: { type: Sequelize.STRING(20), allowNull: true },
      sports_reason: { type: Sequelize.TEXT, allowNull: true },

      // Special Scheme Scholarship
      category_type: { type: Sequelize.STRING(50), allowNull: true },
      category_certificate: { type: Sequelize.STRING(255), allowNull: true },
      disability_certificate: { type: Sequelize.STRING(255), allowNull: true },
      scheme_reason: { type: Sequelize.TEXT, allowNull: true },

      // Timestamps
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('scholarship_applications');
  }
};
