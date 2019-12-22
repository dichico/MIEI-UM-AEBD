// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function grafico() {

    var x = Array()
    var y = Array()
    var tse = Array()
  
    var dataFile = document.getElementById("textDatafile").value;

    document.getElementById("titulo").innerHTML = "Armazenamento Usado no Datafile " + dataFile
  
    var test = 'http://localhost:8080/ords/grupo7/personalizado/2?datafile_id=' + dataFile
    $.getJSON(test, function (json) {

  
      for (i = 0; i < json.items.length; i++) {
        x.push(json.items[i].timestamp)
        y.push(json.items[i].bytes)
        var ts = new Date(json.items[i].timestamp)
        tse.push(ts.toLocaleTimeString())
      }
  
      // Area Chart Example
      var chart = document.getElementById("usedDatafileChart");
      var freeSizeChart = new Chart(chart, {
        type: 'line',
        data: {
          labels: tse,
          datasets: [{
            label: "Used Size",
            lineTension: 0.3,
            backgroundColor: "rgba(244, 234, 234)",
            borderColor: "rgba(191, 0, 0)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(191, 0, 0)",
            pointBorderColor: "rgba(255, 255, 255, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: y,
          }],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                beginAtZero: true
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }],
          },
          legend: {
            display: false
          },
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + tooltipItem.yLabel + "MB";
              }
            }
          }
        }
      })
    });
  }


$(document).ready();