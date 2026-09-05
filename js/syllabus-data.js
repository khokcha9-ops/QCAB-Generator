// ============================================================
// UPSC SYLLABUS DATA (Modular)
// ============================================================

const PRELIMS_TEXT = `
    <div class="detail-card-content prelims-card">
        <strong>Paper I (200 marks)</strong><br>
        <ul>
            <li>Current events of national and international importance.</li>
            <li>History of India and Indian National Movement.</li>
            <li>Indian and World Geography.</li>
            <li>Indian Polity and Governance.</li>
            <li>Economic and Social Development.</li>
            <li>Environment, Ecology, Climate Change.</li>
            <li>General Science.</li>
        </ul><br>
        <strong>Paper II (200 marks) - CSAT</strong>
        <ul>
            <li>Comprehension</li>
            <li>Interpersonal skills & communication</li>
            <li>Logical reasoning & analytical ability</li>
            <li>Decision-making & problem-solving</li>
            <li>General mental ability & Basic numeracy</li>
        </ul>
    </div>`;

const ESSAY_TEXT = `
    <div class="detail-card-content essay-card">
        <ul>
            <li>Candidates will be required to write an essay on a specific topic. The choice of subjects will be given. They will be expected to keep closely to the subject of the essay to arrange their ideas in orderly fashion, and to write concisely. Credit will be given for effective and exact expression.</li>
        </ul>
    </div>`;

const GS1_TEXT = `<div class="detail-card-content gs1-card"><ul><li>Indian culture, Art forms, Literature & Architecture</li><li>Modern Indian History & Freedom Struggle</li><li>Post-independence consolidation</li><li>World History</li><li>Indian Society, Role of women, Globalization</li><li>Physical Geography, Resources, Geophysical phenomena</li></ul></div>`;
const GS2_TEXT = `<div class="detail-card-content gs2-card"><ul><li>Indian Constitution, Federal structure, Separation of powers</li><li>Parliament, Executive, Judiciary</li><li>Statutory bodies, Government policies, Welfare schemes</li><li>Social Sector services (Health, Education)</li><li>E-governance, Transparency, Role of civil services</li><li>India and its neighborhood, International institutions</li></ul></div>`;
const GS3_TEXT = `<div class="detail-card-content gs3-card"><ul><li>Indian Economy, Growth, Budgeting, Agriculture, Food Security</li><li>Land reforms, Liberalization, Infrastructure</li><li>Science & Tech, IT, Space, IPR</li><li>Conservation, Pollution, Disaster management</li><li>Internal security, Cyber security, Money laundering</li></ul></div>`;
const GS4_TEXT = `<div class="detail-card-content gs4-card"><ul><li>Ethics and Human Interface, Human Values, Attitude</li><li>Aptitude, Emotional Intelligence, Moral thinkers</li><li>Public service values, Probity in Governance</li><li>Case Studies on above issues</li></ul></div>`;
const ANTHRO1_TEXT = `<div class="detail-card-content anthro1-card"><ul><li>1.1-1.8: Meaning, Human Evolution, Primates, Prehistoric Archaeology</li><li>2.1-2.5: Culture, Society, Marriage, Family, Kinship</li><li>3-5: Economic, Political, Religion</li><li>6: Anthropological theories</li><li>7-8: Language, Research methods</li><li>9.1-9.8: Human Genetics, Race, Ecology</li><li>10-12: Human growth, Applications</li></ul></div>`;
const ANTHRO2_TEXT = `<div class="detail-card-content anthro2-card"><ul><li>1.1-1.3: Prehistoric cultures, Indus Civilization</li><li>2: Demographic profile</li><li>3.1-3.4: Traditional social system, Caste</li><li>5.1-5.3: Indian Village, Social change</li><li>6.1-6.3: Tribal situation, Problems</li><li>7.1-7.3: Exploitation, Constitutional safeguards</li><li>9.1-9.3: Administration, NGO, Development</li></ul></div>`;

// Master Object
const SYLLABUS_DATA = {
    'prelims': { title: 'Prelims', icon: '🏛️', color: '#64748b', html: PRELIMS_TEXT },
    'essay': { title: 'Essay', icon: '✍️', color: '#0f766e', html: ESSAY_TEXT },
    'gs1': { title: 'GS Paper 1', icon: '🕌', color: '#2563eb', html: GS1_TEXT },
    'gs2': { title: 'GS Paper 2', icon: '⚖️', color: '#059669', html: GS2_TEXT },
    'gs3': { title: 'GS Paper 3', icon: '🌾', color: '#d97706', html: GS3_TEXT },
    'gs4': { title: 'GS Paper 4', icon: '🧭', color: '#7c3aed', html: GS4_TEXT },
    'anthro1': { title: 'Anthro Paper 1', icon: '🧬', color: '#db2777', html: ANTHRO1_TEXT },
    'anthro2': { title: 'Anthro Paper 2', icon: '🪨', color: '#ea580c', html: ANTHRO2_TEXT }
};
