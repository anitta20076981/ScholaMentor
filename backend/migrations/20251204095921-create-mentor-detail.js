'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MentorDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mentor_id: {
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
      phone_number: {
        type: Sequelize.STRING
      },

      gender: {
        type: Sequelize.ENUM("male", "female", "other")
      },

      current_job_title: {
        type: Sequelize.STRING
      },

      company: {
        type: Sequelize.STRING
      },

      years_of_experience: {
        type: Sequelize.INTEGER
      },

      industry: {
        type: Sequelize.STRING
      },

      short_bio: {
        type: Sequelize.TEXT
      },

      linkedin_profile: {
        type: Sequelize.STRING
      },

      subjects: {
        type: Sequelize.STRING  
      },

      skills: {
        type: Sequelize.STRING // comma separated skills
      },

      days_available: {
        type: Sequelize.STRING // e.g., "Mon,Tue,Wed"
      },

      time_slots: {
        type: Sequelize.STRING // e.g., "5 PM - 9 PM"
      },

      resume: {
        type: Sequelize.STRING  
      },

      certificates: {
        type: Sequelize.STRING  
      },

      id_proof: {
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
    await queryInterface.dropTable('MentorDetails');
  }
};
