const topicsRouter = require("express").Router();
const { getUserByUserName } = require("../../controller/users-controller");
const { badMethod } = require("../../error-handler/error-handler");

topicsRouter
  .route("/:username")
  .get(getUserByUserName)
  .all(badMethod);

module.exports = topicsRouter;
