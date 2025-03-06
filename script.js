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
    console.log('Initializing chart for:', election);
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
            plugins: { legend: { display: true }, tooltip: { enabled: true } },
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

// Initialize single map
let lokSabhaLayer, assemblyLayer;
const map = L.map('map-front', { zoomControl: true }).setView([11.1271, 78.6569], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Reset map view function
function resetMapView() {
    const activeLayer = currentElection.startsWith('lokSabha') ? lokSabhaLayer : assemblyLayer;
    if (activeLayer) {
        map.fitBounds(activeLayer.getBounds(), { duration: 0.5 });
        map.invalidateSize();
    }
}

// Load GeoJSON
fetch('tamilnadu_constituencies.geojson')
    .then(response => {
        if (!response.ok) throw new Error('Lok Sabha GeoJSON fetch failed: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('Lok Sabha GeoJSON loaded:', data.features.length, 'features');
        lokSabhaLayer = L.geoJSON(data, { style: feature => styleFeature(feature, 'lokSabha'), onEachFeature });
        return fetch('tamilnadu_assembly.geojson');
    })
    .then(response => {
        if (!response.ok) throw new Error('Assembly GeoJSON fetch failed: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('Assembly GeoJSON loaded:', data.features.length, 'features');
        assemblyLayer = L.geoJSON(data, { style: feature => styleFeature(feature, 'assembly'), onEachFeature });
        assemblyLayer.addTo(map); // Initial load
        map.fitBounds(assemblyLayer.getBounds());
        map.invalidateSize();
        document.querySelector('.dashboard').appendChild(Object.assign(document.createElement('button'), {
            textContent: 'Reset View',
            className: 'reset-button',
            onclick: resetMapView
        }));
        updateMap('assembly2021'); // Ensure initial state
    })
    .catch(err => console.error('GeoJSON error:', err));

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
    return {
        color: type === 'lokSabha' ? '#333333' : '#666666',
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
    updateTooltip(layer); // Initial tooltip
}

// Update tooltip dynamically
function updateTooltip(layer) {
    const constituency = layer.feature.properties[currentElection.startsWith('lokSabha') ? 'parliame_1' : 'assembly_c'];
    let party = 'Others';
    let voteShare = 'N/A';
    if (winners[currentElection]) {
        for (const [p, constituencies] of Object.entries(winners[currentElection])) {
            if (constiuencies.includes(constituency)) {
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

    // Update layers
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

    // Radial gradient animation
    const mapCard = document.querySelector('.map-card');
    mapCard.classList.add('transitioning');
    setTimeout(() => {
        mapCard.classList.remove('transitioning');
        map.invalidateSize();
        map.whenReady(() => {
            console.log('Map rendered for:', election);
            map.invalidateSize();
        });
    }, 800); // Match animation duration
}

// Start with 2021 Assembly
initChart('assembly2021', 'seats');
document.querySelector('.toggle button:first-child').classList.add('active');