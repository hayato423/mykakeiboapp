const { Pool } = require("pg");


const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/mykakeiboapp";
  
const pool = new Pool({
  connectionString: connectionString,
});

module.exports = pool;