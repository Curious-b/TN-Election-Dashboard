// Election data from ECI (statewide aggregates)
const electionData = {
    assembly2011: { labels: ['AIADMK', 'DMK', 'DMDK', 'CPI', 'CPI (M)', 'INC', 'PMK', 'AIFB', 'MNMK', 'PT'], seats: [150, 23, 29, 9, 10, 5, 3, 1, 2, 2], vote: [38.40, 22.39, 7.87, 2.01, 2.40, 9.30, 5.2, 0.20, 0.50, 0.40], title: '2011 Assembly Election Results' },
    assembly2016: { labels: ['AIADMK', 'DMK', 'INC', 'IUML'], seats: [136, 89, 8, 1], vote: [40.88, 31.39, 6.47, 0.73], title: '2016 Assembly Election Results' },
    assembly2021: { labels: ['DMK', 'AIADMK', 'INC', 'PMK', 'BJP', 'VCK', 'CPI', 'CPI (M)'], seats: [133, 66, 18, 5, 4, 4, 2, 2], vote: [37.70, 33.29, 4.28, 3.81, 2.62, 0.99, 1.09, 0.85], title: '2021 Assembly Election Results' },
    lokSabha2014: { labels: ['AIADMK', 'BJP', 'PMK'], seats: [37, 1, 1], vote: [44.92, 5.56, 4.51], title: '2014 Lok Sabha Election Results' },
    lokSabha2019: { labels: ['DMK', 'INC', 'CPI', 'CPI (M)', 'AIADMK', 'VCK', 'IUML'], seats: [24, 8, 2, 2, 1, 1, 1], vote: [33.52, 12.72, 2.41, 2.38, 19.39, 1.17, 1.09], title: '2019 Lok Sabha Election Results' },
    lokSabha2024: { labels: ['DMK', 'INC', 'VCK', 'CPI', 'CPI (M)', 'IUML', 'MDMK'], seats: [22, 9, 2, 2, 2, 1, 1], vote: [26.92, 10.67, 2.25, 2.15, 2.52, 1.17, 1.28], title: '2024 Lok Sabha Election Results' }
};

// Constituency-wise vote shares (sample - expand with real ECI data)
const constituencyVoteShares = {
    assembly2011: {
        'Gummidipoondi': { 'DMDK': 45.23, 'AIADMK': 35.10, 'DMK': 15.67 },
        'Ponneri (SC)': { 'AIADMK': 48.90, 'DMK': 40.12 },
        'Kolathur': { 'DMK': 52.34, 'AIADMK': 42.10 },
        // Add all 234 ACs...
    },
    assembly2016: {
        'Gummidipoondi': { 'AIADMK': 49.87, 'DMK': 45.23 },
        'Ponneri (SC)': { 'AIADMK': 47.65, 'DMK': 43.12 },
        'Kolathur': { 'DMK': 55.78, 'AIADMK': 39.45 },
        // Add all 234 ACs...
    },
    assembly2021: {
        'Gummidipoondi': { 'DMK': 51.34, 'AIADMK': 40.12 }, // Adjusted - was DMDK, should be DMK per ECI
        'Ponneri (SC)': { 'INC': 46.78, 'AIADMK': 41.23 },
        'Kolathur': { 'DMK': 60.12, 'AIADMK': 35.67 },
        // Add all 234 ACs...
    },
    lokSabha2014: {
        'Tiruvallur (SC)': { 'AIADMK': 50.23, 'DMK': 38.45 },
        'Chennai North': { 'AIADMK': 48.67, 'DMK': 39.12 },
        'Kanniyakumari': { 'BJP': 45.89, 'AIADMK': 40.34 },
        // Add all 39 PCs...
    },
    lokSabha2019: {
        'Tiruvallur (SC)': { 'INC': 52.34, 'AIADMK': 37.89 },
        'Chennai North': { 'DMK': 55.67, 'AIADMK': 33.12 },
        'Kanniyakumari': { 'INC': 58.23, 'BJP': 35.67 },
        // Add all 39 PCs...
    },
    lokSabha2024: {
        'Tiruvallur (SC)': { 'INC': 49.12, 'DMK': 39.45 },
        'Chennai North': { 'DMK': 53.78, 'AIADMK': 34.23 },
        'Kanniyakumari': { 'INC': 56.89, 'BJP': 37.12 },
        // Add all 39 PCs...
    }
};

