/* practice.js - Logic for the quiz interface */

// Setup Variables
let currentCategory = 'frontend'; 
let currentQuestionIndex = 0;
let score = 0;
let currentQuestions = [];

// DOM Elements
const categoryTitleEl = document.getElementById('category-title');
const questionCounterEl = document.getElementById('question-counter');
const questionTextEl = document.getElementById('question-text');
const optionsListEl = document.getElementById('options-list');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('quiz-progress');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const countSelector = document.getElementById('question-count-selector');

// --- Helper Function: Shuffle an Array ---
function shuffleArray(array) {
    let shuffled = [...array]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize the Quiz on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('cat') && questionsData[urlParams.get('cat')]) {
        currentCategory = urlParams.get('cat');
    }
    categoryTitleEl.innerText = `${currentCategory} • Practice`;
    
    // Start the quiz with the default dropdown value
    startQuiz();
});

// Listen for the user changing the dropdown
countSelector.addEventListener('change', () => {
    startQuiz(); // Restart the quiz with the new number
});

// Function to Start or Restart the Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    // Grab the massive list of questions from your questions.js file
    const allCategoryQuestions = questionsData[currentCategory];
    
    // Shuffle them so it's a new quiz every time
    const randomizedQuestions = shuffleArray(allCategoryQuestions);
    
    // Check the dropdown menu for how many questions to show
    const selectedCount = countSelector.value;
    
    if (selectedCount === 'all') {
        currentQuestions = randomizedQuestions;
    } else {
        currentQuestions = randomizedQuestions.slice(0, parseInt(selectedCount));
    }
    
    loadQuestion();
}

// Load a Question onto the screen
function loadQuestion() {
    const currentQ = currentQuestions[currentQuestionIndex];
    
    questionTextEl.innerText = currentQ.question;
    questionCounterEl.innerText = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    optionsListEl.innerHTML = '';
    nextBtn.style.display = 'none';

    currentQ.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        
        const letter = String.fromCharCode(65 + index);
        optionDiv.innerText = `${letter}. ${option}`;
        
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        optionsListEl.appendChild(optionDiv);
    });
}

// Handle what happens when a user clicks an option
function selectOption(selectedIndex, selectedDiv) {
    const currentQ = currentQuestions[currentQuestionIndex];
    const allOptions = document.querySelectorAll('.option');

    // Disable all buttons after clicking one
    allOptions.forEach(opt => opt.classList.add('disabled'));

    if (selectedIndex === currentQ.answer) {
        selectedDiv.classList.add('correct');
        score++;
    } else {
        selectedDiv.classList.add('incorrect');
        allOptions[currentQ.answer].classList.add('correct');
    }

    nextBtn.style.display = 'inline-block';
}

// Handle the Next button click
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Show the final score screen
function showResults() {
    progressBar.style.width = `100%`;
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = currentQuestions.length;
}