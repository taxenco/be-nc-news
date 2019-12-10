process.env.NODE_ENV = "test";
const app = require("../app.js");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
const { expect } = require("chai");
chai.use(chaiSorted);

describe("/api", () => {
  after(() => {
    connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/invalidEndpoint", () => {
    it("GET:404 - invalid endpoint throws 404 error", () => {
      return request(app)
        .get("/invalidEndPoint")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 - invalid endpoint throws 404 error", () => {
      return request(app)
        .get("/topics/invalidEndPoint")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
  });
  describe("/topics", () => {
    it("GET:200 /api/topics - returns all topics", () => {
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
    it("POST:405 /api/topics - method not allowed", () => {
      return request(app)
        .post("/api/topics")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("PATCH:405 /api/topics - method not allowed", () => {
      return request(app)
        .patch("/api/topics")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("DELETE:405 /api/topics - method not allowed", () => {
      return request(app)
        .delete("/api/topics")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("/users", () => {
    it("GET:200 /api/users/:username - returns a user by its username", () => {
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
    it("GET:404 /api/users/invalidUser return error 404", () => {
      return request(app)
        .get("/api/users/1")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });

    it("GET:404 /api/users/invalidUser return error 404", () => {
      return request(app)
        .get("/api/users/invalidUser")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("POST:405 /api/users/:username - method not allowed", () => {
      return request(app)
        .post("/api/users/1")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("PATCH:405 /api/users/:username - method not allowed", () => {
      return request(app)
        .patch("/api/users/1")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("DELETE:405 /api/users/:username - method not allowed", () => {
      return request(app)
        .delete("/api/users/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("/articles", () => {
    it("GET:200 /api/articles/:article_id - returns an article by its article_id", () => {
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
          expect(response.body.article.comment_count).to.be.a("number");
        });
    });
    it("PATCH:200 /api/articles/:article_id - returns an article by its article_id with the number of votes decremented", () => {
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
    it("PATCH:200 /api/articles/:article_id - returns an article by its article_id with the number of votes incremented", () => {
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
    it("POST:200 /api/articles/:article_id/comments - returns a posted commented when a body object is passed", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "test", body: "body-test" })
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.article).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "author",
            "created_at"
          );
          expect(response.body.article.comment_id).to.be.a("number");
          expect(response.body.article.author).to.be.a("string");
          expect(response.body.article.article_id).to.be.a("number");
          expect(response.body.article.votes).to.be.a("number");
          expect(response.body.article.author).to.be.a("string");
          expect(response.body.article.created_at).to.be.a("string");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
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
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
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
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
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
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("comment_id");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("author");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("votes");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=created_at&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("created_at");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.ascendingBy("created_at");
        });
    });
    it("GET:200 /api/articles/:article_id/comments - returns comments by article", () => {
      return request(app)
        .get("/api/articles/1/comments?order=desc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments).to.be.descendingBy("created_at");
        });
    });
    it("PATCH:400 /api/articles/:article_id -return error 400 when invalid object is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:400 /api/articles/:article_id -return error 400 when invalid object is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ votes: 1 })
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
    it("PATCH:400 /api/articles/:article_id -return error 400 when invalid object is passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "invalid" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:400 /api/articles/invalidEndPoint - returns error 404", () => {
      return request(app)
        .patch("/api/articles/invalid")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("PATCH:400 /api/articles/invalidEndPoint - returns error 404", () => {
      return request(app)
        .patch("/api/articles/0")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("PATCH:400 /api/articles/invalidEndPoint - returns error 404", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles/invalidEndPoint - returns error 404", () => {
      return request(app)
        .get("/api/articles/invalidEndPoint")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:404 /api/articles/invalidEndPoint - returns error 404", () => {
      return request(app)
        .get("/api/articles/0")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles/invalidEndPoint - returns error 404", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:405 /api/articles/:article_id - method not allowed", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("POST:400 /api/articles/invalidEndPoint/comments - returns returns error 404", () => {
      return request(app)
        .post("/api/articles/invalidEndPoint/comments")
        .expect(400)
        .send({})
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("POST:404 /api/articles/0/comments - returns returns error 404", () => {
      return request(app)
        .post("/api/articles/0/comments")
        .send({})
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("POST:404 /api/articles/999/comments - returns returns error 404", () => {
      return request(app)
        .post("/api/articles/0/comments")
        .expect(404)
        .send({})
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("POST:404 /api/articles/1/comments - returns returns error 404", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .expect(400)
        .send({
          username: "test"
        })
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("POST:404 /api/articles/1/comments - returns returns error 404", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .expect(400)
        .send({})
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("POST:404 /api/articles/1/comments - returns returns error 404", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .expect(400)
        .send({
          test: "test"
        })
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:400 /api/articles/:article_id/comments - returns error 400", () => {
      return request(app)
        .get("/api/articles/invalidEndPoint/comments")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:400 /api/articles/:article_id/comments - returns error 400", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=test")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:400 /api/articles/:article_id/comments - returns error 400", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=test&order=test")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Bad request");
        });
    });
    it("GET:404 /api/articles/:article_id/comments - returns error 400", () => {
      return request(app)
        .get("/api/articles/0/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 /api/articles/:article_id/comments - returns error 400", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:405 /api/articles/:article_id/comments - method not allowed", () => {
      return request(app)
        .delete("/api/articles/1/comments")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("PATCH:405 /api/articles/:article_id/comments - method not allowed", () => {
      return request(app)
        .delete("/api/articles/1/comments")
        .send({})
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
  describe("/comments", () => {});
});
