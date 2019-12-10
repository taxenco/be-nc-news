const connection = require("../db/connection");

const fetchArticleById = article_id => {
  const articlePromise = connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .returning("*");
  const commentPromise = connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .returning("*");
  return Promise.all([articlePromise, commentPromise]).then(
    ([[articleQuery], commentQuery]) => {
      if (articleQuery === undefined) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        articleQuery.comment_count = commentQuery.length;
        return articleQuery;
      }
    }
  );
};

const updateArticleById = (article_id, inc_votes) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .increment("votes", +inc_votes)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return article;
      }
    });
};

module.exports = {
  fetchArticleById,
  updateArticleById
};
