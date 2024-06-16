document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.querySelector('.quiz-container');
    const fullScreenMessage = document.querySelector('.fullscreen-message');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const timerElement = document.getElementById('timer');
    const nextBtn = document.getElementById('nextBtn');
    
    let questions = [];
    let currentQuestionIndex = 0;
    let timer;
    let timeLeft = 600; // 10 minutes

    // Load questions from JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            const savedIndex = localStorage.getItem('currentQuestionIndex');
            currentQuestionIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
            loadQuestion();
            startTimer();
        });

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            alert("Quiz finished!");
            return;
        }
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => selectOption(option));
            optionsElement.appendChild(li);
        });
    }

    function selectOption(option) {
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.selected = option;
        currentQuestionIndex++;
        localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
        loadQuestion();
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time's up!");
            }
        }, 1000);
    }

    function startQuiz() {
        if (document.fullscreenElement) {
            fullScreenMessage.style.display = 'none';
            quizContainer.style.display = 'block';
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            quizContainer.style.display = 'none';
            fullScreenMessage.style.display = 'block';
            clearInterval(timer);
        } else {
            quizContainer.style.display = 'block';
            fullScreenMessage.style.display = 'none';
        }
    });

    nextBtn.addEventListener('click', loadQuestion);
    
    window.startQuiz = startQuiz;
});