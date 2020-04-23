const express = require('express');
const router = express.Router();
const pool = require('../postgresPool');

router.get("/", function (req, res) {
    //ログインされていなかったらindexにリダイレクト
    if (req.session.isLogin == false || req.session.isLogin == undefined) {
      res.redirect("..");
    } else
      res.render("addProduct", {
        title: "買ったもの登録",
      });
  });

  router.post('/', async function(req,res){
      const username = req.session.username;
      const purchase_date = req.body['purchase_date'];
      const product_name = req.body['product_name'];
      const price = req.body['price'];
      const method = req.body['method'];
      let table_name ='';
      if(method == 'cash') table_name = 'paied';
      else if(method == 'card') table_name = 'card';
      console.log(purchase_date + ","+ product_name +","+ price +","+ method +","+ table_name );
      try{
        const sql = 'INSERT INTO ' + table_name +  ' VALUES($1,$2,$3,$4)';
        const params = [purchase_date,username,product_name,price];
        const result = await pool.query(sql,params);
        console.log(result);
      }catch(e) {
          console.error(e);
      }finally {
          res.redirect('..');
      }
  });

  module.exports = router;