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
      connect("grupo7", "grupo7", "//localhost/orcl")
        .then(connection2 => {
          conn2 = connection2;
          connect("system", "oracle", "//localhost/orcl12c")
            .then(connection3 => {
              conn3 = connection3;
              // aqui as duas conexões já estão criadas
              //inserir dados na tabela DB
              conn1
                .execute("select name,platform_name from v$database")
                .then(dadosdb => {
                  conn3
                    .execute(
                      "select version from dba_cpu_usage_statistics where dbid = 776972821"
                    )
                    .then(dadosversion => {
                      conn2.execute( //UPDATE AQUI - serve para o primeiro caso
                        "update db set platform = :plat, db_version = :ver, timestamp = CURRENT_TIMESTAMP where name = :nm", [dadosdb.rows[0][1], dadosversion.rows[0][0], dadosdb.rows[0][0]],{
                          autoCommit: true
                        }
                      ).then(d => {
                          if(d.rowsAffected == 0)
                            conn2.execute("insert into db (name,platform, db_version) values(:name,:platform, :version)",
                            [
                              dadosdb.rows[0][0],
                              dadosdb.rows[0][1],
                              dadosversion.rows[0][0]
                            ],
                            {
                              autoCommit: true
                            })
                        }).catch(err => {
                          console.log(err);
                        });
                    }).catch(err => {
                      console.log(err);
                    });
                  }).catch(err => {
                    console.log(err);
                  });
                
              //inserir dados na tabela users
              
              conn1
                .execute(
                  "select user_id, username, account_status, default_tablespace, temporary_tablespace, last_login from dba_users"
                )
                .then(dados => {
                  //fazer insert na grupo7
                  dados.rows.forEach(user => {
                    //update users set username = :unaaa, account_status = :asaa, default_ts = :daat, temporary_ts = :taaas, last_login = :llaaa, timestamp = CURRENT_TIMESTAMP where id_user = :iaaau",
                   // [dado[1], dado[2], dado[3], dado[4], dado[5], dado[0]],
                    conn2.execute("update users set username = :unaaa, account_status = :asaa, default_ts = :daat, temporary_ts = :taaas, last_login = :llaaa, timestamp = CURRENT_TIMESTAMP where id_user = :iaaau",[user[1], user[2], user[3], user[4], user[5], user[0]], {
                      autoCommit: true
                    }).then(duser => {
                      
                      if(duser.rowsAffected == 0){
                        conn2.execute("insert into users (id_user, username, account_status, default_ts, temporary_ts, last_login, timestamp, db_id) values (:id_user,:username,:ac_stat,:def_ts,:temp_ts,:lastlogin,CURRENT_TIMESTAMP,1)",
                          [user[0], user[1], user[2], user[3], user[4], user[5]],
                          {
                            autoCommit: true
                          }
                        )}
                  }).catch(err=>{console.log(err)})
                })
                }).catch(err => {
                  console.log(err);
                });

                
              //inserir dados na tabela tablespaces

                conn1
                .execute(
                  "SELECT TABLESPACE_NAME,BLOCK_SIZE,MAX_SIZE,STATUS,CONTENTS FROM DBA_TABLESPACES"
                )
                .then(dadostbs => {
                  dadostbs.rows.forEach(table => {
                    conn2.execute("update tablespace set block_size = :block_size, max_size = :max_size, status = :status, contents = :contents, timestamp = CURRENT_TIMESTAMP where name = :name",[table[1], table[2], table[3],table[4],table[0]], {
                      autoCommit: true
                    }).then(dtable => {
                      
                      if(dtable.rowsAffected == 0){
                        conn2.execute("insert into tablespace (name, block_size, max_size, status, contents, timestamp, db_id) values (:a,:b,:c,:d,:e,CURRENT_TIMESTAMP,1)",
                        [
                          table[0],
                          table[1],
                          table[2],
                          table[3],
                          table[4]
                        ],
                          {
                            autoCommit: true
                          }
                        )}
                  }).catch(err=>{console.log(err)})
                })
                }).catch(err => {
                  console.log(err);
                });

               //inserir dados na tabela datafiles


               conn1
               .execute(
                "select file_name, tablespace_name, autoextensible, status, maxbytes, bytes from dba_data_files"
               )
               .then(dadosdtf => {
                 dadosdtf.rows.forEach(data => {
                   conn2.execute("update datafile set auto_extensible = :auto_extensible, status = :status, max_bytes = :max_bytes, bytes = :bytes, timestamp = CURRENT_TIMESTAMP where name = :name",[data[2], data[3], data[4], data[5], data[0]], {
                     autoCommit: true
                   }).then(ddata => {
                     
                     if(ddata.rowsAffected == 0){
                       conn2.execute( "insert into datafile (name, auto_extensible, status, max_bytes, bytes, tablespace_id) values (:a,:b,:c,:d,:e, (select max(t.id) from tablespace t where t.name = :f))",
                       [
                         data[0],
                         data[2],
                         data[3],
                         data[4],
                         data[5],
                         data[1]
                       ],
                         {
                           autoCommit: true
                         }
                       )}
                 }).catch(err=>{console.log(err)})
               })
               }).catch(err => {
                 console.log(err);
               });


              /*
              conn1
                .execute(
                  "select file_name, tablespace_name, autoextensible, status, maxbytes, bytes from dba_data_files"
                )
                .then(dadosdtf => {
                  dadosdtf.rows.forEach(dadodtf => {
                    conn2.execute(
                      "insert into datafile (name, auto_extensible, status, max_bytes, bytes, tablespace_id) values (:a,:b,:c,:d,:e, (select max(t.id) from tablespace t where t.name = :f))",
                      [
                        dadodtf[0],
                        dadodtf[2],
                        dadodtf[3],
                        dadodtf[4],
                        dadodtf[5],
                        dadodtf[1]
                      ]
                    );
                  });
                });*/
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    })

    .catch(err => {
      console.log(err);
      res.render("error", { erro: err });
    });

  res.status(200).render("index", { title: "bananas" });
});

module.exports = router;
