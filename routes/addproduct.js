const express = require('express');
const router = express.Router();
const pool = require('../postgresPool');

router.get("/", function (req, res) {
    //ログインされていなかったらindexにリダイレクト
    if (req.session.isLogin == false || req.session.isLogin == undefined) {
      res.redirect("..");
    } else
      res.render("addDeposit", {
        title: "買ったもの登録",
      });
  });

  router.post('/', async function(req,res){
      const username = req.session.username;
      const date = req.body['date'];
      const product_name = req.body['product_name'];
      const price = req.body['price'];
      const table_name = req.body['method'];
      try{
        const sql = 'INSERT INTO $1 VALUES($2,$3,$4,$5)';
        const params = [table_name,date,username,product_name,price];
        await pool.query(sql,params);
      }catch(e) {
          console.error(e);
      }finally {
          res.redirect('..');
      }
  });

  module.exports = router;