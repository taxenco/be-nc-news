const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById
} = require("../../controller/articles-controller");
const { badMethod } = require("../../error-handler/error-handler");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(badMethod);

module.exports = articlesRouter;
