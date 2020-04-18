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
  const username = req.body["username"];
  const plaintextPassword = req.body["password"];
  client.connect();
  const isPasswordMached = comfirmPassword(username,plaintextPassword);
});

//dbからユーザーネームを基にパスワードを取得し,引数のパスワードと比較.一致するならtrue,しないならfalseを返す.
async function comfirmPassword(username, password) {
  const sql = "SELECT password FROM users WHERE username = $1";
  try {
    const result = await client.query(sql, [username]);
    let hash = result.rows[0]["password"];
    console.log(hash);
    bcrypt.compare(password, hash).then((isCorrectPassword) => {
      if (isCorrectPassword) {
        console.log("Login Success!");
        return true;
      } else {
        console.log("Login failed");
        return false;
      }
    });
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = router;
