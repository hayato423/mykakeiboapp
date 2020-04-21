const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require('../postgresPool');

router.get("/", function (req, res, next) {
  res.render("register", { title: "アカウント登録" });
});

router.post("/", async function (req, res, next) {
  const saltRounds = 4; //ストレッチング回数
  const username = req.body["username"];
  const plaintextPassword = req.body["password"];
  //ハッシュ化した文章を代入
  var hash = bcrypt.hashSync(plaintextPassword, saltRounds);
  try{
    const sql = "INSERT INTO users (username,password) VALUES($1,$2)";
    const values = [username, hash];
    await pool.query(sql,values);
  }catch(e){
    console.error(e);
  }finally{
    res.render("registered", { title: "登録しました" });
  }
});

module.exports = router;
