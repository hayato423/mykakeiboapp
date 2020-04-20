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
  if (req.session.isLogin == false || req.session.isLogin == undefined) {
    res.redirect("..");
  } else
    res.render("addDeposit", {
      title: "入金登録",
    });
});

router.post('/',function(req,res) {
    const username = req.session.username;
    const date = req.body['date'];
    const content = req.body['content'];
    const amount = req.body['amount'];
    console.log(date + ":" + username +" " + content +" "+ amount );
    client.connect();
    const sql = "INSERT INTO deposit VALUES( $1, $2, $3, $4);";
    const values = [date,username,content,amount];
    client.query(sql,values)
    .then((result) => {
        console.log(result);
        client.end();
    })
    .catch((e) => console.log(e.stack));
    res.redirect('..');
})

module.exports = router;
