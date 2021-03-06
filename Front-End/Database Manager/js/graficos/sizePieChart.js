// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';



$(document).ready(function () {

  var x = Array()
  var y = Array()

  var test = 'http://localhost:8080/ords/grupo7/db_status/'
  $.getJSON(test, function (json) {
    
    item = [json.items.length-1]
      x.push(json.items[item].free_size_ram)
      y.push(json.items[item].used_size_ram)

    // Pie Chart Example
    var ctx = document.getElementById("sizePieChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Livre", "Ocupado"],
        datasets: [{
          data: [x, y],
          backgroundColor: ['#1cc88a', '#e74a3b'],
          hoverBackgroundColor: ['#00802b', '#b30000'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    })
  })
});