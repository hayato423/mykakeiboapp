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
  const sql = "SELECT SUM(amount) from deposit WHERE username = $1";
  const result = await pool.query(sql, [username]);
  const possesion = result.rows[0]["sum"];
  console.log(possesion);
  return possesion;
}

module.exports = router;
