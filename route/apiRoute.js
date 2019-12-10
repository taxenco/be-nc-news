const apiRouter = require("express").Router();
const topicsRouter = require("./routers/topicsRoute");
const usersRouter = require("./routers/usersRouter");
const articlesRouter = require("./routers/articlesRoute");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
