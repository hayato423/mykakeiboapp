var express = require("express");
var router = express.Router();
const pool = require("../postgresPool");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.isLogin != undefined && req.session.isLogin == true) {
    const username = req.session.username;
    displayPossesion(username).then((possesion) => {
      if (possesion === null) possesion = 0;
      res.render("indexAfterLogin", {
        title: "マイ家計簿",
        username: username,
        possesion: possesion,
      });
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

module.exports = router;
