const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require('../postgresPool');

router.get("/", function (req, res, next) {
  var msg = "ユーザーネームとパスワードを入力してください";
  res.render("login", { title: "ログイン", msg : msg });
});

router.post("/", function (req, res, next) {
  const username = req.body["username"];
  const plaintextPassword = req.body["password"];
  comfirmPassword(username,plaintextPassword).then((isloginSuccess) => {
    console.log(isloginSuccess);
    if(isloginSuccess){
      console.log('login success');
      req.session.isLogin = true;
      req.session.username = username;
      res.redirect('..');
    }
    else{
      res.render('login',{
        title:'ログイン',
        msg : 'ログインに失敗しました'
      });
    }
  });
});

//dbからユーザーネームを基にパスワードを取得し,引数のパスワードと比較.一致するならtrue,しないならfalseを返す.
async function comfirmPassword(username, password) {
  try {
    const sql = "SELECT password FROM users WHERE username = $1";
    const result = await pool.query(sql, [username]);
    let hash = result.rows[0]["password"];
    const isCorrectPassword = await bcrypt.compare(password,hash);
    if(isCorrectPassword) return true;
    else return false;
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = router;
