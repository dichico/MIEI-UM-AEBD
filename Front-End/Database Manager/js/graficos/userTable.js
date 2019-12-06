// Function para adicionar as linhas da tabela
function appendToUserTable (ID_USER, USERNAME, ACCOUNT_STATUS, DEFAULT_TS, TEMPORARY_TS, LAST_LOGIN) {
  
  var table = document.getElementById('usertable');
  var newRow = document.createElement('tr');
  newRow.innerHTML = `
    <th>${ID_USER}</th>
    <th>${USERNAME}</th>
    <th>${ACCOUNT_STATUS}</th>
    <th>${DEFAULT_TS}</th>
    <th>${TEMPORARY_TS}</th>
    <th>${LAST_LOGIN}</th>
  `;
  
  table.appendChild(newRow)
}

$(document).ready(function() {

  var data = 'http://localhost:8080/ords/grupo7/users/?q={"$orderby":{"id":"ASC"}}'
  $.getJSON(data, function (json) {
        
    // Ciclo for para cada item -> linha
    for (var item of json.items) {
      appendToUserTable(item.id_user, item.username, item.account_status, item.default_ts, item.temporary_ts, item.last_login)
    }
  
  })

  $('#userTable').DataTable();
})