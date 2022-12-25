const sql = require("mssql");
var express = require("express");
var app = express();

app.get("/list", (req, res, next) => {
  getAllRows().then((x) => res.json(x));
});

app.get("/delete/:employeePhone", (req, res, next) => {
  deleteByPhone(req.params.employeePhone);
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

async function connectAndQuery() {
  try {
    var poolConnection = await sql.connect(config);

    console.log("Reading rows from the Table...");
    var resultSet = await poolConnection
      .request()
      .query(`SELECT TOP (1000) * FROM [dbo].[tblEmployee]`);

    console.log(`${resultSet.recordset.length} rows returned.`);

    // output column headers
    var columns = "";
    for (var column in resultSet.recordset.columns) {
      columns += column + ", ";
    }
    console.log("%s\t", columns.substring(0, columns.length - 2));

    // ouput row contents from default record set
    resultSet.recordset.forEach((row) => {
      console.log("%s\t%s", row.EmpName, row.EmpPhone);
    });

    // close connection only when we're certain application is finished
    poolConnection.close();
  } catch (err) {
    console.error(err.message);
  }
}

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

app.listen(443, () => {
  console.log("Server running on port 443");
});
