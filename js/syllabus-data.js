// ============================================================
// UPSC SYLLABUS DATA (Single-Column Full Text + Unique Styles)
// ============================================================

const PRELIMS_TEXT = `
    <div class="detail-card-content prelims-card">
        <strong>Paper I - (200 marks) Duration : Two hours</strong>
        <ul>
            <li>Current events of national and international importance.</li>
            <li>History of India and Indian National Movement.</li>
            <li>Indian and World Geography - Physical, Social, Economic Geography of India and the World.</li>
            <li>Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.</li>
            <li>Economic and Social Development Sustainable Development, Poverty, Inclusion, Demographics, Social Sector initiatives, etc.</li>
            <li>General issues on Environmental Ecology, Bio-diversity and Climate Change - that do not require subject specialization.</li>
            <li>General Science.</li>
        </ul>
        <br>
        <strong>Paper II- (200 marks) Duration: Two hours</strong>
        <ul>
            <li>Comprehension</li>
            <li>Interpersonal skills including communication skills;</li>
            <li>Logical reasoning and analytical ability</li>
            <li>Decision-making and problem-solving</li>
            <li>General mental ability</li>
            <li>Basic numeracy (numbers and their relations, orders of magnitude, etc.) (Class X level), Data interpretation (charts, graphs, tables, data sufficiency etc. - Class X level)</li>
            <li>English Language Comprehension skills (Class X level)</li>
        </ul>
    </div>`;

const ESSAY_TEXT = `
    <div class="essay-layout">
        <p>Candidates will be required to write an essay on a specific topic. The choice of subjects will be given. They will be expected to keep closely to the subject of the essay to arrange their ideas in orderly fashion, and to write concisely. Credit will be given for effective and exact expression.</p>
    </div>`;

const GS1_TEXT = `
    <div class="detail-card-content gs1-card">
        <strong>General Studies- I: Indian Heritage and Culture, History and Geography of the World and Society.</strong>
        <ul>
            <li>Indian culture will cover the salient aspects of Art Forms, Literature and Architecture from ancient to modern times.</li>
            <li>Modern Indian history from about the middle of the eighteenth century until the present- significant events, personalities, issues</li>
            <li>The Freedom Struggle - its various stages and important contributors /contributions from different parts of the country.</li>
            <li>Post-independence consolidation and reorganization within the country.</li>
            <li>History of the world will include events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization, political philosophies like communism, capitalism, socialism etc.- their forms and effect on the society.</li>
            <li>Salient features of Indian Society, Diversity of India.</li>
            <li>Role of women and women's organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies.</li>
            <li>Effects of globalization on Indian society</li>
            <li>Social empowerment, communalism, regionalism & secularism.</li>
            <li>Salient features of world's physical geography.</li>
            <li>Distribution of key natural resources across the world (including South Asia and the Indian subcontinent); factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world (including India)</li>
            <li>Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone etc., geographical features and their location- changes in critical geographical features (including water-bodies and ice-caps) and in flora and fauna and the effects of such changes.</li>
        </ul>
    </div>`;

const GS2_TEXT = `
    <div class="detail-card-content gs2-card">
        <strong>General Studies- II: Governance, Constitution, Polity, Social Justice and International relations.</strong>
        <ul>
            <li>Indian Constitution- historical underpinnings, evolution, features, amendments, significant provisions and basic structure.</li>
            <li>Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure, devolution of powers and finances up to local levels and challenges therein.</li>
            <li>Separation of powers between various organs dispute redressal mechanisms and institutions.</li>
            <li>Comparison of the Indian constitutional scheme with that of other countries</li>
            <li>Parliament and State Legislatures - structure, functioning, conduct of business, powers & privileges and issues arising out of these.</li>
            <li>Structure, organization and functioning of the Executive and the Judiciary Ministries and Departments of the Government; pressure groups and formal/informal associations and their role in the Polity.</li>
            <li>Salient features of the Representation of People's Act.</li>
            <li>Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies.</li>
            <li>Statutory, regulatory and various quasi-judicial bodies</li>
            <li>Government policies and interventions for development in various sectors and issues arising out of their design and implementation.</li>
            <li>Development processes and the development industry- the role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders</li>
            <li>Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes; mechanisms, laws, institutions and Bodies constituted for the protection and betterment of these vulnerable sections.</li>
            <li>Issues relating to development and management of Social Sector/Services relating to Health, Education, Human Resources.</li>
            <li>Issues relating to poverty and hunger.</li>
            <li>Important aspects of governance, transparency and accountability, e-governance- applications, models, successes, limitations, and potential; citizens charters, transparency & accountability and institutional and other measures.</li>
            <li>Role of civil services in a democracy.</li>
            <li>India and its neighborhood- relations.</li>
            <li>Bilateral, regional and global groupings and agreements involving India and/or affecting India's interests</li>
            <li>Effect of policies and politics of developed and developing countries on India's interests, Indian diaspora.</li>
            <li>Important International institutions, agencies and fora- their structure, mandate.</li>
        </ul>
    </div>`;

