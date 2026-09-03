// ============================================================
// js/config.js – Constants & Configuration
// ============================================================

const SYLLABUS = {
  GS1: ['Art & Culture','Modern History','Post Independence','World History','Physical Geography','Economic & Human Geography','Indian society'],
  GS2: ['Polity','Governance','Social Justice','International Relations'],
  GS3: ['Economy','Agriculture','Internal Security','Environment & Disaster Management','Science & Tech'],
  GS4: ['Ethics Theory','Case Studies'],
  OPT1: [
    '1.1 Meaning, Scope & Development of Anthropology',
    '1.2 Relationships with Other Disciplines',
    '1.3 Main Branches of Anthropology (Scope & Relevance)',
    '1.4 Human Evolution & Emergence of Man (Factors & Theories)',
    '1.5 Characteristics of Primates & Evolutionary Trends',
    '1.6 Phylogenetic Status & Distribution of Fossils (Australopithecus to Cro-Magnon)',
    '1.7 Biological Basis of Life (Cell, DNA, Mutation, Chromosomes)',
    '1.8 Prehistoric Archaeology & Prehistoric Cultures (Paleolithic to Iron Age)',
    '2.1 Nature of Culture & Ethnocentrism vs Cultural Relativism',
    '2.2 Nature of Society, Social Institutions & Stratification',
    '2.3 Marriage (Types, Laws, Regulations & Payments)',
    '2.4 Family (Types, Functions & Contemporary Changes)',
    '2.5 Kinship (Descent, Alliance, Terminology & Groups)',
    '3.0 Economic Organization & Economic Anthropology',
    '4.0 Political Organization & Social Control',
    '5.0 Religion, Magic & Science',
    '6.0 (a) Classical Evolutionism (Tylor, Morgan, Frazer)',
    '6.0 (b) Historical Particularism (Boas) & Diffusionism',
    '6.0 (c) Functionalism (Malinowski) & Structural-Functionalism (Radcliffe-Brown)',
    '6.0 (d) Structuralism (Levi-Strauss, E. Leach)',
    '6.0 (e) Culture & Personality (Benedict, Mead, Linton, Kardiner, Cora-du-Bois)',
    '6.0 (f) Neo-Evolutionism (Childe, White, Steward, Sahlins, Service)',
    '6.0 (g) Cultural Materialism (Harris)',
    '6.0 (h) Symbolic & Interpretive Theories (Turner, Schneider, Geertz)',
    '6.0 (i) Cognitive Theories (Tyler, Conklin)',
    '6.0 (j) Post-Modernism in Anthropology',
    '7.0 Culture, Language & Communication',
    '8.0 Research Methods in Anthropology',
    '9.1 Human Genetics Methods & Applications',
    '9.2 Mendelian Genetics in Man',
    '9.3 Genetic Polymorphism, Selection & Hardy-Weinberg Law',
    '9.4 Chromosomes & Chromosomal Aberrations',
    '9.5 Race & Racism',
    '9.6 Age, Sex & Population Variation as Genetic Marker',
    '9.7 Ecological Anthropology & Bio-cultural Adaptations',
    '9.8 Epidemiological Anthropology',
    '10.0 Concept of Human Growth & Development',
    '11.1 Bioevents to Fertility & Demographic Patterns',
    '11.2 Demographic Theories',
    '11.3 Biological & Socio-ecological Factors in Demography',
    '12.0 Applications of Anthropology'
  ],
  OPT2: [
    '1.1 Evolution of Indian Culture & Civilization (Prehistoric to Harappan)',
    '1.2 Palaeo-Anthropological Evidences from India (Siwaliks & Narmada)',
    '1.3 Ethno-archaeology in India',
    '2.0 Demographic Profile of India (Ethnic & Linguistic Elements)',
    '3.1 Traditional Indian Social System (Varnashram, Purushartha, Karma)',
    '3.2 Caste System in India, Jajmani & Tribe-Caste Continuum',
    '3.3 Sacred Complex & Nature-Man-Spirit Complex',
    '3.4 Impact of Buddhism, Jainism, Islam & Christianity on Indian Society',
    '4.0 Emergence, Growth & Development of Anthropology in India',
    '5.1 Indian Village & Social Structure',
    '5.2 Linguistic & Religious Minorities',
    '5.3 Processes of Socio-Cultural Change (Sanskritization, Westernization, etc.)',
    '6.1 Tribal Situation in India (Variability & Distribution)',
    '6.2 Problems of Tribal Communities',
    '6.3 Developmental Projects, Displacement & Forest Policies',
    '7.1 Exploitation, Deprivation & Constitutional Safeguards for SC/ST',
    '7.2 Social Change & Contemporary Tribal Societies',
    '7.3 Ethnicity, Tribal Unrest & Regionalism',
    '8.1 Impact of World Religions on Tribal Societies',
    '8.2 Tribe & Nation State (Comparative Study)',
    '9.1 History of Tribal Administration, PTGs/PVTGs & Development',
    '9.2 Role of Anthropology in Tribal & Rural Development',
    '9.3 Anthropology in Understanding Regionalism, Communalism & Movements'
  ]
};

const WORKER_URL = 'https://qcap-ai-v2.khokcha9.workers.dev';
const MARK_RULES = { 10: 2, 15: 3, 20: 4 };

// Make globally available
