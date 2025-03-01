// Chart context
const ctx = document.getElementById('electionChart').getContext('2d');
let electionChart;
let currentElection = 'assembly2021';
let currentMode = 'seats';

// Colors for charts and map
const colors = {
    background: ['#27ae60', '#c0392b', '#f1c40f', '#3498db', '#e74c3c', '#95a5a6'],
    border: ['#219653', '#962d22', '#e67e22', '#2980b9', '#c0392b', '#7f8c8d'],
    parties: {
        'DMK': '#ff2e17',
        'AIADMK': '#27ae60',
        'INC': '#3498db',
        'VCK': '#2e3adc',
        'BJP': '#ff7b00',
        'CPI': '#d53f37',
        'CPI (M)': '#72251c',
        'MDMK': '#ed8b80',
        'IUML': '#186839',
        'PMK': '#f4da35',
        'DMDK': '#9c7d00',
        'PT': '#3c6315',
        'AIFB': '#b77d7d',
        'MNMK': '#000000',
        'Others': '#95a5a6'
    }
};

// Initialize chart
function initChart(election, mode) {
    const partyColors = electionData[election].labels.map(label => colors.parties[label] || colors.parties['Others']);
    electionChart = new Chart(ctx, {
        type: mode === 'seats' ? 'bar' : 'pie',
        data: {
            labels: electionData[election].labels,
            datasets: [{
                label: mode === 'seats' ? 'Seats Won' : 'Vote %',
                data: electionData[election][mode],
                backgroundColor: partyColors,
                borderColor: mode === 'seats' ? partyColors : undefined,
                borderWidth: mode === 'seats' ? 1 : 0
            }]
        },
        options: {
            scales: mode === 'seats' ? { y: { beginAtZero: true, title: { display: true, text: 'Number of Seats' } } } : {},
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' },
            hover: {
                mode: 'nearest',
                intersect: true,
                animationDuration: 400,
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
                }
            }
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
let lokSabhaLayer, assemblyLayer;
const map = L.map('map').setView([11.1271, 78.6569], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Reset map view function
function resetMapView() {
    if (currentElection.startsWith('lokSabha') && lokSabhaLayer) {
        map.fitBounds(lokSabhaLayer.getBounds(), { duration: 0.5 });
    } else if (currentElection.startsWith('assembly') && assemblyLayer) {
        map.fitBounds(assemblyLayer.getBounds(), { duration: 0.5 });
    }
}

// Load Lok Sabha GeoJSON
console.log('Loading Lok Sabha GeoJSON...');
fetch('tamilnadu_constituencies.geojson')
    .then(response => {
        if (!response.ok) throw new Error('Lok Sabha GeoJSON fetch failed: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('Lok Sabha GeoJSON loaded:', data.features.length, 'features');
        lokSabhaLayer = L.geoJSON(data, {
            style: function(feature) {
                const constituency = feature.properties.parliame_1;
                let party = 'Others';
                if (winners[currentElection] && currentElection.startsWith('lokSabha')) {
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
                let voteShare = 'N/A';
                if (winners[currentElection] && currentElection.startsWith('lokSabha')) {
                    for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            voteShare = constituencyVoteShares[currentElection]?.[constituency]?.[party] || 'N/A';
                            break;
                        }
                    }
                }
                layer.bindTooltip(`${constituency} - ${party} (${voteShare}%)`, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10]
                });
                layer.on({
                    mouseover: function() {
                        layer.setStyle({
                            fillOpacity: 0.9
                        });
                        layer.bringToFront();
                    },
                    mouseout: function() {
                        const party = Object.entries(winners[currentElection] && currentElection.startsWith('lokSabha') ? winners[currentElection] : {}).find(([p, constituencies]) => constituencies.includes(constituency))?.[0] || 'Others';
                        layer.setStyle({
                            fillColor: colors.parties[party],
                            fillOpacity: 0.7
                        });
                    }
                });
            }
        });

        // Load Assembly GeoJSON
        console.log('Loading Assembly GeoJSON...');
        fetch('tamilnadu_assembly.geojson')
            .then(response => {
                if (!response.ok) throw new Error('Assembly GeoJSON fetch failed: ' + response.status);
                return response.json();
            })
            .then(data => {
                console.log('Assembly GeoJSON loaded:', data.features.length, 'features');
                assemblyLayer = L.geoJSON(data, {
                    style: function(feature) {
                        const constituency = feature.properties.assembly_c;
                        let party = 'Others';
                        if (winners[currentElection] && currentElection.startsWith('assembly')) {
                            for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                                if (constituencies.includes(constituency)) {
                                    party = p;
                                    break;
                                }
                            }
                        }
                        return {
                            color: "#666666",
                            weight: 1,
                            fillColor: colors.parties[party],
                            fillOpacity: 0.7
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        const constituency = feature.properties.assembly_c;
                        let party = 'Others';
                        let voteShare = 'N/A';
                        if (winners[currentElection] && currentElection.startsWith('assembly')) {
                            for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                                if (constijuencies.includes(constituency)) {
                                    party = p;
                                    voteShare = constituencyVoteShares[currentElection]?.[constituency]?.[party] || 'N/A';
                                    break;
                                }
                            }
                        }
                        layer.bindTooltip(`${constituency} - ${party} (${voteShare}%)`, {
                            permanent: false,
                            direction: 'top',
                            offset: [0, -10]
                        });
                        layer.on({
                            mouseover: function() {
                                layer.setStyle({
                                    fillOpacity: 0.9
                                });
                                layer.bringToFront();
                            },
                            mouseout: function() {
                                const party = Object.entries(winners[currentElection] && currentElection.startsWith('assembly') ? winners[currentElection] : {}).find(([p, constituencies]) => constituencies.includes(constituency))?.[0] || 'Others';
                                layer.setStyle({
                                    fillColor: colors.parties[party],
                                    fillOpacity: 0.7
                                });
                            }
                        });
                    }
                });

                // Initial toggle - Assembly 2021 starts visible
                if (currentElection.startsWith('assembly')) {
                    assemblyLayer.addTo(map);
                    map.fitBounds(assemblyLayer.getBounds());
                } else {
                    lokSabhaLayer.addTo(map);
                    map.fitBounds(lokSabhaLayer.getBounds());
                }
                updateMap(currentElection);

                const resetButton = document.createElement('button');
                resetButton.textContent = 'Reset View';
                resetButton.className = 'reset-button';
                resetButton.onclick = resetMapView;
                document.querySelector('.dashboard').appendChild(resetButton);
            })
            .catch(err => console.error('Assembly GeoJSON error:', err));
    })
    .catch(err => console.error('Lok Sabha GeoJSON error:', err));

// Update map with winners and toggle layers
function updateMap(election) {
    console.log(`Map updating for ${election}`);
    if (lokSabhaLayer && assemblyLayer) {
        if (election.startsWith('lokSabha')) {
            if (map.hasLayer(assemblyLayer)) map.removeLayer(assemblyLayer);
            if (!map.hasLayer(lokSabhaLayer)) lokSabhaLayer.addTo(map);
            lokSabhaLayer.eachLayer(function(layer) {
                const constituency = layer.feature.properties.parliame_1;
                let party = 'Others';
                let voteShare = 'N/A';
                if (winners[election]) {
                    for (const [p, constituencies] of Object.entries(winners[election])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            voteShare = constituencyVoteShares[election]?.[constituency]?.[party] || 'N/A';
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
                layer.bindTooltip(`${constituency} - ${party} (${voteShare}%)`, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10]
                });
            });
            map.fitBounds(lokSabhaLayer.getBounds());
        } else if (election.startsWith('assembly')) {
            if (map.hasLayer(lokSabhaLayer)) map.removeLayer(lokSabhaLayer);
            if (!map.hasLayer(assemblyLayer)) assemblyLayer.addTo(map);
            assemblyLayer.eachLayer(function(layer) {
                const constituency = layer.feature.properties.assembly_c;
                let party = 'Others';
                let voteShare = 'N/A';
                if (winners[election]) {
                    for (const [p, constituencies] of Object.entries(winners[election])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            voteShare = constituencyVoteShares[election]?.[constituency]?.[party] || 'N/A';
                            break;
                        }
                    }
                }
                layer.setStyle({
                    color: "#666666",
                    weight: 1,
                    fillColor: colors.parties[party],
                    fillOpacity: 0.7
                });
                layer.bindTooltip(`${constituency} - ${party} (${voteShare}%)`, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10]
                });
            });
            map.fitBounds(assemblyLayer.getBounds());
        }
    } else {
        console.log('One or both layers not loaded yet');
    }
}

// Start with 2021 Assembly
initChart('assembly2021', 'seats');
document.querySelector('.toggle button:first-child').classList.add('active');