const { Pool } = require("pg");
require("dotenv").config(); // Import .env variables
const config = {
  user: process.env.db_user,
  password: process.env.db_pass,
  host: process.env.db_host,
  port: process.env.db_port,
  database: process.env.db_database,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.db_ssl,
  },
};
module.exports = new Pool(config);
