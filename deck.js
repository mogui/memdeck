let currentStack = 'mnemonica';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    displayStack(currentStack);
    
    // Add event listener for stack selection
    document.getElementById('stackSelect').addEventListener('change', (e) => {
        currentStack = e.target.value;
        displayStack(currentStack);
    });

    // Setup accordion
    const acc = document.querySelector('.accordion-header');
    const panel = document.querySelector('.accordion-content');
    
    acc.addEventListener('click', function() {
        this.classList.toggle('active');
        panel.classList.toggle('active');
    });
});

// Display the selected stack
function displayStack(stackName) {
    const stackDisplay = document.querySelector('.stack-display');
    stackDisplay.innerHTML = '';
    
    cardStacks[stackName].forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        const positionDiv = document.createElement('div');
        positionDiv.className = 'position';
        positionDiv.textContent = index + 1;
        const imageDiv = document.createElement('div');
        imageDiv.className = 'card-image';
        const img = document.createElement('img');
        img.src = cardImages[card];
        img.alt = card;
        imageDiv.appendChild(img);
        cardDiv.appendChild(positionDiv);
        cardDiv.appendChild(imageDiv);
        stackDisplay.appendChild(cardDiv);
    });
}
