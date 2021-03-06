process.env.NODE_ENV = "test";
const app = require("../app.js");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
const { expect } = chai;

chai.use(chaiSorted);

describe("/api", () => {
  after(() => {
    connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/invalidEndpoint", () => {
    it("GET:200 /api - return 200 JSON describing all the available endpoints on the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
        });
    });
    it("GET:404 /invalidEndPoint - returns 404 when the path is inserted incorrectly", () => {
      return request(app)
        .get("/invalidEndPoint")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:405 /api - returns 405 invalid method when try to DELETE  /api", () => {
      return request(app)
        .delete("/api")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("GET:404 /topics/invalidEndPoint - returns 404 when passed incorrect path", () => {
      return request(app)
        .get("/topics/invalidEndPoint")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
  });
  describe("/topics", () => {
    it("GET:200 /api/topics - returns 200 and all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.topics[0]).to.contain.keys(
            "slug",
            "description"
          );
          expect(response.body.topics[0].slug).to.be.a("string");
          expect(response.body.topics[0].description).to.be.a("string");
        });
    });
    it("POST:405 /api/topics - returns 405 invalid method when try to POST", () => {
      return request(app)
        .post("/api/topics")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("PATCH:405 /api/topics - returns 405 invalid method when try to PATCH", () => {
      return request(app)
        .patch("/api/topics")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("DELETE:405 /api/topics - returns 405 invalid method when try to DELETE", () => {
      return request(app)
        .delete("/api/topics")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("/users", () => {
    it("GET:200 /api/users/:username - returns 200 and a user by its username", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
          expect(response.body.user.username).to.be.a("string");
          expect(response.body.user.avatar_url).to.be.a("string");
          expect(response.body.user.name).to.be.a("string");
        });
    });
    it("GET:404 /api/users/invalidUser - returns error 404 when you try to insert an integer as a user_id", () => {
      return request(app)
        .get("/api/users/1")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });

    it("GET:404 /api/users/invalidUser - returns error 404 when you try to insert an invalid user_id", () => {
      return request(app)
        .get("/api/users/invalidUser")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("POST:405 /api/users/:username - returns 405 invalid method when try to POST", () => {
      return request(app)
        .post("/api/users/1")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("PATCH:405 /api/users/:username - returns 405 invalid method when try to PATCH  ", () => {
      return request(app)
        .patch("/api/users/1")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("DELETE:405 /api/users/:username - returns 405 invalid method when try to DELETE", () => {
      return request(app)
        .delete("/api/users/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("/articles", () => {
    it("GET:200 /api/articles/:article_id - returns 200 an article by its article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          );
          expect(response.body.article.article_id).to.be.a("number");
          expect(response.body.article.title).to.be.a("string");
          expect(response.body.article.body).to.be.a("string");
          expect(response.body.article.votes).to.be.a("number");
          expect(response.body.article.topic).to.be.a("string");
          expect(response.body.article.author).to.be.a("string");
          expect(response.body.article.created_at).to.be.a("string");
          expect(response.body.article.comment_count).to.be.a("string");
        });
    });
    it("PATCH:200 /api/articles/:article_id - returns 200 an article by its article_id with the number of votes decremented", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
          expect(response.body.article.votes).to.be.equal(99);
        });
    });
    it("PATCH:200 /api/articles/:article_id - returns 200 an article by its article_id with the number of votes incremented", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
          expect(response.body.article.votes).to.be.equal(101);
        });
    });
    it("PATCH:200 /api/articles/:article_id -returns error 200 when an empty object is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
          expect(response.body.article.votes).to.be.equal(100);
        });
    });
    it("POST:200 /api/articles/:article_id/comments - returns a posted commented when a body object is passed", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars", body: "body-test" })
        .expect(201)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "author",
            "created_at"
          );
          expect(response.body.comment.comment_id).to.be.equal(19);
          expect(response.body.comment.author).to.be.a("string");
          expect(response.body.comment.article_id).to.be.a("number");
          expect(response.body.comment.votes).to.be.a("number");
          expect(response.body.comment.body).to.be.a("string");
          expect(response.body.comment.created_at).to.be.a("string");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 the comments by article when the article contain comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments[0]).to.contain.keys(
            "comment_id",
            "author",
            "votes",
            "body",
            "created_at"
          );
          expect(response.body.comments[0].comment_id).to.be.a("number");
          expect(response.body.comments[0].author).to.be.a("string");
          expect(response.body.comments[0].votes).to.be.a("number");
          expect(response.body.comments[0].body).to.be.a("string");
          expect(response.body.comments[0].created_at).to.be.a("string");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 the comments by article when the article does not contain comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments.length).to.be.equal(0);
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by comment_id and in descending order by default", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments[0]).to.contain.keys(
            "comment_id",
            "author",
            "votes",
            "body",
            "created_at"
          );
          expect(response.body.comments).to.be.descendingBy("comment_id");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by author and in descending order by default", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.descendingBy("author");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=created_at")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.descendingBy("created_at");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by comment_id in descending order ", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("comment_id");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by author in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("author");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by votes in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("votes");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by created_at in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=created_at&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("created_at");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by created_at in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("created_at");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns 200 comments by article and sorted by created_at by default in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?order=desc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.descendingBy("created_at");
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of articles ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles[0]).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          );
          expect(response.body.articles[0].article_id).to.be.a("number");
          expect(response.body.articles[0].title).to.be.a("string");
          expect(response.body.articles[0].body).to.be.a("string");
          expect(response.body.articles[0].votes).to.be.a("number");
          expect(response.body.articles[0].topic).to.be.a("string");
          expect(response.body.articles[0].author).to.be.a("string");
          expect(response.body.articles[0].created_at).to.be.a("string");
          expect(response.body.articles[0].comment_count).to.be.a("string");
        });
    });
    it("GET:200 /api/articles - returns 200 an object paginated and limit of 5 articles per page by default in page 1 by default  ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles.length).to.be.equal(10);
        });
    });
    it("GET:200 /api/articles - returns 200 an object with the total count of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.total_count).to.be.equal(12);
        });
    });
    it("GET:200 /api/articles - returns 200 an object paginated and limit of 5 articles per page by default in page 2", () => {
      return request(app)
        .get("/api/articles?page=2")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles.length).to.be.equal(2);
        });
    });
    it("GET:200 /api/articles - returns 200 an object paginated and limit of 10 articles per page in page 1", () => {
      return request(app)
        .get("/api/articles?page=1&limit=10")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles.length).to.be.equal(10);
        });
    });
    it("GET:200 /api/articles - returns 200 an object paginated and limit of 3 articles per page in page 3", () => {
      return request(app)
        .get("/api/articles?page=3&limit=3")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles.length).to.be.equal(3);
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of articles sorted by any valid column and default to created_at and descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.descendingBy("created_at");
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of articles sorted by article_id and descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("article_id", {
            descending: true
          });
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of articles sorted by votes and descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of articles sorted by comment_count and descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("comment_count", {
            descending: true
          });
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of in ascending order and sorted by created_at by default", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET:200 /api/articles - returns 200 an object with an array of in descending order and sorted by created_at by default", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET:200 /api/articles - returns 200 an object with the filtered by author", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          const { articles } = response.body;
          articles.forEach(element =>
            expect(element.author).to.be.equal("rogersop")
          );
        });
    });
    it("GET:200 /api/articles - returns 200 an object with the filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          const { articles } = response.body;
          articles.forEach(element =>
            expect(element.topic).to.be.equal("mitch")
          );
        });
    });
    it("GET:200 /api/articles -return 200 an empty array for user with no articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("array");
          expect(response.body).to.eql([]);
        });
    });
    it("PATCH:400 /api/articles/:article_id -return error 400 when invalid object is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "invalid" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:400 /api/articles/:article_id -return error 400 when invalid object is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "invalid" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:400 /api/articles/invalidEndPoint - return error 400 when an invalid path is passed", () => {
      return request(app)
        .patch("/api/articles/invalid")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:404 /api/articles/invalidEndPoint - return error 404 when an no-existence article is passed", () => {
      return request(app)
        .patch("/api/articles/0")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles/invalidEndPoint - return error 404 when an invalid end-point is passed", () => {
      return request(app)
        .get("/api/articles/invalidEndPoint")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:404 /api/articles/invalidEndPoint - return error 404 when an no-existence article is passed", () => {
      return request(app)
        .get("/api/articles/0")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:405 /api/articles/:article_id - returns 405 invalid method when try to DELETE", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("POST:400 /api/articles/invalidEndPoint/comments - returns error 404 when an invalid end-point is passed", () => {
      return request(app)
        .post("/api/articles/invalidEndPoint/comments")
        .expect(400)
        .send({})
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("POST:404 /api/articles/0/comments - returns returns error 404 when passed and non-existence article ", () => {
      return request(app)
        .post("/api/articles/0/comments")
        .send({ username: "rogersop", body: "test" })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("POST:400 /api/articles/1/comments - returns returns error 400 when passed an object with a the body property missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .expect(400)
        .send({
          username: "rogersop"
        })
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:400 /api/articles/:article_id/comments - returns error 400 when and invalid end-point is passed ", () => {
      return request(app)
        .get("/api/articles/invalidEndPoint/comments")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:400 /api/articles/:article_id/comments - returns error 400 when and invalid sorted query passed", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=test")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:400 /api/articles/:article_id/comments - returns error 400 when and invalid sorted and order query passed", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=test&order=test")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:404 /api/articles/:article_id/comments - returns error 404 when an no-existence article is passed", () => {
      return request(app)
        .get("/api/articles/0/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when an invalid sort query is passed ", () => {
      return request(app)
        .get("/api/article?sort_by=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when and invalid order query is passed", () => {
      return request(app)
        .get("/api/article?order=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when and invalid sort and order query are passed", () => {
      return request(app)
        .get("/api/article?sort_by=invalid&order=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when and invalid topic query is passed ", () => {
      return request(app)
        .get("/api/article?topic=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when and invalid author query is passed ", () => {
      return request(app)
        .get("/api/article?author=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when and invalid author and sort query is passed ", () => {
      return request(app)
        .get("/api/article?author=invalid&sort_by=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when and invalid topic and sort query is passed ", () => {
      return request(app)
        .get("/api/article?topic=invalid&sort_by=invalid")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles - returns error 404 when an no-existence topic is passed ", () => {
      return request(app)
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:405 /api/articles - returns 405 invalid method when try to DELETE", () => {
      return request(app)
        .delete("/api/articles")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("POST:405 /api/articles - returns 405 invalid method when try to PATCH", () => {
      return request(app)
        .patch("/api/articles")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("DELETE:405 /api/articles/:article_id/comments - returns 405 invalid method when try to DELETE", () => {
      return request(app)
        .delete("/api/articles/1/comments")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("PATCH:405 /api/articles/:article_id/comments - returns 405 invalid method when try to PATCH", () => {
      return request(app)
        .patch("/api/articles/1/comments")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("/comments", () => {
    it("PATCH:200 /api/comments/:comment_id - returns 200 and the updated comment with an increased vote", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.be.equal(17);
          expect(response.body.comment.comment_id).to.be.a("number");
          expect(response.body.comment.author).to.be.a("string");
          expect(response.body.comment.article_id).to.be.a("number");
          expect(response.body.comment.votes).to.be.a("number");
          expect(response.body.comment.created_at).to.be.a("string");
          expect(response.body.comment.body).to.be.a("string");
        });
    });
    it("PATCH:200 /api/comments/:comment_id - returns 200 and updated comment with an decreased vote", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.be.equal(15);
          expect(response.body.comment.comment_id).to.be.a("number");
          expect(response.body.comment.author).to.be.a("string");
          expect(response.body.comment.article_id).to.be.a("number");
          expect(response.body.comment.votes).to.be.a("number");
          expect(response.body.comment.created_at).to.be.a("string");
          expect(response.body.comment.body).to.be.a("string");
        });
    });
    it("PATCH:200 /api/comments/:comment_id - returns 200 and the updated comment with an decreased vote", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.votes).to.be.equal(16);
          expect(response.body.comment.comment_id).to.be.a("number");
          expect(response.body.comment.author).to.be.a("string");
          expect(response.body.comment.article_id).to.be.a("number");
          expect(response.body.comment.votes).to.be.a("number");
          expect(response.body.comment.created_at).to.be.a("string");
          expect(response.body.comment.body).to.be.a("string");
        });
    });
    it("DELETE:204 /api/comments/:comment_id - returns status 204 when you DELETE a comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(response => {});
    });
    it("PATCH:400 /api/comments/:comment_id - returns error 400 when you PATCH an invalid comment_id ", () => {
      return request(app)
        .patch("/api/comments/invalid")
        .send({ inc_votes: -1 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:404 /api/comments/:comment_id - returns error 404 when passed an no-existence comment_id ", () => {
      return request(app)
        .patch("/api/comments/0")
        .send({ inc_votes: -1 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("PATCH:400 /api/comments/:comment_id - returns error 400 when passed an no-existence comment_id and a wrong object ", () => {
      return request(app)
        .patch("/api/comments/999")
        .send({ inc_votes: "test" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:404 /api/comments/:comment_id - returns error 404 when passed and empty object ", () => {
      return request(app)
        .patch("/api/comments/999")
        .send({})
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:404 /api/comments/:comment_id - returns status 404 when DELETE a no-existent comment", () => {
      return request(app)
        .delete("/api/comments/0")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:400 /api/comments/:comment_id - returns status 400 whe you try to DELETE an invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/invalid")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:405 /api/comments/:comment_id  - returns 405 invalid method when try to GET", () => {
      return request(app)
        .get("/api/comments/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("POST:405 /api/comments/:comment_id  - returns 405 invalid method when try to POST", () => {
      return request(app)
        .post("/api/comments/1")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
});
