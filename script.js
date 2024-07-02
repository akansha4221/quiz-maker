// script.js

document.addEventListener('DOMContentLoaded', () => {
    const quizzesList = document.getElementById('quizzes-list');
    const takeQuizContainer = document.getElementById('take-quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionsContainer = document.getElementById('questions-container');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const quizScore = document.getElementById('quiz-score');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');
  
    // Fetch quizzes from the server
    async function fetchQuizzes() {
      try {
        const response = await fetch('http://localhost:5000/api/quizzes');
        const quizzes = await response.json();
  
        quizzesList.innerHTML = '';
        quizzes.forEach(quiz => {
          const quizItem = document.createElement('div');
          quizItem.classList.add('quiz-item');
          quizItem.innerHTML = `
            <h3>${quiz.title}</h3>
            <button class="take-quiz-btn" data-quiz-id="${quiz._id}">Take Quiz</button>
          `;
          quizzesList.appendChild(quizItem);
        });
  
        // Add event listener to take quiz buttons
        const takeQuizBtns = document.querySelectorAll('.take-quiz-btn');
        takeQuizBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const quizId = btn.getAttribute('data-quiz-id');
            takeQuiz(quizId);
          });
        });
  
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        alert('Failed to fetch quizzes. Please try again.');
      }
    }
  
    fetchQuizzes();
  
    // Function to take a quiz
    async function takeQuiz(quizId) {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`);
        const quizData = await response.json();
  
        // Display quiz questions
        quizTitle.textContent = quizData.title;
        questionsContainer.innerHTML = '';
  
        quizData.questions.forEach((question, index) => {
          const questionElem = document.createElement('div');
          questionElem.classList.add('question');
          questionElem.innerHTML = `
            <h4>${index + 1}. ${question.question}</h4>
            <ul>
              ${question.options.map((option, idx) => `
                <li>
                  <input type="radio" id="option-${index}-${idx}" name="answer-${index}" value="${idx}">
                  <label for="option-${index}-${idx}">${option}</label>
                </li>
              `).join('')}
            </ul>
          `;
          questionsContainer.appendChild(questionElem);
        });
  
        // Show take quiz container, hide others
        quizzesList.classList.add('hidden');
        takeQuizContainer.classList.remove('hidden');
        quizResultContainer.classList.add('hidden');
  
      } catch (err) {
        console.error('Error taking quiz:', err);
        alert('Failed to take quiz. Please try again.');
      }
    }
  
    // Event listener for submit quiz button
    submitQuizBtn.addEventListener('click', async () => {
      try {
        const formData = new FormData(quizForm);
        const quizAnswers = [];
  
        quizData.questions.forEach((question, index) => {
          const selectedOption = document.querySelector(`input[name="answer-${index}"]:checked`);
          quizAnswers.push(parseInt(selectedOption.value));
        });
  
        const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answers: quizAnswers })
        });
  
        const result = await response.json();
  
        // Display quiz result
        quizScore.textContent = `Your Score: ${result.score}/${quizData.questions.length}`;
        quizzesList.classList.add('hidden');
        takeQuizContainer.classList.add('hidden');
        quizResultContainer.classList.remove('hidden');
  
      } catch (err) {
        console.error('Error submitting quiz:', err);
        alert('Failed to submit quiz. Please try again.');
      }
    });
  
    // Event listener for retake quiz button
    retakeQuizBtn.addEventListener('click', () => {
      quizzesList.classList.remove('hidden');
      takeQuizContainer.classList.add('hidden');
      quizResultContainer.classList.add('hidden');
    });
  
  });
  