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
                      conn2.execute(
                        "insert into db (name,platform, db_version) values(:name,:platform, :version)",
                        [
                          dadosdb.rows[0][0],
                          dadosdb.rows[0][1],
                          dadosversion.rows[0][0]
                        ],
                        {
                          autoCommit: true
                        }
                      );
                    });
                });
              //inserir dados na tabela users
              conn1
                .execute(
                  "select user_id, username, account_status, default_tablespace, temporary_tablespace, last_login from dba_users"
                )
                .then(dados => {
                  //fazer insert na grupo7
                  dados.rows.forEach(dado => {
                    //console.log(dado[5]);
                    var exp =
                      "insert into users (id_user, username, account_status, default_ts, temporary_ts, last_login, timestamp, db_id) values (:id_user,:username,:ac_stat,:def_ts,:temp_ts,:lastlogin,CURRENT_TIMESTAMP,1)";
                    conn2
                      .execute(
                        exp,
                        [dado[0], dado[1], dado[2], dado[3], dado[4], dado[5]],
                        {
                          autoCommit: true
                        }
                      )
                      .then(dados2 => {})
                      .catch(err => {
                        console.log(err);
                      });
                  });
                })
                .catch(err => {
                  console.log(err);
                });
              //inserir dados na tabela X
              conn1
                .execute(
                  "SELECT TABLESPACE_NAME,BLOCK_SIZE,MAX_SIZE,STATUS,CONTENTS FROM DBA_TABLESPACES"
                )
                .then(dadostbs => {
                  dadostbs.rows.forEach(dadotbs => {
                    conn2.execute(
                      "insert into tablespace (name, block_size, max_size, status, contents, db_id) values (:a,:b,:c,:d,:e,1)",
                      [
                        dadotbs[0],
                        dadotbs[1],
                        dadotbs[2],
                        dadotbs[3],
                        dadotbs[4]
                      ]
                    );
                  });
                });

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
                });
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

  res.render("index", { title: "Sucesso" });
});

module.exports = router;
