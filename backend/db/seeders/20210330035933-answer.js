'use strict';
const faker = require("faker");
const { Random } = require("random-js");
const random = new Random();


module.exports = {
  up: (queryInterface, Sequelize) => {
    let answerComments = [];
    for (let i = 0; i < 5000; i++) {
      answerComments.push({
        answer: faker.lorem.paragraph(),
        userId: random.integer(1, 3),
        commentId: random.integer(1, 1000),
      });
    }

    return queryInterface.bulkInsert("AnswerComments", answerComments, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete("AnswerComments", null, {
      truncate: true
    });
  }
};