// Party winners from ECI (full Assembly, aggregated Lok Sabha)
const winners = {
    assembly2011: {
        'AIADMK': ['Ponneri (SC)', 'Thiruvallur', 'Poonamallee (SC)', 'Avadi', 'Ambattur', 'Madavaram', 'Tiruvottiyur', 'Dr.Radhakrishnan Nagar', 'Villivakkam', 'Thiru-Vi-Ka-Nagar (SC)', 'Royapuram', 'Harbour', 'Thousand Lights', 'Anna Nagar', 'Saidapet', 'Thiyagarayanagar', 'Mylapore', 'Velachery', 'Shozhinganallur', 'Sriperumbudur (SC)', 'Pallavaram', 'Tambaram', 'Thiruporur', 'Cheyyur (SC)', 'Madurantakam (SC)', 'Uthiramerur', 'Kancheepuram', 'Arakkonam (SC)', 'Ranipet', 'Arcot', 'Vellore', 'Kilvaithinankuppam (SC)', 'Vaniyambadi', 'Jolarpet', 'Tiruppattur', 'Uthangarai (SC)', 'Bargur', 'Krishnagiri', 'Palacodu', 'Pappireddippatti', 'Kilpennathur', 'Kalasapakkam', 'Polur', 'Cheyyar', 'Vandavasi (SC)', 'Mailam', 'Tindivanam (SC)', 'Vanur (SC)', 'Viluppuram', 'Ulundurpettai', 'Sankarapuram', 'Kallakurichi (SC)', 'Attur (SC)', 'Yercaud (ST)', 'Omalur', 'Edappadi', 'Sankari', 'Salem (West)', 'Salem (South)', 'Veerapandi', 'Rasipuram (SC)', 'Namakkal', 'Paramathi-Velur', 'Kumarapalayam', 'Erode (West)', 'Modakkurichi', 'Dharapuram (SC)', 'Kangayam', 'Perundurai', 'Bhavani', 'Anthiyur', 'Gobichettipalayam', 'Udhagamandalam', 'Mettuppalayam', 'Avanashi (SC)', 'Tiruppur (North)', 'Palladam', 'Kavundampalayam', 'Coimbatore (North)', 'Thondamuthur', 'Coimbatore (South)', 'Singanallur', 'Kinathukadavu', 'Pollachi', 'Udumalaipettai', 'Madathukulam', 'Palani', 'Natham', 'Vedasandur', 'Karur', 'Krishnarayapuram (SC)', 'Kulithalai', 'Manapparai', 'Srirangam', 'Tiruchirappalli (West)', 'Tiruchirappalli (East)', 'Manachanallur', 'Musiri', 'Thuraiyur (SC)', 'Perambalur (SC)', 'Ariyalur', 'Neyveli', 'Cuddalore', 'Kurinjipadi', 'Bhuvanagiri', 'Kattumannarkoil (SC)', 'Sirkazhi (SC)', 'Poompuhar', 'Nagapattinam', 'Vedaranyam', 'Nannilam', 'Papanasam', 'Thiruvaiyaru', 'Thanjavur', 'Orathanadu', 'Gandharvakottai (SC)', 'Viralimalai', 'Thirumayam', 'Alangudi', 'Aranthangi', 'Karaikudi', 'Manamadurai (SC)', 'Melur', 'Madurai East', 'Sholavandan (SC)', 'Madurai North', 'Madurai West', 'Thirumangalam', 'Andipatti', 'Bodinayakanur', 'Rajapalayam', 'Sattur', 'Sivakasi', 'Aruppukkottai', 'Paramakudi (SC)', 'Mudhukulathur', 'Vilathikulam', 'Thoothukkudi', 'Srivaikuntam', 'Kovilpatti', 'Sankarankovil (SC)', 'Vasudevanallur (SC)', 'Kadayanallur', 'Tenkasi', 'Alangulam', 'Tirunelveli', 'Ambasamudram', 'Nanguneri', 'Kanniyakumari', 'Nagercoil'],
        'AIFB': ['Usilampatti'],
        'CPI': ['Gudiyattam (SC)', 'Thalli', 'Pennagaram', 'Bhavanisagar', 'Valparai (SC)', 'Thiruthuraipoondi (SC)', 'Pudukkottai', 'Sivaganga', 'Srivilliputhur (SC)'],
        'CPI (M)': ['Maduravoyal', 'Perambur', 'Harur (SC)', 'Vikravandi', 'Tiruppur (South)', 'Dindigul', 'Chidambaram', 'Kilvelur (SC)', 'Madurai South', 'Periyakulam'],
        'DMDK': ['Gummidipoondi', 'Tiruttani', 'Egmore (SC)', 'Virugampakkam', 'Alandur', 'Chengalpattu', 'Sholingur', 'Dharmapuri', 'Chengam (SC)', 'Arani', 'Tirukkoyilur', 'Rishivandiyam', 'Gangavalli (SC)', 'Mettur', 'Salem (North)', 'Senthamangalam (ST)', 'Tiruchengodu', 'Erode (East)', 'Sulur', 'Thiruverumbur', 'Tittakudi (SC)', 'Vriddhachalam', 'Panruti', 'Mayiladuthurai', 'Peravurani', 'Madurai Central', 'Thiruparankundram', 'Virudhunagar', 'Radhapuram'],
        'DMK': ['Kolathur', 'Chepauk-Thiruvallikeni', 'Katpadi', 'Veppanahalli', 'Tiruvannamalai', 'Gudalur (SC)', 'Coonoor', 'Oddanchatram', 'Athoor', 'Aravakurichi', 'Lalgudi', 'Kunnam', 'Mannargudi', 'Thiruvarur', 'Thiruvidaimarudur', 'Kumbakonam', 'Tiruppattur', 'Cumbum', 'Tiruchuli', 'Tiruvadanai', 'Tiruchendur', 'Palayamkottai', 'Padmanabhapuram'],
        'INC': ['Hosur', 'Pattukkottai', 'Colachel', 'Vilavancode', 'Killiyoor'],
        'MNMK': ['Ambur', 'Ramanathapuram'],
        'PMK': ['Anaikattu', 'Vandavasi (SC)', 'Jayankondam'],
        'PT': ['Nilakkottai (SC)', 'Ottapidaram (SC)']
    },
    assembly2016: {
        'AIADMK': ['Gummidipoondi', 'Ponneri (SC)', 'Tiruttani', 'Poonamallee (SC)', 'Avadi', 'Maduravoyal', 'Ambattur', 'Dr.Radhakrishnan Nagar', 'Perambur', 'Royapuram', 'Virugampakkam', 'Thiyagarayanagar', 'Mylapore', 'Sriperumbudur (SC)', 'Thiruporur', 'Arakkonam (SC)', 'Sholingur', 'Kilvaithinankuppam (SC)', 'Gudiyattam (SC)', 'Vaniyambadi', 'Ambur', 'Jolarpet', 'Uthangarai (SC)', 'Bargur', 'Hosur', 'Palacodu', 'Pappireddippatti', 'Harur (SC)', 'Kalasapakkam', 'Arani', 'Cheyyar', 'Vanur (SC)', 'Viluppuram', 'Ulundurpettai', 'Kallakurichi (SC)', 'Gangavalli (SC)', 'Attur (SC)', 'Yercaud (ST)', 'Omalur', 'Mettur', 'Edappadi', 'Sankari', 'Salem (West)', 'Salem (South)', 'Veerapandi', 'Rasipuram (SC)', 'Senthamangalam (ST)', 'Namakkal', 'Tiruchengodu', 'Kumarapalayam', 'Erode (East)', 'Erode (West)', 'Modakkurichi', 'Kangayam', 'Perundurai', 'Bhavani', 'Anthiyur', 'Gobichettipalayam', 'Bhavanisagar', 'Coonoor', 'Mettuppalayam', 'Avanashi (SC)', 'Tiruppur (North)', 'Tiruppur (South)', 'Palladam', 'Sulur', 'Kavundampalayam', 'Coimbatore (North)', 'Thondamuthur', 'Coimbatore (South)', 'Kinathukadavu', 'Pollachi', 'Valparai (SC)', 'Udumalaipettai', 'Nilakkottai (SC)', 'Dindigul', 'Vedasandur', 'Aravakurichi', 'Karur', 'Krishnarayapuram (SC)', 'Manapparai', 'Srirangam', 'Tiruchirappalli (East)', 'Manachanallur', 'Musiri', 'Perambalur (SC)', 'Kunnam', 'Ariyalur', 'Jayankondam', 'Vriddhachalam', 'Panruti', 'Cuddalore', 'Chidambaram', 'Kattumannarkoil (SC)', 'Sirkazhi (SC)', 'Mayiladuthurai', 'Poompuhar', 'Nagapattinam', 'Vedaranyam', 'Nannilam', 'Papanasam', 'Thanjavur', 'Pattukkottai', 'Peravurani', 'Gandharvakottai (SC)', 'Viralimalai', 'Aranthangi', 'Sivaganga', 'Manamadurai (SC)', 'Melur', 'Sholavandan (SC)', 'Madurai North', 'Madurai South', 'Madurai West', 'Thiruparankundram', 'Thirumangalam', 'Usilampatti', 'Andipatti', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Srivilliputhur (SC)', 'Sattur', 'Sivakasi', 'Paramakudi (SC)', 'Tiruvadanai', 'Ramanathapuram', 'Vilathikulam', 'Srivaikuntam', 'Ottapidaram (SC)', 'Kovilpatti', 'Sankarankovil (SC)', 'Vasudevanallur (SC)', 'Tenkasi', 'Ambasamudram', 'Radhapuram'],
        'DMK': ['Thiruvallur', 'Madavaram', 'Tiruvottiyur', 'Kolathur', 'Villivakkam', 'Thiru-Vi-Ka-Nagar (SC)', 'Egmore (SC)', 'Harbour', 'Chepauk-Thiruvallikeni', 'Thousand Lights', 'Anna Nagar', 'Saidapet', 'Velachery', 'Alandur', 'Pallavaram', 'Tambaram', 'Chengalpattu', 'Cheyyur (SC)', 'Madurantakam (SC)', 'Uthiramerur', 'Kancheepuram', 'Katpadi', 'Ranipet', 'Arcot', 'Vellore', 'Anaikattu', 'Tiruppattur', 'Krishnagiri', 'Veppanahalli', 'Thalli', 'Pennagaram', 'Dharmapuri', 'Chengam (SC)', 'Tiruvannamalai', 'Kilpennathur', 'Polur', 'Vandavasi (SC)', 'Mailam', 'Tindivanam (SC)', 'Vikravandi', 'Tirukkoyilur', 'Rishivandiyam', 'Sankarapuram', 'Salem (North)', 'Paramathi-Velur', 'Gudalur (SC)', 'Singanallur', 'Madathukulam', 'Palani', 'Oddanchatram', 'Athoor', 'Natham', 'Kulithalai', 'Tiruchirappalli (West)', 'Thiruverumbur', 'Lalgudi', 'Thuraiyur (SC)', 'Tittakudi (SC)', 'Neyveli', 'Kurinjipadi', 'Bhuvanagiri', 'Kilvelur (SC)', 'Thiruthuraipoondi (SC)', 'Mannargudi', 'Thiruvarur', 'Thiruvidaimarudur', 'Kumbakonam', 'Thiruvaiyaru', 'Orathanadu', 'Pudukkottai', 'Thirumayam', 'Alangudi', 'Tiruppattur', 'Madurai East', 'Madurai Central', 'Rajapalayam', 'Virudhunagar', 'Aruppukkottai', 'Tiruchuli', 'Thoothukkudi', 'Tiruchendur', 'Alangulam', 'Tirunelveli', 'Palayamkottai', 'Kanniyakumari', 'Nagercoil', 'Padmanabhapuram'],
        'INC': ['Dharapuram (SC)', 'Udhagamandalam', 'Karaikudi', 'Mudhukulathur', 'Nanguneri', 'Colachel', 'Vilavancode', 'Killiyoor'],
        'IUML': ['Kadayanallur']
    },
    assembly2021: {
        'AIADMK': ['Madurantakam (SC)', 'Arakkonam (SC)', 'Kilvaithinankuppam (SC)', 'Vaniyambadi', 'Uthangarai (SC)', 'Krishnagiri', 'Veppanahalli', 'Palacodu', 'Pappireddippatti', 'Harur (SC)', 'Polur', 'Arani', 'Tindivanam (SC)', 'Vanur (SC)', 'Kallakurichi (SC)', 'Gangavalli (SC)', 'Attur (SC)', 'Yercaud (ST)', 'Omalur', 'Edappadi', 'Sankari', 'Salem (South)', 'Veerapandi', 'Paramathi-Velur', 'Kumarapalayam', 'Perundurai', 'Bhavani', 'Gobichettipalayam', 'Bhavanisagar', 'Gudalur (SC)', 'Mettuppalayam', 'Avanashi (SC)', 'Tiruppur (North)', 'Palladam', 'Sulur', 'Kavundampalayam', 'Coimbatore (North)', 'Thondamuthur', 'Singanallur', 'Kinathukadavu', 'Pollachi', 'Valparai (SC)', 'Udumalaipettai', 'Madathukulam', 'Nilakkottai (SC)', 'Natham', 'Dindigul', 'Bhuvanagiri', 'Chidambaram', 'Vedaranyam', 'Nannilam', 'Orathanadu', 'Viralimalai', 'Sivaganga', 'Melur', 'Madurai West', 'Thiruparankundram', 'Thirumangalam', 'Usilampatti', 'Bodinayakanur', 'Srivilliputhur (SC)', 'Kovilpatti', 'Kadayanallur', 'Alangulam', 'Ambasamudram', 'Kanniyakumari'],
        'BJP': ['Modakkurichi', 'Coimbatore (South)', 'Tirunelveli', 'Nagercoil'],
        'CPI': ['Thalli', 'Thiruthuraipoondi (SC)'],
        'CPI (M)': ['Kilvelur (SC)', 'Gandharvakottai (SC)'],
        'DMK': ['Gummidipoondi', 'Tiruttani', 'Thiruvallur', 'Poonamallee (SC)', 'Avadi', 'Maduravoyal', 'Ambattur', 'Madavaram', 'Tiruvottiyur', 'Dr.Radhakrishnan Nagar', 'Perambur', 'Kolathur', 'Villivakkam', 'Thiru-Vi-Ka-Nagar (SC)', 'Egmore (SC)', 'Royapuram', 'Harbour', 'Chepauk-Thiruvallikeni', 'Thousand Lights', 'Anna Nagar', 'Virugampakkam', 'Saidapet', 'Thiyagarayanagar', 'Mylapore', 'Shozhinganallur', 'Alandur', 'Pallavaram', 'Tambaram', 'Chengalpattu', 'Uthiramerur', 'Kancheepuram', 'Katpadi', 'Ranipet', 'Arcot', 'Vellore', 'Anaikattu', 'Gudiyattam (SC)', 'Ambur', 'Jolarpet', 'Tiruppattur', 'Bargur', 'Hosur', 'Chengam (SC)', 'Tiruvannamalai', 'Kilpennathur', 'Kalasapakkam', 'Cheyyar', 'Vandavasi (SC)', 'Viluppuram', 'Vikravandi', 'Tirukkoyilur', 'Ulundurpettai', 'Rishivandiyam', 'Sankarapuram', 'Salem (North)', 'Rasipuram (SC)', 'Senthamangalam (ST)', 'Namakkal', 'Tiruchengodu', 'Erode (West)', 'Dharapuram (SC)', 'Kangayam', 'Anthiyur', 'Coonoor', 'Tiruppur (South)', 'Palani', 'Oddanchatram', 'Athoor', 'Vedasandur', 'Aravakurichi', 'Karur', 'Krishnarayapuram (SC)', 'Kulithalai', 'Manapparai', 'Srirangam', 'Tiruchirappalli (West)', 'Tiruchirappalli (East)', 'Thiruverumbur', 'Lalgudi', 'Manachanallur', 'Musiri', 'Thuraiyur (SC)', 'Perambalur (SC)', 'Kunnam', 'Ariyalur', 'Jayankondam', 'Tittakudi (SC)', 'Neyveli', 'Panruti', 'Cuddalore', 'Kurinjipadi', 'Sirkazhi (SC)', 'Poompuhar', 'Mannargudi', 'Thiruvarur', 'Thiruvidaimarudur', 'Kumbakonam', 'Papanasam', 'Thiruvaiyaru', 'Thanjavur', 'Pattukkottai', 'Peravurani', 'Pudukkottai', 'Thirumayam', 'Alangudi', 'Tiruppattur', 'Manamadurai (SC)', 'Madurai East', 'Sholavandan (SC)', 'Madurai North', 'Madurai South', 'Madurai Central', 'Andipatti', 'Periyakulam', 'Cumbum', 'Rajapalayam', 'Sattur', 'Virudhunagar', 'Aruppukkottai', 'Tiruchuli', 'Paramakudi (SC)', 'Ramanathapuram', 'Mudhukulathur', 'Vilathikulam', 'Thoothukkudi', 'Tiruchendur', 'Ottapidaram (SC)', 'Sankarankovil (SC)', 'Vasudevanallur (SC)', 'Palayamkottai', 'Radhapuram', 'Padmanabhapuram'],
        'INC': ['Ponneri (SC)', 'Velachery', 'Sriperumbudur (SC)', 'Sholingur', 'Erode (East)', 'Udhagamandalam', 'Vriddhachalam', 'Mayiladuthurai', 'Aranthangi', 'Karaikudi', 'Sivakasi', 'Tiruvadanai', 'Srivaikuntam', 'Tenkasi', 'Nanguneri', 'Colachel', 'Vilavancode', 'Killiyoor'],
        'PMK': ['Pennagaram', 'Dharmapuri', 'Mailam', 'Mettur', 'Salem (West)'],
        'VCK': ['Thiruporur', 'Cheyyur (SC)', 'Kattumannarkoil (SC)', 'Nagapattinam']
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
        'CPI (M)': ['Coimbatore', 'Madurai'],
        'VCK': ['Chidambaram (SC)'],
        'IUML': ['Ramanathapuram'],
        'AIADMK': ['Theni']
    },
    lokSabha2024: {
        'DMK': ['Chennai North', 'Chennai South', 'Chennai Central', 'Sriperumbudur', 'Kancheepuram (SC)', 'Arakkonam', 'Vellore', 'Dharmapuri', 'Tiruvannamalai', 'Arani', 'Kallakurichi', 'Salem', 'Namakkal', 'Erode', 'Nilgiris (SC)', 'Coimbatore', 'Pollachi', 'Perambalur', 'Thanjavur', 'Theni', 'Thoothukkudi', 'Tenkasi (SC)'],
        'INC': ['Tiruvallur (SC)', 'Krishnagiri', 'Karur', 'Cuddalore', 'Mayiladuthurai', 'Sivaganga', 'Virudhunagar', 'Tirunelveli', 'Kanniyakumari'],
        'CPI': ['Tiruppur', 'Nagapattinam (SC)'],
        'CPI (M)': ['Dindigul', 'Madurai'],
        'VCK': ['Viluppuram (SC)', 'Chidambaram (SC)'],
        'MDMK': ['Tiruchirappalli'],
        'IUML': ['Ramanathapuram']
    }
};