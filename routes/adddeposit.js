const express = require("express");
const router = express.Router();
const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/mykakeiboapp";

const client = new Client({
  connectionString: connectionString,
});

router.get("/", function (req, res) {
  //ログインされていなかったらindexにリダイレクト
  if (req.session.isLogin == false) {
    res.redirect("..");
  } else
    res.render("addDeposit", {
      title: "入金登録",
    });
});


module.exports = router;
