var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const cron = require("node-cron");
const pool = require("./postgresPool");

const sessionOption = {
  secret: "idolm@ster",
  resave: false,
  saveUninitialized: "false",
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
};

//RouterAddresses
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var addDepositRouter = require("./routes/adddeposit");
var addProductRouter = require("./routes/addproduct");
var addSubscriptionRouter = require("./routes/addsubscription");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session(sessionOption));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/adddeposit", addDepositRouter);
app.use("/addproduct", addProductRouter);
app.use("/addsubscription", addSubscriptionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//debit function
cron.schedule("0 0 27 * *", async () => {
  console.log("cardのレコードをpaiedに移動");
  const MoveRecordSQL =
    "insert into paied select * from card where date_part('month',purchase_date) = date_part('month',current_date - interval '1 months');";
  await pool.query(MoveRecordSQL);
  const DeleteRecordSQL =
    "delete  from card where date_part('month',purchase_date) = date_part('month',current_date - interval '1 months');";
  await pool.query(DeleteRecordSQL);
});

//subscriptiohn
cron.schedule("0 0 * * * ", async () => {
  console.log("execute");
  let today = new Date();
  let date = today.getDate();
  const card_sql =
    "insert into card select current_date, username, product_name,price from subscription where date_part('day',payment_date) = $1 and method = 'card'";
  var params = [date];
  await pool.query(card_sql, params);
  const debit_sql =
    "insert into paied select current_date, username, product_name,price from subscription where date_part('day',payment_date) = $1 and method = 'cash'";
  await pool.query(debit_sql, params);
});

module.exports = app;
