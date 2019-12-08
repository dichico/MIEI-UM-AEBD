// Function para adicionar as linhas da tabela
function appendToDataFileTable (ID_DATAFILE, NAME, AUTO_EXTENSIBLE, STATUS, MAX_BYTES, BYTES, LAST_LOGIN) {
  
    var table = document.getElementById('datafileTable');
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
      <th>${ID_DATAFILE}</th>
      <th>${NAME}</th>
      <th>${AUTO_EXTENSIBLE}</th>
      <th>${STATUS}</th>
      <th>${MAX_BYTES}</th>
      <th>${BYTES}</th>
      <th>${LAST_LOGIN}</th>
    `;

    table.appendChild(newRow)
  }
  
$(document).ready(function() {
    var data = 'http://localhost:8080/ords/grupo7/datafile/?q={"$orderby":{"id":"ASC"}}'
    $.getJSON(data, function (json) {
          
      // Ciclo for para cada item -> linha
      for (var item of json.items) {
        var ts = new Date(item.timestamp)
        appendToDataFileTable(item.id, item.name, item.auto_extensible, item.status, item.max_bytes, item.bytes, ts.toLocaleTimeString())
      }
    
    })
    $('datafileTable').DataTable();
})