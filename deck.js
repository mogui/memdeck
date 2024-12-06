let currentStack = 'mnemonica';

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
            <img src="${cardImages[card]}" alt="${card}">
        `;
        stackDisplay.appendChild(cardDiv);
    });
}
