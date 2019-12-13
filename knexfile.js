const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

module.exports = knex(dbConfig);

// const ENV = process.env.NODE_ENV || "development";
// const { DB_URL } = process.env;

// const baseConfig = {
//   client: "pg",
//   migrations: {
//     directory: "./db/migrations"
//   },
//   seeds: {
//     directory: "./db/seeds"
//   }
// };

// const customConfig = {
//   production: { connection: `${DB_URL}?ssl=true` },
//   development: {
//     connection: {
//       database: "nc_news",
//       user: "carlos",
//       password: "Yosipuedo30988"
//     }
//   },
//   test: {
//     connection: {
//       database: "nc_news_test",
//       user: "carlos",
//       password: "Yosipuedo30988"
//     }
//   }
// };

// module.exports = { ...customConfig[ENV], ...baseConfig };
