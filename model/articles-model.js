const connection = require("../db/connection");
const { fetchUserByUserName } = require("./users-model");
const { fetchAllTopics } = require("./topics-model");

const fetchArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`
        });
      } else {
        return article;
      }
    });
};

const updateArticleById = (article_id, inc_votes = 0) => {
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

const addArticleComment = (article_id, username, body) => {
  const newBody = {};
  newBody.author = username;
  newBody.article_id = article_id;
  newBody.body = body;
  return connection
    .insert(newBody)
    .into("comments")
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return comment;
      }
    });
};

const fetchArticleComment = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .modify(query => {
      if (sort_by !== undefined) {
        return query.orderBy(sort_by, order);
      }
    })
    .then(comments => {
      console.log(comments);
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return comments;
    });
};

const fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author !== undefined) {
        return query.where("articles.author", "=", author);
      }
    })
    .modify(query => {
      if (topic !== undefined) {
        return query.where("articles.topic", "=", topic);
      }
    })
    .count({ comment_count: "comments.comment_id" })
    .returning("*")
    .then(article => {
      if (article.length >= 1) {
        return [article];
      } else {
        if (author) {
          return Promise.all([article, fetchUserByUserName(author)]);
        } else if (topic) {
          return Promise.all([article, fetchAllTopics(topic)]);
        }
      }
    })
    .then(([articles, topic]) => {
      if (articles.length === 0 && topic.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return articles;
    });
};

module.exports = {
  fetchArticleById,
  updateArticleById,
  addArticleComment,
  fetchArticleComment,
  fetchArticles
};
