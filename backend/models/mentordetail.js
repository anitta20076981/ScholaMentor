'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MentorDetail extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Define associations here if needed
      // e.g., MentorDetail.hasMany(models.Mentorship, { foreignKey: 'mentorId' });
    }
  }

  MentorDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      mentor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      phone_number: {
        type: DataTypes.STRING
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other')
      },
      current_job_title: {
        type: DataTypes.STRING
      },
      company: {
        type: DataTypes.STRING
      },
      years_of_experience: {
        type: DataTypes.INTEGER
      },
      industry: {
        type: DataTypes.STRING
      },
      short_bio: {
        type: DataTypes.TEXT
      },
      linkedin_profile: {
        type: DataTypes.STRING
      },
      subjects: {
        type: DataTypes.STRING
      },
      skills: {
        type: DataTypes.STRING
      },
      days_available: {
        type: DataTypes.STRING
      },
      time_slots: {
        type: DataTypes.STRING
      },
      resume: {
        type: DataTypes.STRING
      },
      certificates: {
        type: DataTypes.STRING
      },
      id_proof: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'MentorDetail',
      tableName: 'MentorDetails',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,             
      deletedAt: 'deleted_at'
    }
  );

  return MentorDetail;
};
