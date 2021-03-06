const express = require("express");
const router = express.Router();
const pool = require('../postgresPool');


router.get("/", function (req, res) {
  //ログインされていなかったらindexにリダイレクト
  if (req.session.isLogin == false || req.session.isLogin == undefined) {
    res.redirect("..");
  } else
    res.render("addDeposit", {
      title: "入金登録",
    });
});

router.post("/", async function (req, res) {
  const username = req.session.username;
  const date = req.body["date"];
  const content = req.body["content"];
  const amount = req.body["amount"];
  console.log(date + ":" + username + " " + content + " " + amount);
  try {
    const sql = "INSERT INTO deposit VALUES( $1, $2, $3, $4);";
    const values = [date, username, content, amount];
    await pool.query(sql, values);
  } catch (e) {
    console.log(e);
  } finally {
    res.redirect('..');
  }
});

module.exports = router;
