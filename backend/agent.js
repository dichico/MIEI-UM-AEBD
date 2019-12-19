var oracledb = require("oracledb");

var conn1; // sys pdb
var conn2; // grupo 7
var conn3; // cdb



/* CRIAR CONEXÃO DEPENDENDO DE PARAMETROS */
function connect(user, pass, cs) {
  return oracledb.getConnection({
    user: user,
    password: pass,
    connectString: cs
  });
}


/* CARREGAMENTO INICIAL PARA RESOLVER DEPENDENCIAS, SÓ OCORRE NO INICIO */
function initialLoad() {
  conn2.execute("select * from db").then(dados => {
    if (dados.rows.length == 0) {

      conn1
        .execute("select name,platform_name from v$database")
        .then(dadosdb => {
          conn3
            .execute(
              "select version from dba_cpu_usage_statistics where dbid = 776972821"
            )
            .then(dadosversion => {
              console.log("vou inserir dados na db")
              conn2.execute("insert into db (name,platform, db_version) values(:name,:platform, :version)",
                [
                  dadosdb.rows[0][0],
                  dadosdb.rows[0][1],
                  dadosversion.rows[0][0]
                ], {
                  autoCommit: true
                }).then(coisas => {
                conn2.execute("select * from tablespace").then(dadostbss => {
                  if (dadostbss.rows.length == 0) {
                    console.log("nao tenho dados na tbs")
                    conn1
                      .execute(
                        "SELECT TABLESPACE_NAME,BLOCK_SIZE,MAX_SIZE,STATUS,CONTENTS FROM DBA_TABLESPACES"
                      )
                      .then(dadostbs => {
                        dadostbs.rows.forEach(table => {

                          conn2.execute("insert into tablespace (name, block_size, max_size, status, contents, timestamp, db_id) values (:a,:b,:c,:d,:e,CURRENT_TIMESTAMP,1)",
                            [
                              table[0],
                              table[1],
                              table[2],
                              table[3],
                              table[4]
                            ], {
                              autoCommit: true
                            }
                          )
                        })


                      })
                  }
                })
              })

            })
        })
    }
  })
}


