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

const addArticleComment = (article_id, information) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .returning("*")
    .then(([article]) => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      const newBody = {};
      newBody.author = article.author;
      newBody.article_id = article_id;
      newBody.votes = 0;
      newBody.body = information.body;
      return newBody;
    })
    .then(comment => {
      return connection
        .from("comments")
        .insert(comment)
        .returning("*");
    })
    .then(([postArticle]) => {
      return postArticle;
    });
};

const fetchArticleComment = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .modify(query => {
      if (sort_by !== undefined) {
        return query.orderBy(sort_by, order);
      }
    })
    .returning("*")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return comments;
    });
};

module.exports = {
  fetchArticleById,
  updateArticleById,
  addArticleComment,
  fetchArticleComment
};
