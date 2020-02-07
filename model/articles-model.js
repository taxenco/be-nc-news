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
  order = "desc",
  page = 1,
  limit = 10
) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .limit(limit)
    .offset((page - 1) * limit)
    .modify(query => {
      if (sort_by !== undefined) {
        return query.orderBy(sort_by, order);
      }
    })
    .then(comments => {
      if (article_id) {
        return Promise.all([comments, fetchArticleById(article_id)]);
      }
      return Promise.reject({ status: 404, msg: "Not found" });
    })
    .then(([commentPromise, articlePromise]) => {
      if (commentPromise.length === 0 && articlePromise.length > 0) {
        return commentPromise;
      } else {
        return commentPromise;
      }
    });
};

const fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  page = 1,
  limit = 10
) => {
  const articleCount = connection
    .select("*")
    .from("articles")
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
    .then(articles => articles.length);

  const articlesQuery = connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((page - 1) * limit)
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
    .returning("*");

  return Promise.all([articlesQuery, articleCount])
    .then(([articles, count]) => {
      if (articles.length >= 1) {
        return [{ articles, total_count: count }];
      } else {
        if (author) {
          return Promise.all([articles, fetchUserByUserName(author)]);
        } else if (topic) {
          return Promise.all([articles, fetchAllTopics(topic)]);
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