const GS3_TEXT = `
    <div class="detail-card-content gs3-card">
        <strong>General Studies-III: Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management.</strong>
        <ul>
            <li>Indian Economy and issues relating to planning, mobilization of resources, growth, development and employment.</li>
            <li>Inclusive growth and issues arising from it.</li>
            <li>Government Budgeting.</li>
            <li>Major crops cropping patterns in various parts of the country, different types of irrigation and irrigation systems storage, transport and marketing of agricultural produce and issues and related constraints; e-technology in the aid of farmers</li>
            <li>Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System- objectives, functioning, limitations, revamping; issues of buffer stocks and food security; Technology missions; economics of animal-rearing.</li>
            <li>Food processing and related industries in India- scope and significance, location, upstream and downstream requirements, supply chain management.</li>
            <li>Land reforms in India.</li>
            <li>Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth.</li>
            <li>Infrastructure: Energy, Ports, Roads, Airports, Railways etc.</li>
            <li>Investment models.</li>
            <li>Science and Technology- developments and their applications and effects in everyday life</li>
            <li>Achievements of Indians in science & technology; indigenization of technology and developing new technology.</li>
            <li>Awareness in the fields of IT, Space, Computers, robotics, nano-technology, bio-technology and issues relating to intellectual property rights.</li>
            <li>Conservation, environmental pollution and degradation, environmental impact assessment</li>
            <li>Disaster and disaster management.</li>
            <li>Linkages between development and spread of extremism.</li>
            <li>Role of external state and non-state actors in creating challenges to internal security.</li>
            <li>Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges, basics of cyber security; money-laundering and its prevention</li>
            <li>Security challenges and their management in border areas; linkages of organized crime with terrorism</li>
            <li>Various Security forces and agencies and their mandate</li>
        </ul>
    </div>`;

const GS4_TEXT = `
    <div class="detail-card-content gs4-card">
        <strong>General Studies- IV: Ethics, Integrity, and Aptitude</strong>
        <ul>
            <li>Ethics and Human Interface: Essence, determinants and consequences of Ethics in human actions; dimensions of ethics; ethics in private and public relationships. Human Values – lessons from the lives and teachings of great leaders, reformers and administrators; role of family, society and educational institutions in inculcating values.</li>
            <li>Attitude: content, structure, function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion.</li>
            <li>Aptitude and foundational values for Civil Service , integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards the weaker sections.</li>
            <li>Emotional intelligence-concepts, and their utilities and application in administration and governance.</li>
            <li>Contributions of moral thinkers and philosophers from India and world.</li>
            <li>Public/Civil service values and Ethics in Public administration: Status and problems; ethical concerns and dilemmas in government and private institutions; laws, rules, regulations and conscience as sources of ethical guidance; accountability and ethical governance; strengthening of ethical and moral values in governance; ethical issues in international relations and funding; corporate governance.</li>
            <li>Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government, Right to Information, Codes of Ethics, Codes of Conduct, Citizen's Charters, Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption.</li>
            <li>Case Studies on above issues.</li>
        </ul>
    </div>`;

