var express = require("express");
var router = express.Router();
const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/mykakeiboapp";
const client = new Client({
  connectionString: connectionString,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.isLogin != undefined && req.session.isLogin == true) {
    const username = req.session.username;
    displayPossesion(username).then((possesion) => {
      res.render("indexAfterLogin", {
        title: "マイ家計簿",
        username: username,
        possesion: possesion
      });
    });
  } else res.render("index", { title: "マイ家計簿" });
});

async function displayPossesion(username) {
  client.connect();
  const sql = "SELECT SUM(amount) from deposit WHERE username = $1";
  const result = await client.query(sql, [username]);
  client.end();
  const possesion = result.rows[0]['sum'];
  console.log(possesion);
  return possesion;
}

module.exports = router;
