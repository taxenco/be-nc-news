const { updateComment, removeComment } = require("../model/comments-model");

exports.patchComment = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  updateComment(comment_id, inc_votes)
    .then(([comment]) => {
      response.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(comment => {
      response.status(204).send();
    })
    .catch(next);
};
