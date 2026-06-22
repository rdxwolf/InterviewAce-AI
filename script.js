/* script.js - Functionality for InterviewAce AI */
const categoryTitleEl = document.getElementById('category-title');
const questionCounterEl = document.getElementById('question-counter');
const questionTextEl = document.getElementById('question-text');
const optionsListEl = document.getElementById('options-list');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('quiz-progress');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('header nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.style.display = navUl.style.display === 'flex' ? 'none' : 'flex';
            if (navUl.style.display === 'flex') {
                 navUl.style.flexDirection = 'column';
                 navUl.style.position = 'absolute';
                 navUl.style.top = '100%';
                 navUl.style.left = '0';
                 navUl.style.width = '100%';
                 navUl.style.backgroundColor = 'rgba(11, 17, 33, 0.98)';
                 navUl.style.padding = '20px';
                 navUl.style.borderBottom = '1px solid #1f2937';
            }
        });
    }

    // 2. Practice Interface Simulation (index.html)
    const options = document.querySelectorAll('.practice-interface .option');
    if (options.length > 0) {
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                options.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
            });
        });
    }

    // 3. Category Select Hover Simulation (index.html / categories.html)
    const catCards = document.querySelectorAll('.category-card, .category-select-card');
    catCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Simulated hover effect defined in CSS already
        });
    });

    // 4. Recommendation Test Simulation (categories.html)
    const recommendationBtn = document.getElementById('takeRecommendationTest');
    if (recommendationBtn) {
        recommendationBtn.addEventListener('click', () => {
            alert('THIS FEATURE IS COMING SOON! In the meantime, you can explore our practice questions and resources to prepare for your interviews.');
        });
    }

    // 5. Contact Form Simulation (contact.html)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard form submission

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Log form submission to console (Simulating sending)
            console.log('--- Contact Form Submitted ---');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);

            // Show success message and clear form
            formStatus.innerHTML = '<span style="color: #10b981;">Message sent successfully! We will get back to you soon.</span>';
            contactForm.reset();

            // Clear status message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        });
    }

    // 6. Overall Progress Wheel Animation (index.html, optional)
    // We update the conic gradient to simulate real progress
    const updateProgressRing = (percentage) => {
        const ring = document.querySelector('.progress-ring');
        if (ring) {
            ring.style.background = `radial-gradient(closest-side, var(--card-bg-color) 89%, transparent 90% 100%),
                                conic-gradient(var(--primary-color) calc(${percentage} * 1%), var(--border-color) 0)`;
        }
    }
    
    // Simulating a dynamic update from real data
    setTimeout(() => {
        updateProgressRing(85); // Up to 85% after 2 seconds
        const overallText = document.getElementById('overallProgress');
        if (overallText) overallText.innerText = '85%';
    }, 2000);

});

/* practice.js - Logic for the quiz interface */

// 1. Our Mock Database (JavaScript Object)
const questionsData = {
    frontend: [
        { question: "What does HTML stand for?", options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlink and Text Markup Language"], answer: 1 },
        { question: "What is Event Bubbling in JavaScript?", options: ["A way to select HTML elements", "Events trigger from the innermost element and propagate outward", "A way to handle multiple events at once", "None of the above"], answer: 1 },
        { question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], answer: 2 }
    ],
    backend: [
        { question: "Which of the following is a Node.js web application framework?", options: ["Django", "Express.js", "Laravel", "Spring Boot"], answer: 1 },
        { question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Programming Integration", "Application Protocol Interface", "Automated Program Interface"], answer: 0 },
        { question: "Which command is used to install packages in Node.js?", options: ["node install", "npm get", "npm install", "install node"], answer: 2 }
    ],
    hr: [
        { question: "How should you answer 'What is your greatest weakness?'", options: ["Say you have no weaknesses", "Mention a real weakness and how you are working to improve it", "Name a fake weakness like 'I work too hard'", "Refuse to answer"], answer: 1 },
        { question: "What is the STAR method used for?", options: ["Coding algorithms", "Structuring behavioral interview answers", "Negotiating salary", "Writing a resume"], answer: 1 }
    ],
    support: [
        { question: "If an angry customer calls, what is your first step?", options: ["Argue with them", "Transfer the call immediately", "Listen actively and empathize", "Put them on hold"], answer: 2 },
        { question: "What does SLA stand for in customer service?", options: ["Service Level Agreement", "Standard Legal Action", "Support Log Analysis", "Software License Agreement"], answer: 0 }
    ]
};

// 2. Setup Variables
let currentCategory = 'frontend'; // Default
let currentQuestionIndex = 0;
let score = 0;
let currentQuestions = [];

// 3. Initialize the Quiz on Page Load
document.addEventListener('DOMContentLoaded', () => {
    // Check the URL for a category (e.g., ?cat=backend)
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('cat') && questionsData[urlParams.get('cat')]) {
        currentCategory = urlParams.get('cat');
    }

    currentQuestions = questionsData[currentCategory];
    categoryTitleEl.innerText = `${currentCategory} • Practice`;
    
    loadQuestion();
});

// 4. Load a Question
function loadQuestion() {
    const currentQ = currentQuestions[currentQuestionIndex];
    
    // Update Text
    questionTextEl.innerText = currentQ.question;
    questionCounterEl.innerText = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    
    // Update Progress Bar
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Clear previous options and hide next button
    optionsListEl.innerHTML = '';
    nextBtn.style.display = 'none';

    // Generate option buttons
    currentQ.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        
        // Add A, B, C, D letters dynamically
        const letter = String.fromCharCode(65 + index);
        optionDiv.innerText = `${letter}. ${option}`;
        
        // Add click event
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        
        optionsListEl.appendChild(optionDiv);
    });
}

// 5. Handle Option Selection
function selectOption(selectedIndex, selectedDiv) {
    const currentQ = currentQuestions[currentQuestionIndex];
    const allOptions = document.querySelectorAll('.option');

    // Disable all options so user can't click twice
    allOptions.forEach(opt => opt.classList.add('disabled'));

    // Check if correct
    if (selectedIndex === currentQ.answer) {
        selectedDiv.classList.add('correct');
        score++;
    } else {
        selectedDiv.classList.add('incorrect');
        // Highlight the correct one
        allOptions[currentQ.answer].classList.add('correct');
    }

    // Show the Next button
    nextBtn.style.display = 'inline-block';
}

// 6. Next Button Click Event
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 7. Show Final Results
function showResults() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = currentQuestions.length;
}