const { fetchUserByUserName } = require("../model/users-model");

exports.getUserByUserName = (request, response, next) => {
  const { username } = request.params;
  fetchUserByUserName(username)
    .then(([user]) => {
      response.status(200).send({user});
    })
    .catch(next);
};
