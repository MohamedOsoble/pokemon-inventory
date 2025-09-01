const { Pool } = require("pg");
require("dotenv").config(); // Import .env variables

module.exports = new Pool ({
    connectionString: process.env.DB_URL
});