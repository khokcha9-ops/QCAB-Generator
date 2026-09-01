// This line tells JavaScript to wait until the HTML page is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // 1. Find the container div on your page
  const container = document.getElementById('questions-container');

  // 2. Fetch the gs1.json file
  fetch('gs1.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not find gs1.json file");
      }
      return response.json();
    })
    .then(data => {
      // 3. Render questions if found
      renderQuestions(data);
    })
    .catch(error => {
      console.error('Error:', error);
      if (container) {
        container.innerHTML = '<p style="color: red;">Failed to load gs1.json. Make sure the file name is exact.</p>';
      }
    });

});

// Function to display questions
function renderQuestions(questions) {
  const container = document.getElementById('questions-container');
  if (!container) return;
  
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';

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

// Function to show/hide answer
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
