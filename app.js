let currentStack = 'mnemonica';
let currentQuiz = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    displayStack(currentStack);
    
    // Add event listener for stack selection
    document.getElementById('stackSelect').addEventListener('change', (e) => {
        currentStack = e.target.value;
        displayStack(currentStack);
    });
});

// Display the selected stack
function displayStack(stackName) {
    const stackDisplay = document.querySelector('.stack-display');
    stackDisplay.innerHTML = '';
    
    cardStacks[stackName].forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `
            <div class="position">${index + 1}</div>
            <div class="value">${card}</div>
        `;
        stackDisplay.appendChild(cardDiv);
    });
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
            question = `At which position is the ${randomCard}?`;
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

// Generate options for quizzes
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
    const correctCut = calculateCutPoint(currentPosition, targetPosition, stack.length);
    
    let options = [correctCut];
    while (options.length < 4) {
        const randomCut = Math.floor(Math.random() * stack.length) + 1;
        if (!options.includes(randomCut)) {
            options.push(randomCut);
        }
    }
    return shuffleArray(options);
}

// Calculate the cut point needed to move a card to a target position
function calculateCutPoint(currentPos, targetPos, deckSize) {
    if (targetPos > currentPos) {
        return deckSize - (targetPos - currentPos);
    } else {
        return currentPos - targetPos;
    }
}

// Display quiz question and options
function displayQuiz(question, options) {
    const quizContainer = document.getElementById('quizContainer');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const resultElement = document.getElementById('result');

    questionElement.textContent = question;
    optionsElement.innerHTML = '';
    resultElement.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option, options[0]);
        optionsElement.appendChild(button);
    });
}

// Check if the answer is correct
function checkAnswer(selected, correct) {
    const resultElement = document.getElementById('result');
    if (selected === correct) {
        resultElement.textContent = 'Correct!';
        resultElement.className = 'correct';
    } else {
        resultElement.textContent = `Incorrect. The correct answer is ${correct}`;
        resultElement.className = 'incorrect';
    }
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
