const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pg = require('pg');

const connectinoString = 'postgres://postgres:postgres@localhost:5432/mykakeiboapp';

router.get('/',function(req,res,next){
    res.render('register',{title:'アカウント登録'});
});

router.post('/',function(req,res,next){
    const saltRounds = 10; //ストレッチング回数
    const username = req.body['username'];
    const plaintextPassword = req.body['password'];
    var hash = bcrypt.hashSync(plaintextPassword,saltRounds);
})

module.exports = router;