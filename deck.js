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
        cardDiv.innerHTML = `
            <div class="position">${index + 1}</div>
            <img src="${cardImages[card]}" alt="${card}" style="border-radius: 8px;">
        `;
        stackDisplay.appendChild(cardDiv);
    });
}
