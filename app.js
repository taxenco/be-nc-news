const express = require("express");
const app = express();
const apiRouter = require("./route/apiRoute");
const cors = require("cors");
const {
  routeNotFound,
  handlingErrors,
  sqlErrors
} = require("./error-handler/error-handler");
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlingErrors);
app.use(sqlErrors);
app.use("/*", routeNotFound);
module.exports = app;
