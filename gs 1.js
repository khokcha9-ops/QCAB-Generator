const DEFAULT_PRESETS = [
  {
    "id": "gs1_1",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2013",
    "marks": 5,
    "question": "Discuss the Tandava dance as recorded in the early Indian inscriptions."
  },
  {
    "id": "gs1_2",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2013",
    "marks": 5,
    "question": "Chola architecture represents a high watermark in the evolution of temple architecture. Discuss."
  },
  {
    "id": "gs1_3",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2013",
    "marks": 10,
    "question": "Though not very useful from the point of view of a connected political history of South India, the Sangam literature portrays the social and economic conditions of its time with remarkable vividness. Comment."
  },
  {
    "id": "gs1_4",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2013",
    "marks": 10,
    "question": "a) Sufis and medieval mystic saints failed to modify religious ideas and practices or bring about a structural change in secondary structure, but contributed to transformation in society in significant ways. Comment."
  },
  {
    "id": "gs1_5",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2014",
    "marks": 10,
    "question": "Sufism in India was not just a religious movement, but a socio-cultural phenomenon that enriched Indian society. Examine."
  },
  {
    "id": "gs1_6",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2014",
    "marks": 10,
    "question": "Taxila university was one of the oldest universities of the world with which were associated a number of renowned learned personalities of different disciplines. Its strategic location, however, did not contribute to its development. Discuss."
  },
  {
    "id": "gs1_7",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2014",
    "marks": 10,
    "question": "The Gandhara sculpture owed as much to the Romans as to the Greeks. Explain."
  },
  {
    "id": "gs1_8",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2015",
    "marks": 10,
    "question": "The Tanjore paintings, though deeply religious in theme, display a rich synthesis of indigenous tradition and external artistic influences. Discuss."
  },
  {
    "id": "gs1_9",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2015",
    "marks": 10,
    "question": "Evaluate the influence of the Bhakti movement on the growth of regional languages and literature in India."
  },
  {
    "id": "gs1_10",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2016",
    "marks": 12,
    "question": "Early Buddhist stupa art, while depicting folk motifs and narratives, successfully expounded Buddhist ideals. Elucidate."
  },
  {
    "id": "gs1_11",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2016",
    "marks": 12,
    "question": "Krishnadevaraya, the King of Vijayanagar, was not only an accomplished scholar himself but was a great patron of learning and literature. Discuss."
  },
  {
    "id": "gs1_12",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2017",
    "marks": 10,
    "question": "How do you justify the view that the level of excellence of the Gupta numismatic art is not at all noticeable in later times?"
  },
  {
    "id": "gs1_13",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2018",
    "marks": 10,
    "question": "Safeguarding the Indian heritage is the need of the hour. Discuss."
  },
  {
    "id": "gs1_14",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2018",
    "marks": 15,
    "question": "Assess the importance of the accounts of the Chinese travellers in the reconstruction of the history of India."
  },
  {
    "id": "gs1_15",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2018",
    "marks": 15,
    "question": "The Bhakti movement received a remarkable impetus with the arrival of Kabir and Nanak. Discuss."
  },
  {
    "id": "gs1_16",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2019",
    "marks": 10,
    "question": "Highlight the Central Asian and Greco-Bactrian elements in Gandhara art."
  },
  {
    "id": "gs1_17",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2020",
    "marks": 10,
    "question": "Rock-cut architecture represents one of the most important sources of our knowledge of early Indian art and history. Discuss."
  },
  {
    "id": "gs1_18",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2020",
    "marks": 15,
    "question": "Pala period is the most significant phase in the history of Buddhism in India. Enumerate."
  },
  {
    "id": "gs1_19",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2020",
    "marks": 15,
    "question": "Evaluate the nature of the Bhakti Literature and its contribution to Indian culture."
  },
  {
    "id": "gs1_20",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2021",
    "marks": 10,
    "question": "Evaluate the main features of the Young Bengal Movement and its impact on the socio-religious awakening in Bengal."
  },
  {
    "id": "gs1_21",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2021",
    "marks": 15,
    "question": "To what extent did the Portuguese presence in the Indian Ocean shape coastal society and trade in early modern India?"
  },
  {
    "id": "gs1_22",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2022",
    "marks": 10,
    "question": "How will you explain that medieval Indian temple sculptures represent the social life of those days?"
  },
  {
    "id": "gs1_23",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2022",
    "marks": 15,
    "question": "Discuss the main contributions of Gupta period and Chola period to Indian heritage and culture."
  },
  {
    "id": "gs1_24",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2023",
    "marks": 10,
    "question": "Explain the significance of the Sangam texts in understanding the early history of South India."
  },
  {
    "id": "gs1_25",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2023",
    "marks": 15,
    "question": "What was the difference between Mahatma Gandhi and Rabindranath Tagore in their approach towards education and nationalism?"
  },
  {
    "id": "gs1_26",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2024",
    "marks": 10,
    "question": "How did the architectural style of Vijaynagara Empire reflect its socio-cultural environment?"
  },
  {
    "id": "gs1_27",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2024",
    "marks": 15,
    "question": "Analyze the role of tribal movements in the Indian freedom struggle with suitable examples."
  },
  {
    "id": "gs1_28",
    "paper": "GS1",
    "topic": "Art & Culture",
    "year": "2025",
    "marks": 10,
    "question": "Examine the salient features of Indus Valley temple architecture and urban planning."
  },
  {
    "id": "gs1_29",
    "paper": "GS1",
    "topic": "Modern History",
    "year": "2013",
    "marks": 10,
    "question": "Defying the barriers of age, gender and religion, the Indian women became the torch bearers during the struggle for freedom in India. Discuss."
  },
  {
    "id": "gs1_30",
    "paper": "GS1",
    "topic": "Modern History",
    "year": "2013",
    "marks": 10,
    "question": "Several foreigners made India their homeland and participated in various movements. Analyze their role in the Indian freedom struggle."
  }
];