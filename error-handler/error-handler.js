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
  const sqlError = ["22P02", "23502", "42703", "23503"];
  if (sqlError.includes(error.code)) {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(error);
  }
};
exports.routeNotFound = (request, response) => {
  response.status(404).send({ msg: "Not found" });
};
