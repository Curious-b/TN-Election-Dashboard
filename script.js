// Chart context
const ctx = document.getElementById('electionChart').getContext('2d');
let electionChart;
let currentElection = 'assembly2021';
let currentMode = 'seats';

// Election data from ECI
const electionData = {
    assembly2011: { labels: ['AIADMK', 'DMK', 'DMDK', 'INC', 'Others'], seats: [150, 23, 29, 5, 27], vote: [38.40, 22.39, 7.87, 9.31, 22.03], title: '2011 Assembly Election Results' },
    assembly2016: { labels: ['AIADMK', 'DMK', 'INC', 'PMK', 'Others'], seats: [136, 89, 8, 0, 1], vote: [40.77, 31.64, 6.42, 5.32, 15.85], title: '2016 Assembly Election Results' },
    assembly2021: { labels: ['DMK', 'AIADMK', 'INC', 'PMK', 'Others'], seats: [133, 66, 18, 5, 12], vote: [37.70, 33.29, 4.28, 3.81, 20.92], title: '2021 Assembly Election Results' },
    lokSabha2014: { labels: ['AIADMK', 'DMK', 'BJP', 'INC', 'Others'], seats: [37, 0, 1, 0, 1], vote: [44.92, 23.60, 5.49, 4.37, 21.62], title: '2014 Lok Sabha Election Results' },
    lokSabha2019: { labels: ['DMK', 'AIADMK', 'INC', 'PMK', 'Others'], seats: [23, 1, 8, 0, 7], vote: [33.51, 19.39, 12.77, 5.46, 28.87], title: '2019 Lok Sabha Election Results' },
    lokSabha2024: { labels: ['DMK', 'AIADMK', 'INC', 'BJP', 'Others'], seats: [22, 0, 9, 0, 8], vote: [26.93, 20.46, 10.67, 11.24, 30.70], title: '2024 Lok Sabha Election Results' }
};

// Colors for charts
const colors = {
    background: ['#27ae60', '#c0392b', '#f1c40f', '#3498db', '#e74c3c', '#95a5a6'],
    border: ['#219653', '#962d22', '#e67e22', '#2980b9', '#c0392b', '#7f8c8d']
};

// Initialize chart
function initChart(election, mode) {
    electionChart = new Chart(ctx, {
        type: mode === 'seats' ? 'bar' : 'pie',
        data: {
            labels: electionData[election].labels,
            datasets: [{
                label: mode === 'seats' ? 'Seats Won' : 'Vote %',
                data: electionData[election][mode],
                backgroundColor: colors.background.slice(0, electionData[election].labels.length),
                borderColor: mode === 'seats' ? colors.border.slice(0, electionData[election].labels.length) : undefined,
                borderWidth: mode === 'seats' ? 1 : 0
            }]
        },
        options: {
            scales: mode === 'seats' ? { y: { beginAtZero: true, title: { display: true, text: 'Number of Seats' } } } : {},
            plugins: { legend: { display: true } },
            animation: { duration: 1000, easing: 'easeInOutQuad' }
        }
    });
    document.getElementById('chartTitle').textContent = electionData[election].title;
}

// Update chart with fade animation
function updateChart(election) {
    currentElection = election;
    document.getElementById('electionChart').style.opacity = 0;
    setTimeout(() => {
        electionChart.destroy();
        initChart(election, currentMode);
        document.getElementById('electionChart').style.opacity = 1;
        updateMap(election);
    }, 500);
}

// Toggle between seats and vote %
function toggleData(mode) {
    currentMode = mode;
    updateChart(currentElection);
    document.querySelectorAll('.toggle button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === (mode === 'seats' ? 'Seats Won' : 'Vote %')) btn.classList.add('active');
    });
}

// Initialize map
const map = L.map('map').setView([11.1271, 78.6569], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Load TNGIS GeoJSON
console.log('Loading GeoJSON...');
fetch('tamilnadu_constituencies.geojson')
    .then(response => {
        if (!response.ok) throw new Error('GeoJSON fetch failed: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('GeoJSON loaded:', data.features.length, 'features');
        const geoJsonLayer = L.geoJSON(data, {
            style: function(feature) {
                console.log('Rendering:', feature.properties.parliame_1);
                return {
                    color: "#ff6b6b",
                    weight: 2,
                    fillColor: "#4ecdc4",
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.parliame_1 || 'Unknown');
            }
        }).addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
    })
    .catch(err => console.error('GeoJSON error:', err));

// Update map
function updateMap(election) {
    console.log(`Map updating for ${election}`);
}

// Start with 2021 Assembly
initChart('assembly2021', 'seats');
document.querySelector('.toggle button:first-child').classList.add('active');