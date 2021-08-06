const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "carna.ai",
  database: "carnadb",
  host: "localhost",
  port: 5432
});

module.exports = pool;