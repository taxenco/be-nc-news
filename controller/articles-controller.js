const {
  fetchArticleById,
  updateArticleById
} = require("../model/articles-model");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then(article => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  updateArticleById(article_id, inc_votes).then(([article]) => {
    response.status(200).send({ article });
  }).catch(next)
};
