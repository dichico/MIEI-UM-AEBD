// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';


$(document).ready(function() {
    var x = Array()
    var y = Array()
    var tse = Array()

    var test = 'http://localhost:8080/ords/grupo7/db_status/?q={"$orderby":{"id":"ASC"}}'
    $.getJSON(test, function(json) {
        
        for(i=0; i<json.items.length; i++){
            x.push(json.items[i].timestamp)
            y.push(json.items[i].number_sessions)
            var ts = new Date(json.items[i].timestamp)
            tse.push(ts.toLocaleTimeString())
        }

    // Bar Chart Example
    var ctx = document.getElementById("sessionTimeChart");
    var sessionTimeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: tse,
        datasets: [{
        label: "Number of Sessions",
        backgroundColor: "#4e73df",
        hoverBackgroundColor: "#2e59d9",
        borderColor: "#4e73df",
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
            maxTicksLimit: 6
            },
            maxBarThickness: 25,
        }],
        yAxes: [{
            ticks: {
            maxTicksLimit: 5,
            padding: 10
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
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
            label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
            }
        }
        },
    }
    });
    }

    
    
    )

}

)