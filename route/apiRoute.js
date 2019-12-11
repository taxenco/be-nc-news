const apiRouter = require("express").Router();
const topicsRouter = require("./routers/topicsRoute");
const usersRouter = require("./routers/usersRouter");
const articlesRouter = require("./routers/articlesRoute");
const commentsRouter = require("./routers/commentsRoute");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
