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
      connect("grupo7", "grupo7", "//localhost/orcl").then(connection2 => {
        conn2 = connection2;
        // aqui as duas conexões já estão criadas
        
        //fazer select na sys
        conn1.execute("select user_id, username, account_status, default_tablespace, temporary_tablespace, last_login from dba_users").then(dados => {
          
         //fazer insert na grupo7 
          dados.rows.forEach(dado =>{
            //console.log(dado[5]);
            var exp = "insert into users (id_user, username, account_status, default_ts, temporary_ts, last_login, timestamp, db_id) values (:id_user,:username,:ac_stat,:def_ts,:temp_ts,null,CURRENT_TIMESTAMP,1)"
            conn2.execute(exp,[dado[0],dado[1],dado[2],dado[3],dado[4]],{ autoCommit: true}).then(dados2 => {
             }).catch(err => {console.log(err)})

          })

         
          
        }).catch(err =>{console.log(err)})
      })

    }).catch(err => {
      console.log(err)
    })






      
    .catch(err => {
      console.log(err)
      res.render("error", { erro: err });
    });

  //res.render("index", { title: "Express" });
});

module.exports = router;
