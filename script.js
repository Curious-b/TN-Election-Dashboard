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

// Party winners from ECI
const winners = {
    lokSabha2014: {
        'AIADMK': ['Tiruvallur (SC)', 'Chennai North', 'Chennai South', 'Chennai Central', 'Sriperumbudur', 'Kancheepuram (SC)', 'Arakkonam', 'Vellore', 'Krishnagiri', 'Tiruvannamalai', 'Arani', 'Viluppuram (SC)', 'Kallakurichi', 'Salem', 'Namakkal', 'Erode', 'Tiruppur', 'Nilgiris (SC)', 'Coimbatore', 'Pollachi', 'Dindigul', 'Karur', 'Tiruchirappalli', 'Perambalur', 'Cuddalore', 'Chidambaram (SC)', 'Mayiladuthurai', 'Nagapattinam (SC)', 'Thanjavur', 'Sivaganga', 'Madurai', 'Theni', 'Virudhunagar', 'Ramanathapuram', 'Thoothukkudi', 'Tenkasi (SC)', 'Tirunelveli'],
        'PMK': ['Dharmapuri'],
        'BJP': ['Kanniyakumari']
    },
    lokSabha2019: {
        'DMK': ['Chennai North', 'Chennai South', 'Chennai Central', 'Sriperumbudur', 'Kancheepuram (SC)', 'Arakkonam', 'Vellore', 'Dharmapuri', 'Tiruvannamalai', 'Viluppuram (SC)', 'Kallakurichi', 'Salem', 'Namakkal', 'Erode', 'Nilgiris (SC)', 'Pollachi', 'Dindigul', 'Perambalur', 'Cuddalore', 'Mayiladuthurai', 'Thanjavur', 'Thoothukkudi', 'Tenkasi (SC)', 'Tirunelveli'],
        'INC': ['Tiruvallur (SC)', 'Krishnagiri', 'Arani', 'Karur', 'Tiruchirappalli', 'Sivaganga', 'Virudhunagar', 'Kanniyakumari'],
        'CPI': ['Tiruppur', 'Nagapattinam (SC)'],
        'CPI(M)': ['Coimbatore', 'Madurai'],
        'VCK': ['Chidambaram (SC)'],
        'IUML': ['Ramanathapuram'],
        'AIADMK': ['Theni']
    },
    lokSabha2024: {
        'DMK': ['Chennai North', 'Chennai South', 'Chennai Central', 'Sriperumbudur', 'Kancheepuram (SC)', 'Arakkonam', 'Vellore', 'Dharmapuri', 'Tiruvannamalai', 'Arani', 'Kallakurichi', 'Salem', 'Namakkal', 'Erode', 'Nilgiris (SC)', 'Coimbatore', 'Pollachi', 'Perambalur', 'Thanjavur', 'Theni', 'Thoothukkudi', 'Tenkasi (SC)'],
        'INC': ['Tiruvallur (SC)', 'Krishnagiri', 'Karur', 'Cuddalore', 'Mayiladuthurai', 'Sivaganga', 'Virudhunagar', 'Tirunelveli', 'Kanniyakumari'],
        'CPI': ['Tiruppur', 'Nagapattinam (SC)'],
        'CPI(M)': ['Dindigul', 'Madurai'],
        'VCK': ['Viluppuram (SC)', 'Chidambaram (SC)'],
        'MDMK': ['Tiruchirappalli'],
        'IUML': ['Ramanathapuram']
    }
};

// Colors for charts and map
const colors = {
    background: ['#27ae60', '#c0392b', '#f1c40f', '#3498db', '#e74c3c', '#95a5a6'],
    border: ['#219653', '#962d22', '#e67e22', '#2980b9', '#c0392b', '#7f8c8d'],
    parties: {
        'DMK': '#ff2e17',     // Red
        'AIADMK': '#27ae60',  // Green
        'INC': '#3498db',     // Sky Blue
        'VCK': '#2e3adc',     // Blue
        'BJP': '#f1c40f',     // Orange
        'CPI': '#d53f37',     // Dark red
        'CPI(M)': '#72251c',  // Brownish red
        'MDMK': '#ed8b80',    // Pale red
        'IUML': '#186839',    // Dark Green
        'PMK': '#f4d03f',     // Yellow
        'Others': '#95a5a6'   // Grey
    }
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
let geoJsonLayer;
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
        geoJsonLayer = L.geoJSON(data, {
            style: function(feature) {
                const constituency = feature.properties.parliame_1;
                let party = 'Others';
                if (winners[currentElection]) {
                    for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            break;
                        }
                    }
                }
                return {
                    color: "#333333",
                    weight: 2,
                    fillColor: colors.parties[party],
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer) {
                const constituency = feature.properties.parliame_1;
                let party = 'Others';
                if (winners[currentElection]) {
                    for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            break;
                        }
                    }
                }
                layer.bindPopup(`${constituency} - ${party}`);
                layer.on({
                    mouseover: function() {
                        layer.setStyle({
                            fillOpacity: 0.9
                        });
                        layer.bringToFront();
                    },
                    mouseout: function() {
                        const party = Object.entries(winners[currentElection] || {}).find(([p, constituencies]) => constituencies.includes(constituency))?.[0] || 'Others';
                        layer.setStyle({
                            fillColor: colors.parties[party],
                            fillOpacity: 0.7
                        });
                    },
                    click: function() {
                        map.fitBounds(layer.getBounds(), { duration: 0.5 }); // Zoom to constituency
                    }
                });
            }
        }).addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
        updateMap(currentElection); // Initial map update
    })
    .catch(err => console.error('GeoJSON error:', err));

// Update map with winners
function updateMap(election) {
    console.log(`Map updating for ${election}`);
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(function(layer) {
            const constituency = layer.feature.properties.parliame_1;
            let party = 'Others';
            if (winners[election]) {
                for (const [p, constituencies] of Object.entries(winners[election])) {
                    if (constituencies.includes(constituency)) {
                        party = p;
                        break;
                    }
                }
            }
            layer.setStyle({
                color: "#333333",
                weight: 2,
                fillColor: colors.parties[party],
                fillOpacity: 0.7
            });
            layer.bindPopup(`${constituency} - ${party}`);
        });
    } else {
        console.log('GeoJSON layer not loaded yet');
    }
}

// Start with 2021 Assembly
initChart('assembly2021', 'seats');
document.querySelector('.toggle button:first-child').classList.add('active');