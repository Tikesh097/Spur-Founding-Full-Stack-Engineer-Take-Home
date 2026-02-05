const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Tinku@1997#",
  database: "AiAgent",
});

module.exports = pool;
