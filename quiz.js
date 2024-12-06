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

    // Add event listener for stack selection
    const stackSelect = document.getElementById('stackSelect');
    if (stackSelect) {
        stackSelect.addEventListener('change', (e) => {
            currentStack = e.target.value;
        });
    }

    // Setup accordion
    const acc = document.querySelector('.accordion-header');
    const panel = document.querySelector('.accordion-content');
    
    if (acc && panel) {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            panel.classList.toggle('active');
        });

        // Open accordion by default on quiz page
        acc.classList.add('active');
        panel.classList.add('active');
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
    const stack = cardStacks[currentStack];
    let question, options, correctAnswer;

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

    questionElement.innerHTML = '';
    if (Array.isArray(question)) {
        question.forEach(element => questionElement.appendChild(element));
    } else {
        questionElement.textContent = question;
    }
    optionsElement.innerHTML = '';
    resultElement.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        if (currentQuiz === 'position' || currentQuiz === 'cut') {
            button.innerHTML = `<img src="${cardImages[option]}" alt="${option}" style="height: 150px; vertical-align: middle;">`;
        } else {
            button.textContent = option;
        }
        button.onclick = () => checkAnswer(option, correctAnswer);
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selected, correct) {
    const resultElement = document.getElementById('result');
    if (selected === correct) {
        resultElement.textContent = 'Correct!';
        resultElement.className = 'correct';
        setTimeout(() => {
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
