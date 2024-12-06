let currentStack = 'mnemonica';
let currentQuiz = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for stack selection
    document.getElementById('stackSelect').addEventListener('change', (e) => {
        currentStack = e.target.value;
    });

    // Setup accordion
    const acc = document.querySelector('.accordion-header');
    const panel = document.querySelector('.accordion-content');
    
    acc.addEventListener('click', function() {
        this.classList.toggle('active');
        panel.classList.toggle('active');
    });

    // Open accordion by default on quiz page
    acc.classList.add('active');
    panel.classList.add('active');
});

function startNextQuiz() {
    const availableQuizTypes = [];
    if (document.getElementById('positionQuiz').checked) availableQuizTypes.push('position');
    if (document.getElementById('cardQuiz').checked) availableQuizTypes.push('card');
    if (document.getElementById('cutQuiz').checked) availableQuizTypes.push('cut');

    if (availableQuizTypes.length === 0) {
        alert('Please select at least one quiz type');
        return;
    }

    const randomType = availableQuizTypes[Math.floor(Math.random() * availableQuizTypes.length)];
    startQuiz(randomType);
    
    // Change button text after first quiz starts
    document.getElementById('nextQuizBtn').textContent = 'Next Quiz';
}

// Start a new quiz
function startQuiz(type) {
    currentQuiz = type;
    const stack = cardStacks[currentStack];
    let question, options;

    switch(type) {
        case 'position':
            const randomPosition = Math.floor(Math.random() * stack.length) + 1;
            question = `Which card is at position ${randomPosition}?`;
            options = generateOptions(stack[randomPosition - 1], stack);
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
            options = generatePositionOptions(stack.indexOf(randomCard) + 1, stack.length);
            break;
        case 'cut':
            const targetCard = stack[Math.floor(Math.random() * stack.length)];
            const targetPosition = Math.floor(Math.random() * stack.length) + 1;
            question = `Where should you cut to get the ${targetCard} to position ${targetPosition}?`;
            options = generateCutOptions(stack, targetCard, targetPosition);
            break;
    }

    displayQuiz(question, options);
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

function generateCutOptions(stack, targetCard, targetPosition) {
    const currentPosition = stack.indexOf(targetCard) + 1;
    const correctCutPosition = calculateCutPoint(currentPosition, targetPosition, stack.length);
    const correctCutCard = stack[correctCutPosition - 1];
    
    let options = [correctCutCard];
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

function displayQuiz(question, options) {
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
        button.onclick = () => checkAnswer(option, options[0]);
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
