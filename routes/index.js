var express = require("express");
var router = express.Router();
//const sql = require("mssql");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
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

router.get("/list", (req, res, next) => {
  getAllRows().then((x) => res.json(x));
});

router.get("/delete/:employeePhone", (req, res, next) => {
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

module.exports = router;
