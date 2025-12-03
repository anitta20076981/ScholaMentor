"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "mentorship_subjects",
      [
        {
          name: "Mathematics",
          description: "Basic and advanced mathematics guidance",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Programming",
          description: "C, Java, Python, and web development basics",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Data Structures",
          description: "DSA, algorithms, competitive programming help",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Career Guidance",
          description: "Resume, interviews, career planning",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("mentorship_subjects", null, {});
  },
};
