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

// Party winners from ECI (aggregated for both)
const winners = {
    assembly2011: {
        'AIADMK' : ['Ponneri (SC)', 'Thiruvallur', 'Poonamallee (SC)', 'Avadi', 'Ambattur', 'Madavaram', 'Tiruvottiyur', 'Dr.Radhakrishnan Nagar', 'Villivakkam', 'Thiru-Vi-Ka-Nagar (SC)', 'Royapuram', 'Harbour', 'Thousand Lights', 'Anna Nagar', 'Saidapet', 'Thiyagarayanagar', 'Mylapore', 'Velachery', 'Shozhinganallur', 'Sriperumbudur (SC)', 'Pallavaram', 'Tambaram', 'Thiruporur', 'Cheyyur (SC)', 'Madurantakam (SC)', 'Uthiramerur', 'Kancheepuram', 'Arakkonam (SC)', 'Ranipet', 'Arcot', 'Vellore', 'Kilvaithinankuppam (SC)', 'Vaniyambadi', 'Jolarpet', 'Tiruppattur', 'Uthangarai (SC)', 'Bargur', 'Krishnagiri', 'Palacodu', 'Pappireddippatti', 'Kilpennathur', 'Kalasapakkam', 'Polur', 'Cheyyar', 'Vandavasi (SC)', 'Mailam', 'Tindivanam (SC)', 'Vanur (SC)', 'Viluppuram', 'Ulundurpettai', 'Sankarapuram', 'Kallakurichi (SC)', 'Attur (SC)', 'Yercaud (ST)', 'Omalur', 'Edappadi', 'Sankari', 'Salem (West)', 'Salem (South)', 'Veerapandi', 'Rasipuram (SC)', 'Namakkal', 'Paramathi-Velur', 'Kumarapalayam', 'Erode (West)', 'Modakkurichi', 'Dharapuram (SC)', 'Kangayam', 'Perundurai', 'Bhavani', 'Anthiyur', 'Gobichettipalayam', 'Udhagamandalam', 'Mettuppalayam', 'Avanashi (SC)', 'Tiruppur (North)', 'Palladam', 'Kavundampalayam', 'Coimbatore (North)', 'Thondamuthur', 'Coimbatore (South)', 'Singanallur', 'Kinathukadavu', 'Pollachi', 'Udumalaipettai', 'Madathukulam', 'Palani', 'Natham', 'Vedasandur', 'Karur', 'Krishnarayapuram (SC)', 'Kulithalai', 'Manapparai', 'Srirangam', 'Tiruchirappalli (West)', 'Tiruchirappalli (East)', 'Manachanallur', 'Musiri', 'Thuraiyur (SC)', 'Perambalur (SC)', 'Ariyalur', 'Neyveli', 'Cuddalore', 'Kurinjipadi', 'Bhuvanagiri', 'Kattumannarkoil (SC)', 'Sirkazhi (SC)', 'Poompuhar', 'Nagapattinam', 'Vedaranyam', 'Nannilam', 'Papanasam', 'Thiruvaiyaru', 'Thanjavur', 'Orathanadu', 'Gandharvakottai (SC)', 'Viralimalai', 'Thirumayam', 'Alangudi', 'Aranthangi', 'Karaikudi', 'Manamadurai (SC)', 'Melur', 'Madurai East', 'Sholavandan (SC)', 'Madurai North', 'Madurai West', 'Thirumangalam', 'Andipatti', 'Bodinayakanur', 'Rajapalayam', 'Sattur', 'Sivakasi', 'Aruppukkottai', 'Paramakudi (SC)', 'Mudhukulathur', 'Vilathikulam', 'Thoothukkudi', 'Srivaikuntam', 'Kovilpatti', 'Sankarankovil (SC)', 'Vasudevanallur (SC)', 'Kadayanallur', 'Tenkasi', 'Alangulam', 'Tirunelveli', 'Ambasamudram', 'Nanguneri', 'Kanniyakumari', 'Nagercoil'],
        'AIFB' : ['Usilampatti'],
        'CPI' : ['Gudiyattam (SC)', 'Thalli', 'Pennagaram', 'Bhavanisagar', 'Valparai (SC)', 'Thiruthuraipoondi (SC)', 'Pudukkottai', 'Sivaganga', 'Srivilliputhur (SC)'],
        'CPI (M)' : ['Maduravoyal', 'Perambur', 'Harur (SC)', 'Vikravandi', 'Tiruppur (South)', 'Dindigul', 'Chidambaram', 'Kilvelur (SC)', 'Madurai South', 'Periyakulam'],
        'DMDK' : ['Gummidipoondi', 'Tiruttani', 'Egmore (SC)', 'Virugampakkam', 'Alandur', 'Chengalpattu', 'Sholingur', 'Dharmapuri', 'Chengam (SC)', 'Arani', 'Tirukkoyilur', 'Rishivandiyam', 'Gangavalli (SC)', 'Mettur', 'Salem (North)', 'Senthamangalam (ST)', 'Tiruchengodu', 'Erode (East)', 'Sulur', 'Thiruverumbur', 'Tittakudi (SC)', 'Vriddhachalam', 'Panruti', 'Mayiladuthurai', 'Peravurani', 'Madurai Central', 'Thiruparankundram', 'Virudhunagar', 'Radhapuram'],
        'DMK' : ['Kolathur', 'Chepauk-Thiruvallikeni', 'Katpadi', 'Veppanahalli', 'Tiruvannamalai', 'Gudalur (SC)', 'Coonoor', 'Oddanchatram', 'Athoor', 'Aravakurichi', 'Lalgudi', 'Kunnam', 'Mannargudi', 'Thiruvarur', 'Thiruvidaimarudur', 'Kumbakonam', 'Tiruppattur', 'Cumbum', 'Tiruchuli', 'Tiruvadanai', 'Tiruchendur', 'Palayamkottai', 'Padmanabhapuram'],
        'INC' : ['Hosur', 'Pattukkottai', 'Colachel', 'Vilavancode', 'Killiyoor'],
        'MNMK' : ['Ambur', 'Ramanathapuram'],
        'PMK' : ['Anaikattu', 'Vandavasi (SC)', 'Jayankondam'],
        'PT' : ['Nilakkottai (SC)', 'Ottapidaram (SC)']
    },
    assembly2016: {
        'AIADMK' : ['Gummidipoondi', 'Ponneri (SC)', 'Tiruttani', 'Poonamallee (SC)', 'Avadi', 'Maduravoyal', 'Ambattur', 'Dr.Radhakrishnan Nagar', 'Perambur', 'Royapuram', 'Virugampakkam', 'Thiyagarayanagar', 'Mylapore', 'Sriperumbudur (SC)', 'Thiruporur', 'Arakkonam (SC)', 'Sholingur', 'Kilvaithinankuppam (SC)', 'Gudiyattam (SC)', 'Vaniyambadi', 'Ambur', 'Jolarpet', 'Uthangarai (SC)', 'Bargur', 'Hosur', 'Palacodu', 'Pappireddippatti', 'Harur (SC)', 'Kalasapakkam', 'Arani', 'Cheyyar', 'Vanur (SC)', 'Viluppuram', 'Ulundurpettai', 'Kallakurichi (SC)', 'Gangavalli (SC)', 'Attur (SC)', 'Yercaud (ST)', 'Omalur', 'Mettur', 'Edappadi', 'Sankari', 'Salem (West)', 'Salem (South)', 'Veerapandi', 'Rasipuram (SC)', 'Senthamangalam (ST)', 'Namakkal', 'Tiruchengodu', 'Kumarapalayam', 'Erode (East)', 'Erode (West)', 'Modakkurichi', 'Kangayam', 'Perundurai', 'Bhavani', 'Anthiyur', 'Gobichettipalayam', 'Bhavanisagar', 'Coonoor', 'Mettuppalayam', 'Avanashi (SC)', 'Tiruppur (North)', 'Tiruppur (South)', 'Palladam', 'Sulur', 'Kavundampalayam', 'Coimbatore (North)', 'Thondamuthur', 'Coimbatore (South)', 'Kinathukadavu', 'Pollachi', 'Valparai (SC)', 'Udumalaipettai', 'Nilakkottai (SC)', 'Dindigul', 'Vedasandur', 'Aravakurichi', 'Karur', 'Krishnarayapuram (SC)', 'Manapparai', 'Srirangam', 'Tiruchirappalli (East)', 'Manachanallur', 'Musiri', 'Perambalur (SC)', 'Kunnam', 'Ariyalur', 'Jayankondam', 'Vriddhachalam', 'Panruti', 'Cuddalore', 'Chidambaram', 'Kattumannarkoil (SC)', 'Sirkazhi (SC)', 'Mayiladuthurai', 'Poompuhar', 'Nagapattinam', 'Vedaranyam', 'Nannilam', 'Papanasam', 'Thanjavur', 'Pattukkottai', 'Peravurani', 'Gandharvakottai (SC)', 'Viralimalai', 'Aranthangi', 'Sivaganga', 'Manamadurai (SC)', 'Melur', 'Sholavandan (SC)', 'Madurai North', 'Madurai South', 'Madurai West', 'Thiruparankundram', 'Thirumangalam', 'Usilampatti', 'Andipatti', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Srivilliputhur (SC)', 'Sattur', 'Sivakasi', 'Paramakudi (SC)', 'Tiruvadanai', 'Ramanathapuram', 'Vilathikulam', 'Srivaikuntam', 'Ottapidaram (SC)', 'Kovilpatti', 'Sankarankovil (SC)', 'Vasudevanallur (SC)', 'Tenkasi', 'Ambasamudram', 'Radhapuram'],
        'DMK' : ['Thiruvallur', 'Madavaram', 'Tiruvottiyur', 'Kolathur', 'Villivakkam', 'Thiru-Vi-Ka-Nagar (SC)', 'Egmore (SC)', 'Harbour', 'Chepauk-Thiruvallikeni', 'Thousand Lights', 'Anna Nagar', 'Saidapet', 'Velachery', 'Shozhinganallur', 'Alandur', 'Pallavaram', 'Tambaram', 'Chengalpattu', 'Cheyyur (SC)', 'Madurantakam (SC)', 'Uthiramerur', 'Kancheepuram', 'Katpadi', 'Ranipet', 'Arcot', 'Vellore', 'Anaikattu', 'Tiruppattur', 'Krishnagiri', 'Veppanahalli', 'Thalli', 'Pennagaram', 'Dharmapuri', 'Chengam (SC)', 'Tiruvannamalai', 'Kilpennathur', 'Polur', 'Vandavasi (SC)', 'Vandavasi (SC)', 'Mailam', 'Tindivanam (SC)', 'Vikravandi', 'Tirukkoyilur', 'Rishivandiyam', 'Sankarapuram', 'Salem (North)', 'Paramathi-Velur', 'Gudalur (SC)', 'Singanallur', 'Madathukulam', 'Palani', 'Oddanchatram', 'Athoor', 'Natham', 'Kulithalai', 'Tiruchirappalli (West)', 'Thiruverumbur', 'Lalgudi', 'Thuraiyur (SC)', 'Tittakudi (SC)', 'Neyveli', 'Kurinjipadi', 'Bhuvanagiri', 'Kilvelur (SC)', 'Thiruthuraipoondi (SC)', 'Mannargudi', 'Thiruvarur', 'Thiruvidaimarudur', 'Kumbakonam', 'Thiruvaiyaru', 'Orathanadu', 'Pudukkottai', 'Thirumayam', 'Alangudi', 'Tiruppattur', 'Madurai East', 'Madurai Central', 'Rajapalayam', 'Virudhunagar', 'Aruppukkottai', 'Tiruchuli', 'Thoothukkudi', 'Tiruchendur', 'Alangulam', 'Tirunelveli', 'Palayamkottai', 'Kanniyakumari', 'Nagercoil', 'Padmanabhapuram'],
        'INC' : ['Dharapuram (SC)', 'Udhagamandalam', 'Karaikudi', 'Mudhukulathur', 'Nanguneri', 'Colachel', 'Vilavancode', 'Killiyoor'],
        'IUML' : ['Kadayanallur']
    },
    assembly2021: {
        'AIADMK' : ['Madurantakam (SC)', 'Arakkonam (SC)', 'Kilvaithinankuppam (SC)', 'Vaniyambadi', 'Uthangarai (SC)', 'Krishnagiri', 'Veppanahalli', 'Palacodu', 'Pappireddippatti', 'Harur (SC)', 'Polur', 'Arani', 'Tindivanam (SC)', 'Vanur (SC)', 'Kallakurichi (SC)', 'Gangavalli (SC)', 'Attur (SC)', 'Yercaud (ST)', 'Omalur', 'Edappadi', 'Sankari', 'Salem (South)', 'Veerapandi', 'Paramathi-Velur', 'Kumarapalayam', 'Perundurai', 'Bhavani', 'Gobichettipalayam', 'Bhavanisagar', 'Gudalur (SC)', 'Mettuppalayam', 'Avanashi (SC)', 'Tiruppur (North)', 'Palladam', 'Sulur', 'Kavundampalayam', 'Coimbatore (North)', 'Thondamuthur', 'Singanallur', 'Kinathukadavu', 'Pollachi', 'Valparai (SC)', 'Udumalaipettai', 'Madathukulam', 'Nilakkottai (SC)', 'Natham', 'Dindigul', 'Bhuvanagiri', 'Chidambaram', 'Vedaranyam', 'Nannilam', 'Orathanadu', 'Viralimalai', 'Sivaganga', 'Melur', 'Madurai West', 'Thiruparankundram', 'Thirumangalam', 'Usilampatti', 'Bodinayakanur', 'Srivilliputhur (SC)', 'Kovilpatti', 'Kadayanallur', 'Alangulam', 'Ambasamudram', 'Kanniyakumari'],
        'BJP' : ['Modakkurichi', 'Coimbatore (South)', 'Tirunelveli', 'Nagercoil'],
        'CPI' : ['Thalli', 'Thiruthuraipoondi (SC)'],
        'CPI (M)' : ['Kilvelur (SC)', 'Gandharvakottai (SC)'],
        'DMK' : ['Gummidipoondi', 'Tiruttani', 'Thiruvallur', 'Poonamallee (SC)', 'Avadi', 'Maduravoyal', 'Ambattur', 'Madavaram', 'Tiruvottiyur', 'Dr.Radhakrishnan Nagar', 'Perambur', 'Kolathur', 'Villivakkam', 'Thiru-Vi-Ka-Nagar (SC)', 'Egmore (SC)', 'Royapuram', 'Harbour', 'Chepauk-Thiruvallikeni', 'Thousand Lights', 'Anna Nagar', 'Virugampakkam', 'Saidapet', 'Thiyagarayanagar', 'Mylapore', 'Shozhinganallur', 'Alandur', 'Pallavaram', 'Tambaram', 'Chengalpattu', 'Uthiramerur', 'Kancheepuram', 'Katpadi', 'Ranipet', 'Arcot', 'Vellore', 'Anaikattu', 'Gudiyattam (SC)', 'Ambur', 'Jolarpet', 'Tiruppattur', 'Bargur', 'Hosur', 'Chengam (SC)', 'Tiruvannamalai', 'Kilpennathur', 'Kalasapakkam', 'Cheyyar', 'Vandavasi (SC)', 'Vandavasi (SC)', 'Viluppuram', 'Vikravandi', 'Tirukkoyilur', 'Ulundurpettai', 'Rishivandiyam', 'Sankarapuram', 'Salem (North)', 'Rasipuram (SC)', 'Senthamangalam (ST)', 'Namakkal', 'Tiruchengodu', 'Erode (West)', 'Dharapuram (SC)', 'Kangayam', 'Anthiyur', 'Coonoor', 'Tiruppur (South)', 'Palani', 'Oddanchatram', 'Athoor', 'Vedasandur', 'Aravakurichi', 'Karur', 'Krishnarayapuram (SC)', 'Kulithalai', 'Manapparai', 'Srirangam', 'Tiruchirappalli (West)', 'Tiruchirappalli (East)', 'Thiruverumbur', 'Lalgudi', 'Manachanallur', 'Musiri', 'Thuraiyur (SC)', 'Perambalur (SC)', 'Kunnam', 'Ariyalur', 'Jayankondam', 'Tittakudi (SC)', 'Neyveli', 'Panruti', 'Cuddalore', 'Kurinjipadi', 'Sirkazhi (SC)', 'Poompuhar', 'Mannargudi', 'Thiruvarur', 'Thiruvidaimarudur', 'Kumbakonam', 'Papanasam', 'Thiruvaiyaru', 'Thanjavur', 'Pattukkottai', 'Peravurani', 'Pudukkottai', 'Thirumayam', 'Alangudi', 'Tiruppattur', 'Manamadurai (SC)', 'Madurai East', 'Sholavandan (SC)', 'Madurai North', 'Madurai South', 'Madurai Central', 'Andipatti', 'Periyakulam', 'Cumbum', 'Rajapalayam', 'Sattur', 'Virudhunagar', 'Aruppukkottai', 'Tiruchuli', 'Paramakudi (SC)', 'Ramanathapuram', 'Mudhukulathur', 'Vilathikulam', 'Thoothukkudi', 'Tiruchendur', 'Ottapidaram (SC)', 'Sankarankovil (SC)', 'Vasudevanallur (SC)', 'Palayamkottai', 'Radhapuram', 'Padmanabhapuram'],
        'INC' : ['Ponneri (SC)', 'Velachery', 'Sriperumbudur (SC)', 'Sholingur', 'Erode (East)', 'Udhagamandalam', 'Vriddhachalam', 'Mayiladuthurai', 'Aranthangi', 'Karaikudi', 'Sivakasi', 'Tiruvadanai', 'Srivaikuntam', 'Tenkasi', 'Nanguneri', 'Colachel', 'Vilavancode', 'Killiyoor'],
        'PMK' : ['Pennagaram', 'Dharmapuri', 'Mailam', 'Mettur', 'Salem (West)'],
        'VCK' : ['Thiruporur', 'Cheyyur (SC)', 'Kattumannarkoil (SC)', 'Nagapattinam']
    },
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
        'DMK': '#ff2e17',
        'AIADMK': '#27ae60',
        'INC': '#3498db',
        'VCK': '#2e3adc',
        'BJP': '#ff7b00',
        'CPI': '#d53f37',
        'CPI(M)': '#72251c',
        'MDMK': '#ed8b80',
        'IUML': '#186839',
        'PMK': '#f4d03f',
        'DMDK': '#f39c12',
        'Others': '#95a5a6'
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
                let vote = electionData[currentElection]?.vote[electionData[currentElection].labels.indexOf(party)] || 'N/A';
                if (winners[currentElection] && currentElection.startsWith('lokSabha')) {
                    for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            vote = electionData[currentElection]?.vote[electionData[currentElection].labels.indexOf(p)] || 'N/A';
                            break;
                        }
                    }
                }
                layer.bindTooltip(`${constituency} - ${party} (${vote}%)`, {
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
        }).addTo(map);

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
                        let vote = electionData[currentElection]?.vote[electionData[currentElection].labels.indexOf(party)] || 'N/A';
                        if (winners[currentElection] && currentElection.startsWith('assembly')) {
                            for (const [p, constituencies] of Object.entries(winners[currentElection])) {
                                if (constituencies.includes(constituency)) {
                                    party = p;
                                    vote = electionData[currentElection]?.vote[electionData[currentElection].labels.indexOf(p)] || 'N/A';
                                    break;
                                }
                            }
                        }
                        layer.bindTooltip(`${constituency} - ${party} (${vote}%)`, {
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
                let vote = electionData[election]?.vote[electionData[election].labels.indexOf(party)] || 'N/A';
                if (winners[election]) {
                    for (const [p, constituencies] of Object.entries(winners[election])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            vote = electionData[election]?.vote[electionData[election].labels.indexOf(p)] || 'N/A';
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
                layer.bindTooltip(`${constituency} - ${party} (${vote}%)`, {
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
                let vote = electionData[election]?.vote[electionData[election].labels.indexOf(party)] || 'N/A';
                if (winners[election]) {
                    for (const [p, constituencies] of Object.entries(winners[election])) {
                        if (constituencies.includes(constituency)) {
                            party = p;
                            vote = electionData[election]?.vote[electionData[election].labels.indexOf(p)] || 'N/A';
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
                layer.bindTooltip(`${constituency} - ${party} (${vote}%)`, {
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