// Function para adicionar as linhas da tabela
function appendToTableSpaceTable (ID_TABLESPACE, NAME, BLOCK_SIZE, MAX_SIZE, STATUS, CONTENTS) {
  
    var table = document.getElementById('tablespaceTable');
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
      <th>${ID_TABLESPACE}</th>
      <th>${NAME}</th>
      <th>${BLOCK_SIZE}</th>
      <th>${MAX_SIZE}</th>
      <th>${STATUS}</th>
      <th>${CONTENTS}</th>
    `;

    table.appendChild(newRow)
  }
  
$(document).ready(function() {
    var data = 'http://localhost:8080/ords/grupo7/tablespace/?limit=500'
    $.getJSON(data, function (json) {
          
      // Ciclo for para cada item -> linha
      for (var item of json.items) {
        var ts = new Date(item.timestamp)
        appendToTableSpaceTable(item.id, item.name, item.block_size, item.max_size, item.status, item.contents)
      }
    
    })
    $('tablespaceTable').DataTable(
      {select: true}
    );
})