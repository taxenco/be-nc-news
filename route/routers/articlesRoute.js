const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postArticleComment,
  getArticleComment,
  getArticles
} = require("../../controller/articles-controller");
const { badMethod } = require("../../error-handler/error-handler");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(badMethod);

articlesRouter
  .route("/:article_id/comments")
  .post(postArticleComment)
  .get(getArticleComment)
  .all(badMethod);

articlesRouter
  .route("/")
  .get(getArticles)
  .all(badMethod);

module.exports = articlesRouter;
