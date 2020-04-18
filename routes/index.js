var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.isLogin != undefined && req.session.isLogin == true){
    res.render("indexAfterLogin",{
      title: 'マイ家計簿',
      username:req.session.username
    });
  }
  else res.render("index", { title: "マイ家計簿" });
});

module.exports = router;
