const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mykakeiboapp';
const client = new Client({
  connectionString: connectionString
});

router.get("/", function (req, res, next) {
  res.render("register", { title: "アカウント登録" });
});

router.post("/", function (req, res, next) {
  const saltRounds = 4; //ストレッチング回数
  const username = req.body["username"];
  const plaintextPassword = req.body["password"];
  //ハッシュ化した文章を代入
  var hash = bcrypt.hashSync(plaintextPassword, saltRounds);
  client.connect();
  sql = "INSERT INTO users (username,password) VALUES($1,$2)";
  const values = [username, hash];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result);
      client.end();
    })
    .catch((e) => console.error(e.stack));
  res.render("registered", { title: "登録しました" });
});

module.exports = router;
