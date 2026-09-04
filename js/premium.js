// Initialize Lucide Icons
lucide.createIcons();

// 1. SYLLABUS-WISE MAPPING & FREQUENCY ANALYSIS
window.analyzeTopic = function(topic) {
    const allQ = window.presetBank.filter(q => q.topic === topic);
    const freq = allQ.length;
    const years = allQ.map(q => q.year).filter(Boolean);
    
    // Update UI
    document.getElementById('frequency-chart').innerHTML = `<strong>${freq}</strong> Questions asked`;
    document.getElementById('trend-chart').innerHTML = `<strong>${years.slice(0,5).join(', ')}...</strong>`;
    
    // Fetch AI Suggestions from Cloudflare or Local JSON
    fetchSuggestions(topic);
};

// 2. PREMIUM SEMANTIC SEARCH (Fuzzy Matching)
window.semanticSearch = function(query) {
    const input = query.toLowerCase();
    // Map hidden meanings (e.g., "Governor" matches "Federalism")
    const synonyms = {
        'governor': ['federalism', 'state', 'executive'],
        'federalism': ['governor', 'centre-state', 'union'],
        'money': ['finance', 'budget', 'economic']
    };
    
    const expanded = [input];
    for (let key in synonyms) { if (input.includes(key)) expanded.push(...synonyms[key]); }
    
    const results = window.presetBank.filter(q => {
        const text = `${q.question} ${q.topic} ${q.paper}`.toLowerCase();
        return expanded.some(term => text.includes(term));
    });
    
    return results;
};

// 3. ADVANCED SUGGESTIONS (Articles, Committees, Thinkers)
function fetchSuggestions(topic) {
    // In a real app, fetch this from the `syllabus_bank` database.
    // For now, here's a static local map for testing:
    const map = {
        'Federalism': { articles: '245, 246, 356', committees: 'Sarkaria, Punchhi', thinkers: 'K.C. Wheare', cases: 'S.R. Bommai' },
        'Governor': { articles: '153, 161, 163', committees: 'Rajamannar', thinkers: 'Ambedkar', cases: 'Nabam Rebia' }
    };
    
    const data = map[topic] || { articles: 'General', committees: 'N/A', thinkers: 'N/A', cases: 'N/A' };
    
    document.getElementById('sugg-articles').innerHTML = data.articles;
    document.getElementById('sugg-committees').innerHTML = data.committees;
    document.getElementById('sugg-thinkers').innerHTML = data.thinkers;
    document.getElementById('sugg-cases').innerHTML = data.cases;
    
    document.getElementById('suggestions-panel').style.display = 'block';
}

// 4. SIMILAR PYQs & RECENTLY VIEWED
window.showSimilar = function(questionId) {
    const orig = window.presetBank.find(q => q.id === questionId);
    if (!orig) return;
    
    const similar = window.presetBank.filter(q => q.topic === orig.topic && q.id !== orig.id).slice(0, 3);
    // -- Insert this into your results container -- //
    console.log('Similar Questions:', similar);
    
    // Save to Recently Viewed
    let recent = JSON.parse(localStorage.getItem('recent_qs') || '[]');
    recent = [orig, ...recent.filter(q => q.id !== orig.id)].slice(0, 10);
    localStorage.setItem('recent_qs', JSON.stringify(recent));
};

// 5. BIND TO THE UI
// Bind to the Search Input
document.getElementById('search-input').addEventListener('input', (e) => {
    if (e.target.value.length > 3) {
        const results = window.semanticSearch(e.target.value);
        // Custom logic here to render results
    }
});
