const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      return topicsInsertions.returning("*");
    })
    .then(topicInsert => {
      const usersInsertions = knex("users").insert(userData);
      return usersInsertions.returning("*");
    })
    .then(userInsert => {
      const formatArticleData = formatDates(articleData);
      const formatedArticleData = knex("articles")
        .insert(formatArticleData)
        .returning("*");
      return formatedArticleData;
    })
    .then(articleInsert => {
      const formatArticleData = makeRefObj(articleInsert);
      const formatedComments = formatComments(commentData, formatArticleData);
      return knex("comments").insert(formatedComments);
    });
};
