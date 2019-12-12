const apiRouter = require("express").Router();
const topicsRouter = require("./routers/topicsRoute");
const usersRouter = require("./routers/usersRouter");
const articlesRouter = require("./routers/articlesRoute");
const commentsRouter = require("./routers/commentsRoute");
const { badMethod } = require("../error-handler/error-handler");
const json = require("../endpoints.json");


apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get((req, res) => {
    res.status(200).send(json);
  })
  .all(badMethod);

module.exports = apiRouter;
