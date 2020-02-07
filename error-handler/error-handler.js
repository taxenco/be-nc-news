exports.badMethod = (request, response, next) => {
  response.status(405).send({ msg: "Method not allowed" });
};

exports.handlingErrors = (error, request, response, next) => {
  if (error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};
exports.sqlErrors = (error, request, response, next) => {
  const sqlError400 = ["22P02", "42703", "23502"];
  const sqlError404 = ["23503"];

  if (sqlError400.includes(error.code)) {
    response.status(400).send({ msg: "Bad request" });
  }
  if (sqlError404.includes(error.code)) {
    response.status(404).send({ msg: "Not found" });
  } else {
    next(error);
  }
};
exports.routeNotFound = (request, response) => {
  response.status(404).send({ msg: "Not found" });
};
