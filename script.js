document.addEventListener("DOMContentLoaded", () => {
  // Fetch the JSON file from your repository
  fetch('gs1.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(data => {
      renderQuestions(data);
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
      document.getElementById('questions-container').innerHTML = 
        '<p style="color: red;">Failed to load gs1.json. Make sure the file name matches exactly.</p>';
    });
});

function renderQuestions(questions) {
  const container = document.getElementById('questions-container');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';

    // Fallback if model answer isn't present in JSON yet
    const answerText = q.Answer || q.answer 
      ? (q.Answer || q.answer) 
      : '<em>Model answer coming soon.</em>';

    card.innerHTML = `
      <div class="card-meta">
        <span class="badge">${q.Syllabus || q.subject || 'GS 1'}</span>
        <span class="details">${q.Year ? q.Year : ''} ${q.Marks ? '• ' + q.Marks + ' Marks' : ''}</span>
      </div>
      <p class="question-text"><strong>Q${index + 1}.</strong> ${q.Question || q.question}</p>
      
      <button class="toggle-btn" onclick="toggleAnswer(this)">View Model Answer</button>
      
      <div class="answer-content">
        <h4>Model Answer / Structural Outline:</h4>
        <div>${answerText}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

function toggleAnswer(button) {
  const answer = button.nextElementSibling;
  if (answer.style.display === 'block') {
    answer.style.display = 'none';
    button.textContent = 'View Model Answer';
  } else {
    answer.style.display = 'block';
    button.textContent = 'Hide Model Answer';
  }
}
