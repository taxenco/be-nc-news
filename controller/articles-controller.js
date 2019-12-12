const {
  fetchArticleById,
  updateArticleById,
  addArticleComment,
  fetchArticleComment,
  fetchArticles
} = require("../model/articles-model");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then(([article]) => {
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
  const { username, body } = request.body;
  const { article_id } = request.params;
  addArticleComment(article_id, username, body)
    .then(([comment]) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.getArticleComment = (request, response, next) => {
  const { sort_by, order } = request.query;
  const { article_id } = request.params;
  fetchArticleComment(article_id, sort_by, order)
    .then(comments => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic, author } = request.query;
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      response.status(200).send({ articles });
    })
    .catch(next);
};
