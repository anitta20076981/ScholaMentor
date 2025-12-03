"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MentorshipSubject extends Model {
    static associate(models) {
      // future associations can be added here
      // example: this.hasMany(models.MentorSubject, { foreignKey: "subject_id" });
    }
  }

  MentorshipSubject.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active"
      }
    },
    {
      sequelize,
      modelName: "MentorshipSubject",
      tableName: "mentorship_subjects",
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,             
      deletedAt: 'deleted_at'
    }
  );

  return MentorshipSubject;
};
