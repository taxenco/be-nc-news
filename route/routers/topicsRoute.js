const topicsRouter = require("express").Router();
const { getAllTopics } = require("../../controller/topics-controller");
const { badMethod } = require("../../error-handler/error-handler");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(badMethod);

module.exports = topicsRouter;
