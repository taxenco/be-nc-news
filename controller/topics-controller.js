const { fetchAllTopics } = require("../model/topics-model");

exports.getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then(topics => {
      response.status(200).send({ topics });
    })
    .catch(next);
};
