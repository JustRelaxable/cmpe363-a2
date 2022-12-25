var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sql = require("mssql");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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

const config = {
  user: "admin-team2", // better stored in an app setting such as process.env.DB_USER
  password: "&^BcGq71*3p1", // better stored in an app setting such as process.env.DB_PASSWORD
  server: "team2sqlserver.database.windows.net", // better stored in an app setting such as process.env.DB_SERVER
  port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: "employeeDB", // better stored in an app setting such as process.env.DB_NAME
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

app.get("/list", (req, res, next) => {
  getAllRows().then((x) => res.json(x));
});

app.get("/delete/:employeePhone", (req, res, next) => {
  deleteByPhone(req.params.employeePhone);
});

async function getAllRows() {
  try {
    var poolConnection = await sql.connect(config);
    var resultSet = await poolConnection
      .request()
      .query(`SELECT TOP (1000) * FROM [dbo].[tblEmployee]`);
    poolConnection.close();
    return resultSet.recordset;
  } catch (err) {
    console.error(err.message);
  }
}

async function deleteByPhone(phone) {
  try {
    var poolConnection = await sql.connect(config);
    var resultSet = await poolConnection
      .request()
      .query(`DELETE FROM tblEmployee WHERE EmpPhone = ${phone};`);
    poolConnection.close();
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = app;