const ANTHRO1_TEXT = `
    <ul class="anthro-index">
        <li><strong>1.1 Meaning, scope and development of Anthropology.</strong><p>Relationships with other disciplines: Social Sciences, Behavioural Sciences, Life Sciences, Medical Sciences, Earth Sciences and Humanities.</p></li>
        <li><strong>1.3 Main branches of Anthropology</strong><p>Social-cultural, Biological, Archaeological, and Linguistic Anthropology.</p></li>
        <li><strong>1.4 Human Evolution and emergence of Man</strong><p>Biological and Cultural factors in human evolution. Theories of Organic Evolution. Synthetic theory of evolution, terms and concepts of evolutionary biology.</p></li>
        <li><strong>1.5 Characteristics of Primates</strong><p>Evolutionary Trend and Primate Taxonomy, Primate Adaptations, Primate Behaviour, Comparative Anatomy of Man and Apes.</p></li>
        <li><strong>1.6 Phylogenetic status</strong><p>Australopithecines, Homo erectus, Neanderthal Man, Rhodesian man, Homo sapiens — Cromagnon, Grimaldi and Chancelede.</p></li>
        <li><strong>1.7 Biological basis of life</strong><p>The Cell, DNA structure and replication, Protein Synthesis, Gene, Mutation, Chromosomes, and Cell Division.</p></li>
        <li><strong>1.8 Principles of Prehistoric Archaeology</strong><p>Chronology: Relative and Absolute Dating methods. Cultural Evolution: Paleolithic to Iron Age.</p></li>
        <li><strong>2.1-2.5 Culture, Society, Marriage, Family, Kinship</strong><p>Ethnocentrism, Social Institutions, Types of marriage, Types of family, Descent groups.</p></li>
        <li><strong>3-5 Economic, Political, Religion</strong><p>Formalist/Substantivist debate, Band/tribe/state, Anthropological approaches to religion, Religion and magic.</p></li>
        <li><strong>6. Anthropological theories</strong><p>Evolutionism, Historical particularism, Functionalism, Structuralism, Culture and personality, Neo-evolutionism, Cultural materialism, Post-modernism.</p></li>
        <li><strong>7-8 Culture, language, communication & Research methods</strong><p>Nature of language, Fieldwork tradition, Tools of data collection, Analysis & interpretation.</p></li>
        <li><strong>9.1-9.8 Human Genetics, Race, Ecology</strong><p>Mendelian genetics, Genetic polymorphism, Chromosomal aberrations, Race and racism, Ecological Anthropology, Epidemiological Anthropology.</p></li>
        <li><strong>10-11 Human growth & Fertility</strong><p>Stages of growth, Ageing, Somatotypes, Demographic theories, Biological factors influencing fertility.</p></li>
        <li><strong>12. Applications of Anthropology</strong><p>Forensic Anthropology, Applied human genetics, DNA technology, Sports & Nutritional anthropology.</p></li>
    </ul>`;

const ANTHRO2_TEXT = `
    <ul class="anthro-index">
        <li><strong>1.1 Evolution of the Indian Culture and Civilization</strong><p>Prehistoric, Protohistoric (Indus Civilization), Contributions of tribal cultures.</p></li>
        <li><strong>1.2 Palaeo-anthropological evidences</strong><p>Siwaliks and Narmada basin (Ramapithecus, Sivapithecus and Narmada Man).</p></li>
        <li><strong>1.3 Ethno-archaeology in India</strong><p>Concept of ethno-archaeology, Survivals and Parallels among communities.</p></li>
        <li><strong>2. Demographic profile of India</strong><p>Ethnic and linguistic elements in the Indian population, factors influencing its structure and growth.</p></li>
        <li><strong>3.1-3.4 Traditional Indian social system</strong><p>Varnashram, Purushartha, Karma, Caste system, Jajmani system, Sacred Complex, Impact of Buddhism, Jainism, Islam, Christianity.</p></li>
        <li><strong>4. Emergence of anthropology in India</strong><p>Contributions of scholar-administrators and Indian anthropologists to tribal and caste studies.</p></li>
        <li><strong>5.1-5.3 Indian Village & Social change</strong><p>Significance of village study, Agrarian relations, Impact of globalization, Sanskritization, Westernization, Panchayati raj.</p></li>
        <li><strong>6.1-6.3 Tribal situation & Problems</strong><p>Bio-genetic variability, Land alienation, Poverty, Health, Developmental projects, Impact of urbanization.</p></li>
        <li><strong>7.1-7.3 Exploitation & Ethnic conflicts</strong><p>Constitutional safeguards, Social change, Regionalism, Pseudo-tribalism.</p></li>
        <li><strong>8.1-8.2 Religions & Nation state</strong><p>Impact of religions on tribal societies, Tribe and nation state comparison.</p></li>
        <li><strong>9.1-9.3 Development & Administration</strong><p>History of tribal administration, PTGs, Role of NGOs, Anthropology in rural development, Regionalism and movements.</p></li>
    </ul>`;

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
