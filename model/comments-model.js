const connection = require("../db/connection");

const updateComment = (comment_id, votes) => {
  return connection
    .from("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", votes)
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return comment;
      }
    });
};

const removeComment = comment_id => {
  return connection
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(comment => {
      if (comment === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return comment;
      }
    });
};

module.exports = { updateComment, removeComment };
