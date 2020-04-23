var express = require("express");
var router = express.Router();
const pool = require("../postgresPool");

/* GET home page. */
router.get("/",async function (req, res, next) {
  if (req.session.isLogin != undefined && req.session.isLogin == true) {
    const username = req.session.username;
    let possesion = await displayPossesion(username);
    let netPossesion = await displayNetPossesion(possesion,username);
    if(possesion == null) possesion = 0;
    if(netPossesion == null) netPossesion = 0;
    res.render("indexAfterLogin", {
      title: "マイ家計簿",
      username: username,
      possesion: possesion,
      netPossesion : netPossesion
    });
  } else res.render("index", { title: "マイ家計簿" });
});

async function displayPossesion(username) {
  const sqlToGetAmountofSavings = "SELECT SUM(amount) from deposit WHERE username = $1";
  let result = await pool.query(sqlToGetAmountofSavings, [username]);
  const deposit = result.rows[0]["sum"];
  const sqlTOGetAmountofPaied = "SELECT SUM(price) from paied WHERE username = $1";
  result = await pool.query(sqlTOGetAmountofPaied,[username]);
  const paied = result.rows[0]["sum"];
  console.log("deposit:"+deposit);
  console.log("paied:"+paied);
  const possesion = deposit - paied;
  return possesion;
}

async function displayNetPossesion(possesion,username) {
  const sql = "SELECT SUM(price) from card WHERE username = $1";
  let result = await pool.query(sql,[username]);
  const sum_price = result.rows[0]['sum'];
  const netPossesion = possesion - sum_price;
  return netPossesion;
}

module.exports = router;
