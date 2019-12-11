const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../../controller/comments-controller");
const { badMethod } = require("../../error-handler/error-handler");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(badMethod);

module.exports = commentsRouter;
