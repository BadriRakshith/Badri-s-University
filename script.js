document.addEventListener('DOMContentLoaded', () => {
    // Screen Elements
    const screens = {
        login: document.getElementById('login-screen'),
        instructions: document.getElementById('instructions-screen'),
        test: document.getElementById('test-screen'),
        results: document.getElementById('results-screen'),
    };

    // Controls
    const loginBtn = document.getElementById('login-btn');
    const startExamBtn = document.getElementById('start-exam-btn');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const endExamBtn = document.getElementById('end-exam-btn');
    const restartButton = document.getElementById('restart-btn');

    // Display Elements
    const studentNameInput = document.getElementById('student-name');
    const cameraStatus = document.getElementById('camera-status');
    const cameraFeed = document.getElementById('camera-feed');
    const timerElement = document.getElementById('timer');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const questionPalette = document.getElementById('question-palette');
    const questionNumberTitle = document.getElementById('question-number-title');
    const resultName = document.getElementById('result-name');
    const scoreElement = document.getElementById('score');
    const totalQuestionsElement = document.getElementById('total-questions');
    const feedbackText = document.getElementById('feedback-text');

    // State Variables
    let testData = [];
    let currentQuestionIndex = 0;
    let timerInterval;
    let timeRemaining = 1800; // 30 minutes for 50 questions

    // =========================================================================================
    // 50 APTITUDE QUESTIONS
    // =========================================================================================
    const questions = [
        { question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", answers: [{ text: "(1/3)", correct: false }, { text: "(1/8)", correct: true }, { text: "(2/8)", correct: false }, { text: "(1/16)", correct: false }] },
        { question: "A man buys a toy for $25 and sells it for $30. What is the percentage of profit?", answers: [{ text: "25%", correct: false }, { text: "20%", correct: true }, { text: "15%", correct: false }, { text: "10%", correct: false }] },
        { question: "Which word does NOT belong with the others?", answers: [{ text: "inch", correct: false }, { text: "ounce", correct: true }, { text: "centimeter", correct: false }, { text: "yard", correct: false }] },
        { question: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?", answers: [{ text: "7", correct: false }, { text: "10", correct: true }, { text: "12", correct: false }, { text: "13", correct: false }] },
        { question: "Book is to Reading as Fork is to:", answers: [{ text: "drawing", correct: false }, { text: "writing", correct: false }, { text: "stirring", correct: false }, { text: "eating", correct: true }] },
        { question: "If a car travels at 60 km/h, how far will it travel in 2 hours and 30 minutes?", answers: [{ text: "120 km", correct: false }, { text: "150 km", correct: true }, { text: "180 km", correct: false }, { text: "135 km", correct: false }] },
        { question: "Find the average of the following numbers: 2, 3, 5, 6", answers: [{ text: "4", correct: true }, { text: "3.5", correct: false }, { text: "4.5", correct: false }, { text: "5", correct: false }] },
        { question: "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?", answers: [{ text: "20", correct: false }, { text: "22", correct: true }, { text: "23", correct: false }, { text: "26", correct: false }] },
        { question: "Oar is to Rowboat as Foot is to:", answers: [{ text: "running", correct: false }, { text: "sneaker", correct: false }, { "text": "skateboard", "correct": true }, { "text": "jumping", "correct": false } ]},
        { "question": "What is 3/5 as a percentage?", "answers": [ { "text": "30%", "correct": false }, { "text": "50%", "correct": false }, { "text": "60%", "correct": true }, { "text": "75%", "correct": false } ] },
        { "question": "Look at this series: 8, 6, 9, 7, 10, 8, ... What number should come next?", "answers": [ { "text": "9", "correct": false }, { "text": "11", "correct": true }, { "text": "7", "correct": false }, { "text": "12", "correct": false } ] },
        { "question": "A is the father of B. But B is not A's son. What is B to A?", "answers": [ { "text": "Niece", "correct": false }, { "text": "Nephew", "correct": false }, { "text": "Daughter", "correct": true }, { "text": "Cannot be determined", "correct": false } ] },
        { "question": "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):", "answers": [ { "text": "City", "correct": false }, { "text": "Animal", "correct": false }, { "text": "River", "correct": false }, { "text": "Ocean", "correct": true } ] },
        { "question": "What is the next prime number after 13?", "answers": [ { "text": "15", "correct": false }, { "text": "17", "correct": true }, { "text": "19", "correct": false }, { "text": "21", "correct": false } ] },
        { "question": "Look at this series: F2, __, D8, C16, B32", "answers": [ { "text": "A16", "correct": false }, { "text": "G4", "correct": false }, { "text": "E4", "correct": true }, { "text": "E3", "correct": false } ] },
        { "question": "Which one of the four is least like the other three?", "answers": [ { "text": "Apple", "correct": false }, { "text": "Rose", "correct": true }, { "text": "Banana", "correct": false }, { "text": "Grape", "correct": false } ] },
        { "question": "The price of an item is reduced by 25%. The original price was $120. What is the new price?", "answers": [ { "text": "$90", "correct": true }, { "text": "$100", "correct": false }, { "text": "$95", "correct": false }, { "text": "$85", "correct": false } ] },
        { "question": "CUP : LIP :: BIRD : ?", "answers": [ { "text": "GRASS", "correct": false }, { "text": "FOREST", "correct": false }, { "text": "BEAK", "correct": true }, { "text": "BUSH", "correct": false } ] },
        { "question": "If 10 men can do a piece of work in 20 days, how many days would it take for 20 men to do the same work?", "answers": [ { "text": "5 days", "correct": false }, { "text": "10 days", "correct": true }, { "text": "15 days", "correct": false }, { "text": "20 days", "correct": false } ] },
        { "question": "Look at this series: 22, 21, 23, 22, 24, 23, ... What number should come next?", "answers": [ { "text": "22", "correct": false }, { "text": "24", "correct": false }, { "text": "25", "correct": true }, { "text": "26", "correct": false } ] },
        { "question": "Which number is the odd one out: 9, 16, 25, 35, 49?", "answers": [ { "text": "9", "correct": false }, { "text": "16", "correct": false }, { "text": "35", "correct": true }, { "text": "49", "correct": false } ] },
        { "question": "A train travels 300 miles in 5 hours. What is its average speed?", "answers": [ { "text": "50 mph", "correct": false }, { "text": "60 mph", "correct": true }, { "text": "65 mph", "correct": false }, { "text": "70 mph", "correct": false } ] },
        { "question": "Paw : Cat :: Hoof : ?", "answers": [ { "text": "Lamb", "correct": false }, { "text": "Horse", "correct": true }, { "text": "Elephant", "correct": false }, { "text": "Lion", "correct": false } ] },
        { "question": "What is 20% of 200?", "answers": [ { "text": "20", "correct": false }, { "text": "40", "correct": true }, { "text": "60", "correct": false }, { "text": "80", "correct": false } ] },
        { "question": "Look at this series: 53, 53, 40, 40, 27, 27, ... What number should come next?", "answers": [ { "text": "12", "correct": false }, { "text": "14", "correct": true }, { "text": "27", "correct": false }, { "text": "53", "correct": false } ] },
        { "question": "Which word does NOT belong with the others?", "answers": [ { "text": "Car", "correct": false }, { "text": "Bicycle", "correct": false }, { "text": "Road", "correct": true }, { "text": "Bus", "correct": false } ] },
        { "question": "Find the next letter in the series: A, C, F, J, O, ...", "answers": [ { "text": "T", "correct": false }, { "text": "U", "correct": true }, { "text": "V", "correct": false }, { "text": "S", "correct": false } ] },
        { "question": "If a rectangle has a length of 8 and a width of 5, what is its area?", "answers": [ { "text": "13", "correct": false }, { "text": "26", "correct": false }, { "text": "40", "correct": true }, { "text": "30", "correct": false } ] },
        { "question": "SOUND : CACOPHONY ::", "answers": [ { "text": "SMELL : AROMA", "correct": false }, { "text": "TOUCH : TEXTURE", "correct": false }, { "text": "SPEECH : ORATION", "correct": true }, { "text": "TASTE : SWEET", "correct": false } ] },
        { "question": "A shopkeeper gives a 10% discount on an item marked at $200. The selling price is:", "answers": [ { "text": "$180", "correct": true }, { "text": "$190", "correct": false }, { "text": "$210", "correct": false }, { "text": "$220", "correct": false } ] },
        { "question": "Look at this series: 21, 9, 21, 11, 21, 13, 21, ... What number should come next?", "answers": [ { "text": "14", "correct": false }, { "text": "15", "correct": true }, { "text": "21", "correct": false }, { "text": "23", "correct": false } ] },
        { "question": "Which of the following is a synonym for 'Happy'?", "answers": [ { "text": "Sorrowful", "correct": false }, { "text": "Joyful", "correct": true }, { "text": "Angry", "correct": false }, { "text": "Tired", "correct": false } ] },
        { "question": "Solve for x: 2x + 5 = 15", "answers": [ { "text": "x = 10", "correct": false }, { "text": "x = 5", "correct": true }, { "text": "x = 7.5", "correct": false }, { "text": "x = 2.5", "correct": false } ] },
        { "question": "What is the square root of 144?", "answers": [ { "text": "10", "correct": false }, { "text": "11", "correct": false }, { "text": "12", "correct": true }, { "text": "13", "correct": false } ] },
        { "question": "Find the next number in the series: 1, 4, 9, 16, 25, ...", "answers": [ { "text": "30", "correct": false }, { "text": "36", "correct": true }, { "text": "49", "correct": false }, { "text": "42", "correct": false } ] },
        { "question": "Which of the following is an antonym for 'Brave'?", "answers": [ { "text": "Heroic", "correct": false }, { "text": "Courageous", "correct": false }, { "text": "Cowardly", "correct": true }, { "text": "Bold", "correct": false } ] },
        { "question": "If 1 inch = 2.54 cm, how many centimeters are in 10 inches?", "answers": [ { "text": "2.54 cm", "correct": false }, { "text": "25.4 cm", "correct": true }, { "text": "254 cm", "correct": false }, { "text": "0.254 cm", "correct": false } ] },
        { "question": "Look at this series: 80, 10, 70, 15, 60, ... What number should come next?", "answers": [ { "text": "20", "correct": true }, { "text": "25", "correct": false }, { "text": "30", "correct": false }, { "text": "50", "correct": false } ] },
        { "question": "Optimist is to Cheerful as Pessimist is to:", "answers": [ { "text": "Gloomy", "correct": true }, { "text": "Happy", "correct": false }, { "text": "Kind", "correct": false }, { "text": "Helpful", "correct": false } ] },
        { "question": "What is the simple interest on $500 for 2 years at 5% per annum?", "answers": [ { "text": "$25", "correct": false }, { "text": "$50", "correct": true }, { "text": "$75", "correct": false }, { "text": "$100", "correct": false } ] },
        { "question": "Find the next two letters in the series: Z, X, V, T, R, ...", "answers": [ { "text": "P, N", "correct": true }, { "text": "Q, O", "correct": false }, { "text": "O, M", "correct": false }, { "text": "P, M", "correct": false } ] },
        { "question": "If the day before yesterday was Saturday, what day will it be the day after tomorrow?", "answers": [ { "text": "Tuesday", "correct": false }, { "text": "Wednesday", "correct": true }, { "text": "Thursday", "correct": false }, { "text": "Friday", "correct": false } ] },
        { "question": "A hexagon has how many sides?", "answers": [ { "text": "5", "correct": false }, { "text": "6", "correct": true }, { "text": "7", "correct": false }, { "text": "8", "correct": false } ] },
        { "question": "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.", "answers": [ { "text": "True", "correct": true }, { "text": "False", "correct": false } ] },
        { "question": "Find the next number in the series: 3, 6, 11, 18, 27, ...", "answers": [ { "text": "36", "correct": false }, { "text": "38", "correct": true }, { "text": "40", "correct": false }, { "text": "34", "correct": false } ] },
        { "question": "Which of these is least like the others?", "answers": [ { "text": "Triangle", "correct": false }, { "text": "Circle", "correct": false }, { "text": "Square", "correct": false }, { "text": "Line", "correct": true } ] },
        { "question": "What is 5! (5 factorial)?", "answers": [ { "text": "25", "correct": false }, { "text": "120", "correct": true }, { "text": "60", "correct": false }, { "text": "150", "correct": false } ] }
    ];
    // =========================================================================================

    // --- Screen Navigation ---
    function navigateTo(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    // --- Event Listeners ---
    loginBtn.addEventListener('click', () => {
        if (studentNameInput.value.trim() === '') {
            alert('Please enter your name.');
            return;
        }
        navigateTo('instructions');
        checkCamera();
    });

    startExamBtn.addEventListener('click', () => {
        requestFullscreen();
        startGame();
    });
    
    // Other event listeners are the same as the previous version...
    endExamBtn.addEventListener('click', confirmEndExam);
    restartButton.addEventListener('click', () => location.reload());
    nextButton.addEventListener('click', showNextQuestion);
    prevButton.addEventListener('click', showPrevQuestion);

    // --- Core Functions ---
    async function checkCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
            cameraStatus.textContent = "Camera detected. You can now start the test.";
            cameraStatus.style.color = 'var(--green)';
            cameraStatus.style.borderColor = 'var(--green)';
            startExamBtn.disabled = false;
        } catch (error) {
            cameraStatus.textContent = "Camera access denied. Please enable camera permissions to proceed.";
            cameraStatus.style.color = 'var(--red)';
            cameraStatus.style.borderColor = 'var(--red)';
        }
    }

    function startGame() {
        navigateTo('test');
        
        testData = questions.map(q => ({ ...q, userAnswer: null }));
        currentQuestionIndex = 0;

        buildPalette();
        showQuestion(currentQuestionIndex);
        startTimer();
    }

    function showQuestion(index) {
        currentQuestionIndex = index;
        const question = testData[index];

        questionNumberTitle.textContent = `Question ${index + 1} of ${testData.length}`;
        questionElement.textContent = question.question;

        answerButtonsElement.innerHTML = '';
        question.answers.forEach((answer, answerIndex) => {
            const button = document.createElement('button');
            button.innerHTML = answer.text;
            button.classList.add('btn', 'answer-btn');
            button.dataset.index = answerIndex;
            if (question.userAnswer === answerIndex) {
                button.classList.add('selected');
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });

        updatePalette();
        updateNavButtons();
    }

    function selectAnswer(e) {
        const answerIndex = parseInt(e.target.dataset.index);
        testData[currentQuestionIndex].userAnswer = answerIndex;

        document.querySelectorAll('.answer-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
        
        updatePalette();
        
        setTimeout(() => {
            if (currentQuestionIndex < testData.length - 1) {
                showNextQuestion();
            }
        }, 300);
    }

    function showNextQuestion() {
        if (currentQuestionIndex < testData.length - 1) showQuestion(currentQuestionIndex + 1);
    }

    function showPrevQuestion() {
        if (currentQuestionIndex > 0) showQuestion(currentQuestionIndex - 1);
    }
    
    function updateNavButtons() {
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.disabled = currentQuestionIndex === testData.length - 1;
    }

    function buildPalette() {
        questionPalette.innerHTML = '';
        testData.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.textContent = index + 1;
            btn.classList.add('palette-btn');
            btn.dataset.index = index;
            btn.addEventListener('click', () => showQuestion(index));
            questionPalette.appendChild(btn);
        });
    }

    function updatePalette() {
        document.querySelectorAll('.palette-btn').forEach((btn, index) => {
            btn.classList.remove('current', 'answered');
            if (testData[index].userAnswer !== null) btn.classList.add('answered');
            if (index === currentQuestionIndex) btn.classList.add('current');
        });
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeRemaining <= 0) endExam("Time's up!");
        }, 1000);
    }
    
    function confirmEndExam() {
        const unanswered = testData.filter(q => q.userAnswer === null).length;
        const confirmation = window.confirm(`Are you sure you want to end the test? You have ${unanswered} unanswered questions.`);
        if (confirmation) endExam();
    }

    function endExam(message = "You have submitted the test.") {
        clearInterval(timerInterval);
        exitFullscreen();
        if (cameraFeed.srcObject) {
            cameraFeed.srcObject.getTracks().forEach(track => track.stop());
        }
        
        let finalScore = testData.reduce((score, q) => {
            return (q.userAnswer !== null && q.answers[q.userAnswer].correct) ? score + 1 : score;
        }, 0);
        
        navigateTo('results');
        resultName.textContent = studentNameInput.value;
        scoreElement.textContent = finalScore;
        totalQuestionsElement.textContent = testData.length;
        
        const percentage = (finalScore / testData.length) * 100;
        let feedback = (percentage >= 80) ? "Excellent Score!" : (percentage >= 60) ? "Good Score!" : "Room for Improvement.";
        feedbackText.textContent = `${message} ${feedback}`;
    }

    function requestFullscreen() {
        document.documentElement.requestFullscreen?.();
    }

    function exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen?.();
        }
    }

    // Initial state
    navigateTo('login');
});
