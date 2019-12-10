const connection = require("../db/connection");

const fetchUserByUserName = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .returning("*")
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return user;
      }
    });
};

module.exports = { fetchUserByUserName };
