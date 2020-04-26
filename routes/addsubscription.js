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

module.exports = router;