/* UPDATE DAS TABELAS */
function update() {

  conn1
    .execute("select name,platform_name from v$database")
    .then(dadosdb => {
      conn3
        .execute(
          "select version from dba_cpu_usage_statistics where dbid = 776972821"
        )
        .then(dadosversion => {
          conn2.execute( //UPDATE AQUI - serve para o primeiro caso
            "update db set platform = :plat, db_version = :ver, timestamp = CURRENT_TIMESTAMP where name = :nm", [dadosdb.rows[0][1], dadosversion.rows[0][0], dadosdb.rows[0][0]], {
              autoCommit: true
            }
          ).then(d => {
            if (d.rowsAffected == 0)
              conn2.execute("insert into db (name,platform, db_version) values(:name,:platform, :version)",
                [
                  dadosdb.rows[0][0],
                  dadosdb.rows[0][1],
                  dadosversion.rows[0][0]
                ], {
                  autoCommit: true
                })
          })
        })
    })

  //inserir dados na tabela tablespaces

  conn1
    .execute(
      "SELECT TABLESPACE_NAME,BLOCK_SIZE,MAX_SIZE,STATUS,CONTENTS FROM DBA_TABLESPACES"
    )
    .then(dadostbs => {
      dadostbs.rows.forEach(table => {
        conn2.execute("update tablespace set block_size = :block_size, max_size = :max_size, status = :status, contents = :contents, timestamp = CURRENT_TIMESTAMP where name = :name", [table[1], table[2], table[3], table[4], table[0]], {
          autoCommit: true
        }).then(dtable => {

          if (dtable.rowsAffected == 0) {
            conn2.execute("insert into tablespace (name, block_size, max_size, status, contents, timestamp, db_id) values (:a,:b,:c,:d,:e,CURRENT_TIMESTAMP,1)",
              [
                table[0],
                table[1],
                table[2],
                table[3],
                table[4]
              ], {
                autoCommit: true
              }
            )
          }
        })
      })
    })

  //inserir dados na tabela datafiles


  conn1
    .execute(
      "select file_name, tablespace_name, autoextensible, status, maxbytes, bytes from dba_data_files"
    )
    .then(dadosdtf => {
      dadosdtf.rows.forEach(data => {
        conn2.execute("update datafile set auto_extensible = :auto_extensible, status = :status, max_bytes = :max_bytes, bytes = :bytes, timestamp = CURRENT_TIMESTAMP where name = :name", [data[2], data[3], data[4], data[5], data[0]], {
          autoCommit: true
        }).then(ddata => {

          if (ddata.rowsAffected == 0) {
            conn2.execute("insert into datafile (name, auto_extensible, status, max_bytes, bytes, tablespace_id) values (:a,:b,:c,:d,:e, (select max(t.id) from tablespace t where t.name = :f))",
              [
                data[0],
                data[2],
                data[3],
                data[4],
                data[5],
                data[1]
              ], {
                autoCommit: true
              }
            )
          }
        })
      })
    })

  //inserir dados na tabela users

  conn1
    .execute(
      "select user_id, username, account_status, default_tablespace, temporary_tablespace, last_login from dba_users"
    )
    .then(dados => {
      dados.rows.forEach(user => {
        console.log(user[5])
        conn2.execute("update users set username = :unaaa, account_status = :asaa, default_ts = :daat, temporary_ts = :taaas, last_login = :llaaa, timestamp = CURRENT_TIMESTAMP where id_user = :iaaau", [user[1], user[2], user[3], user[4], user[5], user[0]], {
          autoCommit: true
        }).then(duser => {

          if (duser.rowsAffected == 0) {
            conn2.execute("insert into users (id_user, username, account_status, default_ts, temporary_ts, last_login, timestamp, db_id) values (:id_user,:username,:ac_stat,:def_ts,:temp_ts,:lastlogin,CURRENT_TIMESTAMP,1)",
              [user[0], user[1], user[2], user[3], user[4], user[5]], {
                autoCommit: true
              }
            )
          }
        })
      })
    })

  conn1.execute("select round(sum(bytes)/1024/1024) from dba_data_files").then(total_size => {
    conn3.execute("select count(*) from v$session where username is not null").then(sess_num => {
      conn3.execute("select round(sum(bytes)/1024/1024) from V$SGASTAT where NAME like '%free memory%'").then(free_size => {
        conn3.execute("select round(sum(value)/1024/1024) from V$SGA").then(tot_size => {
          conn3.execute("select cpu_count, cpu_core_count, cpu_socket_count from DBA_CPU_USAGE_STATISTICS where dbid = 776972821").then(cpus => {
            conn2.execute("insert into db_status (total_size_ram, free_size_ram, used_size_ram, total_used_size, cpu_count, cpu_core_count, cpu_socket_count, number_sessions, timestamp, db_id) values (:1,:2,:3,:4,:5,:6,:7,:8,CURRENT_TIMESTAMP,1)",
              [tot_size.rows[0][0], free_size.rows[0][0], (tot_size.rows[0][0] - free_size.rows[0][0]), total_size.rows[0][0], cpus.rows[0][0], cpus.rows[0][1], cpus.rows[0][2], sess_num.rows[0][0]], {
                autoCommit: true
              })
          })
        })
      })
    })
  });

}

/* CORRER AGENTE */

function runAgent() {
  connect("system", "oracle", "//localhost/orcl")
    .then(connection => {
      conn1 = connection;
      connect("grupo7", "grupo7", "//localhost/orcl")
        .then(connection2 => {
          conn2 = connection2;
          connect("system", "oracle", "//localhost/orcl12c")
            .then(connection3 => {
              conn3 = connection3;
              initialLoad();
              setInterval(update, 15000);

            })
        })
    })
}

runAgent();