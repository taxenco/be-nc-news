const {
  fetchArticleById,
  updateArticleById,
  addArticleComment,
  fetchArticleComment
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
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleById(article_id, inc_votes)
    .then(([article]) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticleComment = (request, response, next) => {
  const { body } = request;
  const { article_id } = request.params;
  addArticleComment(article_id, body)
    .then(article => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleComment = (request, response, next) => {
  // console.log(request.query);
  const { sort_by, order } = request.query;
  const { article_id } = request.params;
  fetchArticleComment(article_id, sort_by, order)
    .then(comments => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
