var express = require("express");
var router = express.Router();
var oracledb = require("oracledb");
/* GET home page. */
function connect(user, pass, cs) {
  return oracledb.getConnection({
    user: user,
    password: pass,
    connectString: cs
  });
}
router.get("/", function(req, res, next) {
  connect("system", "oracle", "//localhost/orcl")
    .then(connection => {
      conn1 = connection;
      conn1.execute("SELECT * FROM dba_users").then(result => {
        //res.send(result.rows);
        connect("hr", "oracle", "//localhost/orcl").then(connection2 => {
          conn2 = connection2;
          conn2.execute("SELECT * FROM employees").then(result2 => {
            res.send(result2.rows);
          });
        });
      });
    })
    .catch(err => {
      res.render("error", { erro: err });
    });

  //res.render("index", { title: "Express" });
});

module.exports = router;
