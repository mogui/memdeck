let currentStack = 'mnemonica';
let currentQuiz = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load settings
    const settings = loadSettings();
    currentStack = settings.stack;

    // Update current stack display
    const currentStackDisplay = document.getElementById('currentStack');
    if (currentStackDisplay) {
        currentStackDisplay.textContent = `Current Stack: ${currentStack}`;
    }
});

function startNextQuiz() {
    // Load current settings
    const settings = loadSettings();
    const availableQuizTypes = [];
    if (settings.quizTypes.position) availableQuizTypes.push('position');
    if (settings.quizTypes.card) availableQuizTypes.push('card');
    if (settings.quizTypes.cut) availableQuizTypes.push('cut');

    if (availableQuizTypes.length === 0) {
        alert('Please enable at least one quiz type in Settings');
        return;
    }

    const randomType = availableQuizTypes[Math.floor(Math.random() * availableQuizTypes.length)];
    startQuiz(randomType);
    
    // Change button text after first quiz starts
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    if (nextQuizBtn) {
        nextQuizBtn.textContent = 'Next Quiz';
    }
}

// Start a new quiz
function startQuiz(type) {
    currentQuiz = type;
    const settings = loadSettings();
    currentStack = settings.stack;
    const stack = cardStacks[currentStack];
    let question, options, correctAnswer;

    const quizContainer = document.getElementById('quizContainer');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const resultElement = document.getElementById('result');

    if (!quizContainer || !questionElement || !optionsElement || !resultElement) {
        console.error('Quiz elements not found');
        return;
    }

    switch(type) {
        case 'position':
            const randomPosition = Math.floor(Math.random() * stack.length) + 1;
            question = `Which card is at position ${randomPosition}?`;
            correctAnswer = stack[randomPosition - 1];
            options = generateOptions(correctAnswer, stack);
            break;
        case 'card':
            const randomCard = stack[Math.floor(Math.random() * stack.length)];
            const questionText = document.createElement('span');
            questionText.textContent = 'At which position is ';
            const cardImage = document.createElement('img');
            cardImage.src = cardImages[randomCard];
            cardImage.alt = randomCard;
            cardImage.style.height = '150px';
            question = [questionText, cardImage, document.createTextNode('?')];
            correctAnswer = stack.indexOf(randomCard) + 1;
            options = generatePositionOptions(correctAnswer, stack.length);
            break;
        case 'cut':
            const targetCard = stack[Math.floor(Math.random() * stack.length)];
            const targetPosition = Math.floor(Math.random() * stack.length) + 1;
            question = `Where should you cut to get the ${targetCard} to position ${targetPosition}?`;
            const currentPosition = stack.indexOf(targetCard) + 1;
            const correctCutPosition = calculateCutPoint(currentPosition, targetPosition, stack.length);
            correctAnswer = stack[correctCutPosition - 1];
            options = generateCutOptions(correctAnswer, stack);
            break;
    }

    displayQuiz(question, options, correctAnswer);
}

function generateOptions(correctAnswer, stack) {
    let options = [correctAnswer];
    while (options.length < 4) {
        const randomCard = stack[Math.floor(Math.random() * stack.length)];
        if (!options.includes(randomCard)) {
            options.push(randomCard);
        }
    }
    return shuffleArray(options);
}

function generatePositionOptions(correctPosition, maxPosition) {
    let options = [correctPosition];
    while (options.length < 4) {
        const randomPosition = Math.floor(Math.random() * maxPosition) + 1;
        if (!options.includes(randomPosition)) {
            options.push(randomPosition);
        }
    }
    return shuffleArray(options);
}

function generateCutOptions(correctAnswer, stack) {
    let options = [correctAnswer];
    while (options.length < 4) {
        const randomPosition = Math.floor(Math.random() * stack.length);
        const randomCard = stack[randomPosition];
        if (!options.includes(randomCard)) {
            options.push(randomCard);
        }
    }
    return shuffleArray(options);
}

function calculateCutPoint(currentPos, targetPos, deckSize) {
    if (targetPos > currentPos) {
        return deckSize - (targetPos - currentPos);
    } else {
        return currentPos - targetPos;
    }
}

function displayQuiz(question, options, correctAnswer) {
    const quizContainer = document.getElementById('quizContainer');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const resultElement = document.getElementById('result');

    if (!quizContainer || !questionElement || !optionsElement || !resultElement) {
        console.error('Quiz elements not found in displayQuiz');
        return;
    }

    // Clear previous content
    questionElement.innerHTML = '';
    optionsElement.innerHTML = '';
    resultElement.innerHTML = '';

    // Display question
    if (Array.isArray(question)) {
        question.forEach(element => questionElement.appendChild(element));
    } else {
        questionElement.textContent = question;
    }

    // Create and display options
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        if (currentQuiz === 'position' || currentQuiz === 'cut') {
            const img = document.createElement('img');
            img.src = cardImages[option];
            img.alt = option;
            img.style.height = '150px';
            img.style.verticalAlign = 'middle';
            button.appendChild(img);
        } else {
            button.textContent = option;
        }
        
        // Use touchend for mobile and click for desktop
        const handleSelection = (e) => {
            e.preventDefault(); // Prevent default touch behavior
            
            // Remove selected class from all buttons
            optionsElement.querySelectorAll('.quiz-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            button.classList.add('selected');
            
            // Check answer after a short delay
            setTimeout(() => {
                checkAnswer(option, correctAnswer);
                // Remove selected class after checking
                button.classList.remove('selected');
            }, 100);
        };
        
        button.addEventListener('touchend', handleSelection, { passive: false });
        button.addEventListener('click', handleSelection);
        
        optionsElement.appendChild(button);
    });

    // Make sure the quiz container is visible
    quizContainer.style.display = 'block';
}

function checkAnswer(selected, correct) {
    const resultElement = document.getElementById('result');
    if (!resultElement) return;

    if (selected === correct) {
        resultElement.textContent = 'Correct!';
        resultElement.className = 'correct';
        setTimeout(() => {
            // Remove any remaining selected states before starting next quiz
            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            startNextQuiz();
        }, 1000);
    } else {
        resultElement.textContent = 'Incorrect. Try again!';
        resultElement.className = 'incorrect';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadSettings() {
    const settings = localStorage.getItem('memdeckSettings');
    return settings ? JSON.parse(settings) : { stack: 'mnemonica', quizTypes: { position: true, card: true, cut: true } };
}
