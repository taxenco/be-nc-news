const connection = require("../db/connection");

const fetchAllTopics = topic => {
  return connection
    .select("*")
    .from("topics")
    .modify(query => {
      if (topic !== undefined) {
        return query.where("slug", "=", topic);
      }
    })
    .returning("*")
    .then(topics => {
      return topics;
    });
};

module.exports = {
  fetchAllTopics
};
