// Get the canvas element
const ctx = document.getElementById('electionChart').getContext('2d');
let electionChart;
let currentElection = 'assembly2021';
let currentMode = 'seats';

// Election data from ECI (simplified)
const electionData = {
    assembly2011: {
        labels: ['AIADMK', 'DMK', 'DMDK', 'INC', 'Others'],
        seats: [150, 23, 29, 5, 27],
        vote: [38.40, 22.39, 7.87, 9.31, 22.03],
        title: '2011 Assembly Election Results'
    },
    assembly2016: {
        labels: ['AIADMK', 'DMK', 'INC', 'PMK', 'Others'],
        seats: [136, 89, 8, 0, 1],
        vote: [40.77, 31.64, 6.42, 5.32, 15.85],
        title: '2016 Assembly Election Results'
    },
    assembly2021: {
        labels: ['DMK', 'AIADMK', 'INC', 'PMK', 'Others'],
        seats: [133, 66, 18, 5, 12],
        vote: [37.70, 33.29, 4.28, 3.81, 20.92],
        title: '2021 Assembly Election Results'
    },
    lokSabha2014: {
        labels: ['AIADMK', 'DMK', 'BJP', 'INC', 'Others'],
        seats: [37, 0, 1, 0, 1],
        vote: [44.92, 23.60, 5.49, 4.37, 21.62],
        title: '2014 Lok Sabha Election Results'
    },
    lokSabha2019: {
        labels: ['DMK', 'AIADMK', 'INC', 'PMK', 'Others'],
        seats: [23, 1, 8, 0, 7],
        vote: [33.51, 19.39, 12.77, 5.46, 28.87],
        title: '2019 Lok Sabha Election Results'
    },
    lokSabha2024: {
        labels: ['DMK', 'AIADMK', 'INC', 'BJP', 'Others'],
        seats: [22, 0, 9, 0, 8],
        vote: [26.93, 20.46, 10.67, 11.24, 30.70],
        title: '2024 Lok Sabha Election Results'
    } 
};

// Colors for consistency
const colors = {
    background: ['#27ae60', '#c0392b', '#f1c40f', '#3498db', '#e74c3c', '#95a5a6'],
    border: ['#219653', '#962d22', '#e67e22', '#2980b9', '#c0392b', '#7f8c8d']
};

// Initialize chart
function initChart(election, mode){
    electionChart = new Chart(ctx, {
        type: mode === 'seats' ? 'bar' : 'pie',
        data: {
            labels: electionData[election].labels,
            datasets: [{
                label: mode === 'seats' ? 'Seats Won' : 'Vote Share',
                data: electionData[election][mode],
                backgroundColor: colors.background.slice(0, electionData[election].labels.length),
                borderColor: colors.border.slice(0, electionData[election].labels.length),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {display: true, text: mode === 'seats' ? 'Number of Seats' : 'Vote %'}
                }
            },
            plugins: {
                legend: {display: true},
                tooltip: {enabled: true}
            }
        }
    });
    document.getElementById('chartTitle').textContent = electionData[election].title;
}

// Update chart for election
function updateChart(election) {
    currentElection = election;
    //electionChart.data.labels = electionData[election].labels;
    //electionChart.data.datasets[0].data = electionData[election][currentMode];
    //electionChart.data.datasets[0].backgroundColor = colors.background.slice(0, electionData[election].labels.length);
    //electionChart.data.datasets[0].borderColor = colors.border.slice(0, electionData[election].labels.length);
    //electionChart.options.scales.y.title.text = currentMode === 'seats' ? 'Number of Seats' : 'Vote %';
    //electionChart.data.datasets[0].label = currentMode === 'seats' ? 'Seats Won' : 'Vote Share';
    //electionChart.update();
    //document.getElementById('chartTitle').textContent = electionData[election].title;
    electionChart.destroy();
    initChart(election, currentMode);
}

// Toggle between seats and vote share
function toggleData(mode){
    currentMode = mode;
    updateChart(currentElection);
    document.querySelectorAll('.toggle button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === (mode === 'seats' ? 'Seats Won' : 'Vote Share')) {
            btn.classList.add('active');
        }
    });
}

// Start with 2021 Assembly Elections, Seats mode
initChart('assembly2021', 'seats');
document.querySelector('.toggle button:first-child').classList.add('active');