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

// Initialize maps
let lokSabhaLayerFront, assemblyLayerFront, lokSabhaLayerBack, assemblyLayerBack;
const mapFront = L.map('map-front', { zoomControl: true }).setView([11.1271, 78.6569], 7);
const mapBack = L.map('map-back', { zoomControl: true }).setView([11.1271, 78.6569], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapFront).addTo(mapBack);

let currentMap = mapFront;
let isFrontActive = true;

// Reset map view function
function resetMapView() {
    const activeLayer = currentElection.startsWith('lokSabha') ? (isFrontActive ? lokSabhaLayerFront : lokSabhaLayerBack) : (isFrontActive ? assemblyLayerFront : assemblyLayerBack);
    if (activeLayer) {
        currentMap.fitBounds(activeLayer.getBounds(), { duration: 0.5 });
        currentMap.invalidateSize();
    }
}

// Load GeoJSON
fetch('tamilnadu_constituencies.geojson')
    .then(response => {
        if (!response.ok) throw new Error('Lok Sabha GeoJSON fetch failed: ' + response.status);
        return response.json();
    })
    .then(data => {
        lokSabhaLayerFront = L.geoJSON(data, { style: styleFeature('lokSabha'), onEachFeature });
        lokSabhaLayerBack = L.geoJSON(data, { style: styleFeature('lokSabha'), onEachFeature });
        return fetch('tamilnadu_assembly.geojson');
    })
    .then(response => {
        if (!response.ok) throw new Error('Assembly GeoJSON fetch failed: ' + response.status);
        return response.json();
    })
    .then(data => {
        assemblyLayerFront = L.geoJSON(data, { style: styleFeature('assembly'), onEachFeature });
        assemblyLayerBack = L.geoJSON(data, { style: styleFeature('assembly'), onEachFeature });
        assemblyLayerFront.addTo(mapFront);
        mapFront.fitBounds(assemblyLayerFront.getBounds());
        mapFront.invalidateSize();
        document.querySelector('.dashboard').appendChild(Object.assign(document.createElement('button'), {
            textContent: 'Reset View',
            className: 'reset-button',
            onclick: resetMapView
        }));
        updateMap('assembly2021'); // Ensure initial state
    })
    .catch(err => console.error('GeoJSON error:', err));

// Style function
function styleFeature(type) {
    return feature => {
        const constituency = feature.properties[type === 'lokSabha' ? 'parliame_1' : 'assembly_c'];
        let party = 'Others';
        if (winners[currentElection] && currentElection.startsWith(type)) {
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
            fillColor: colors.parties[party],
            fillOpacity: 0.7
        };
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

// Update map with flip transition
function updateMap(election) {
    console.log(`Updating map for ${election}`);
    if (!lokSabhaLayerFront || !assemblyLayerFront) {
        console.log('Layers not loaded yet');
        return;
    }

    const isLokSabha = election.startsWith('lokSabha');
    const nextMap = isFrontActive ? mapBack : mapFront;
    const nextLokSabhaLayer = isFrontActive ? lokSabhaLayerBack : lokSabhaLayerFront;
    const nextAssemblyLayer = isFrontActive ? assemblyLayerBack : assemblyLayerFront;

    // Update currentElection before styling
    currentElection = election;

    // Prepare next map
    if (isLokSabha) {
        if (nextMap.hasLayer(nextAssemblyLayer)) nextMap.removeLayer(nextAssemblyLayer);
        if (!nextMap.hasLayer(nextLokSabhaLayer)) nextLokSabhaLayer.addTo(nextMap);
        nextLokSabhaLayer.eachLayer(layer => {
            layer.setStyle(styleFeature('lokSabha'));
            updateTooltip(layer);
        });
        nextMap.fitBounds(nextLokSabhaLayer.getBounds());
    } else {
        if (nextMap.hasLayer(nextLokSabhaLayer)) nextMap.removeLayer(nextLokSabhaLayer);
        if (!nextMap.hasLayer(nextAssemblyLayer)) nextAssemblyLayer.addTo(nextMap);
        nextAssemblyLayer.eachLayer(layer => {
            layer.setStyle(styleFeature('assembly'));
            updateTooltip(layer);
        });
        nextMap.fitBounds(nextAssemblyLayer.getBounds());
    }
    nextMap.invalidateSize();

    // Flip animation
    const mapCard = document.querySelector('.map-card');
    mapCard.classList.add('flipped');
    setTimeout(() => {
        currentMap = nextMap;
        isFrontActive = !isFrontActive;
        currentMap.invalidateSize();
        mapCard.classList.remove('flipped');
        currentMap.whenReady(() => currentMap.invalidateSize()); // Ensure render after flip
    }, 400); // Half of 0.8s
}

// Start with 2021 Assembly
initChart('assembly2021', 'seats');
document.querySelector('.toggle button:first-child').classList.add('active');