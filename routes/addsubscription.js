const express = require('express');
const router = express.Router();
const pool = require('../postgresPool');

router.get('/', function(req,res) {
    if(req.session.isLogin == false || req.session.isLogin == undefined) {
        res.redirect('..');
    }else {
        res.render("addSubscription", {
            title : 'サブスクリプション登録',
        });
    }
});


router.post('/', async function(req,res) {
    const username = req.session.username;
    const payment_date = req.body['payment_date'];
    const product_name = req.body['product_name'];
    const price = req.body['price'];
    const method = req.body['method'];
    console.log(payment_date + ',' + product_name + ',' + price + ',' + method);
    try{
        const sql = 'INSERT INTO subscription VALUES($1,$2,$3,$4,$5)';
        const params = [payment_date,username,product_name,price,method];
        const result = await pool.query(sql,params);
        console.log(result);
    }catch(e) {
        console.error(e);
    }finally{
        res.redirect('..');
    }
});

module.exports = router;