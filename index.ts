const fs = require('fs');
const pg = require('pg');
const url = require('url');
require("dotenv").config();

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

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});