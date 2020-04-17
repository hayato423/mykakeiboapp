const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/mykakeiboapp";
const client = new Client({
  connectionString: connectionString,
});

router.get("/", function (req, res, next) {
  res.render("login", { title: "ログイン" });
});

router.post("/", function (req, res, next) {
  const saltRounds = 4;
  const username = req.body["username"];
  const plaintextPassword = req.body["password"];
  let hash = '';
  client.connect();
  sql = "SELECT password FROM users WHERE username ==" + username;
  client
    .query(sql)
    .then((result) => {
        console.log(result);
        client.end();
    })
    .catch((e) => console.error(e.stack));
});


module.exports = router;