// Chart contexts
const ctxSeats = document.getElementById('seatsChart').getContext('2d');
const ctxVote = document.getElementById('voteChart').getContext('2d');
let seatsChart, voteChart;
let currentElection = 'assembly2021';

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

// Initialize charts
function initCharts(election) {
    console.log('Initializing charts for:', election);
    const partyColors = electionData[election].labels.map(label => colors.parties[label] || colors.parties['Others']);
    
    // Debug: Log the labels and seats data to inspect
    console.log('Labels:', electionData[election].labels);
    console.log('Seats:', electionData[election].seats);

    seatsChart = new Chart(ctxSeats, {
        type: 'bar',
        data: {
            labels: electionData[election].labels,
            datasets: [{
                label: 'Seats Won',
                data: electionData[election].seats,
                backgroundColor: partyColors,
                borderColor: partyColors,
                borderWidth: 1,
                barThickness: 20
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Seats',
                        color: '#ffffff',
                        font: { weight: 'bold', size: 14 }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12 }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            const party = context.chart.data.labels[context.dataIndex];
                            return `${party}: ${value} seats`;
                        }
                    }
                }
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' },
            hover: {
                mode: 'index',
                intersect: false,
                animationDuration: 400,
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
                }
            }
        }
    });

    voteChart = new Chart(ctxVote, {
        type: 'pie',
        data: {
            labels: electionData[election].labels,
            datasets: [{
                label: 'Vote %',
                data: electionData[election].vote,
                backgroundColor: partyColors,
                borderWidth: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#ffffff',
                        font: { size: 12, style: 'italic' }
                    }
                },
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

// Update charts and map with fade animation
function updateChart(election) {
    currentElection = election;
    const seatsCanvas = document.getElementById('seatsChart');
    const voteCanvas = document.getElementById('voteChart');
    seatsCanvas.style.opacity = 0;
    voteCanvas.style.opacity = 0;

    setTimeout(() => {
        seatsChart.destroy();
        voteChart.destroy();
        initCharts(election);
        seatsCanvas.style.opacity = 1;
        voteCanvas.style.opacity = 1;
        updateMap(election);
    }, 500);
}

// Initialize single map
let lokSabhaLayer, assemblyLayer;
const map = L.map('map-front', { zoomControl: true }).setView([11.1271, 78.6569], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB',
    maxZoom: 19
}).addTo(map);

// Reset map view function
function resetMapView() {
    const activeLayer = currentElection.startsWith('lokSabha') ? lokSabhaLayer : assemblyLayer;
    if (activeLayer) {
        map.fitBounds(activeLayer.getBounds(), { duration: 0.5 });
        map.invalidateSize();
    }
}

// Load GeoJSON with detailed debugging
fetch('tamilnadu_constituencies.geojson')
    .then(response => {
        if (!response.ok) {
            console.error('Lok Sabha GeoJSON fetch failed:', response.status, response.statusText);
            throw new Error('Lok Sabha GeoJSON fetch failed: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Lok Sabha GeoJSON loaded successfully:', data.features.length, 'features');
        console.log('Sample feature:', data.features[0].properties);
        lokSabhaLayer = L.geoJSON(data, { style: feature => styleFeature(feature, 'lokSabha'), onEachFeature });
        return fetch('tamilnadu_assembly.geojson');
    })
    .then(response => {
        if (!response.ok) {
            console.error('Assembly GeoJSON fetch failed:', response.status, response.statusText);
            throw new Error('Assembly GeoJSON fetch failed: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Assembly GeoJSON loaded successfully:', data.features.length, 'features');
        console.log('Sample feature:', data.features[0].properties);
        assemblyLayer = L.geoJSON(data, { style: feature => styleFeature(feature, 'assembly'), onEachFeature });
        assemblyLayer.addTo(map);
        console.log('Assembly layer added to map:', map.hasLayer(assemblyLayer));
        map.fitBounds(assemblyLayer.getBounds());
        map.invalidateSize();
        document.querySelector('.dashboard').appendChild(Object.assign(document.createElement('button'), {
            textContent: 'Reset View',
            className: 'reset-button',
            onclick: resetMapView
        }));
        updateChart('assembly2021');
    })
    .catch(err => {
        console.error('GeoJSON loading error:', err.message);
        L.geoJSON({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [[[78.0, 10.0], [79.0, 10.0], [79.0, 11.0], [78.0, 11.0], [78.0, 10.0]]] },
                properties: { assembly_c: 'Test Area' }
            }]
        }, { style: { color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.5 } }).addTo(map);
        map.invalidateSize();
    });

// Style function
function styleFeature(feature, type) {
    const constituency = feature.properties[type === 'lokSabha' ? 'parliame_1' : 'assembly_c'];
    let party = 'Others';
    if (winners[currentElection]) {
        for (const [p, constituencies] of Object.entries(winners[currentElection])) {
            if (constituencies.includes(constituency)) {
                party = p;
                break;
            }
        }
    }
    console.log(`Styling ${constituency} as ${party} (${colors.parties[party] || '#95a5a6'})`);
    return {
        color: type === 'lokSabha' ? '#ffffff' : '#cccccc',
        weight: type === 'lokSabha' ? 2 : 1,
        fillColor: colors.parties[party] || '#95a5a6',
        fillOpacity: 0.7
    };
}

// Tooltip and hover effects
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: () => layer.setStyle({ fillOpacity: 0.9 }).bringToFront(),
        mouseout: () => layer.setStyle({ fillOpacity: 0.7 })
    });
    updateTooltip(layer);
}

// Update tooltip dynamically
function updateTooltip(layer) {
    const constituency = layer.feature.properties[currentElection.startsWith('lokSabha') ? 'parliame_1' : 'assembly_c'];
    let party = 'Others';
    let voteShare = 'N/A';
    if (winners[currentElection]) {
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
}

// Update map with radial gradient transition
function updateMap(election) {
    console.log(`Updating map for ${election}, previous: ${currentElection}`);
    if (!lokSabhaLayer || !assemblyLayer) {
        console.log('Layers not loaded yet');
        return;
    }

    currentElection = election;
    const isLokSabha = election.startsWith('lokSabha');

    if (isLokSabha) {
        if (map.hasLayer(assemblyLayer)) map.removeLayer(assemblyLayer);
        if (!map.hasLayer(lokSabhaLayer)) lokSabhaLayer.addTo(map);
        lokSabhaLayer.eachLayer(layer => {
            layer.setStyle(styleFeature(layer.feature, 'lokSabha'));
            updateTooltip(layer);
        });
        map.fitBounds(lokSabhaLayer.getBounds());
    } else {
        if (map.hasLayer(lokSabhaLayer)) map.removeLayer(lokSabhaLayer);
        if (!map.hasLayer(assemblyLayer)) assemblyLayer.addTo(map);
        assemblyLayer.eachLayer(layer => {
            layer.setStyle(styleFeature(layer.feature, 'assembly'));
            updateTooltip(layer);
        });
        map.fitBounds(assemblyLayer.getBounds());
    }
    map.invalidateSize();
    console.log('Current layers:', {
        lokSabha: map.hasLayer(lokSabhaLayer),
        assembly: map.hasLayer(assemblyLayer)
    });

    const mapCard = document.querySelector('.map-card');
    mapCard.classList.add('transitioning');
    setTimeout(() => {
        mapCard.classList.remove('transitioning');
        map.invalidateSize();
        map.whenReady(() => {
            console.log('Map rendered for:', election);
            map.invalidateSize();
        });
    }, 800);
}

// Start with 2021 Assembly
window.onload = function() {
    initCharts('assembly2021');
    updateChart('assembly2021');
};