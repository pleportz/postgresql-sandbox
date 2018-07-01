require("babel-register");

module.exports = {
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "docker",
    password: "docker",
    database: "demodb"
  },
  migrations: {
    directory: "./database/migrations"
  },
  seeds: {
    directory: "./database/seeds"
  }
};
