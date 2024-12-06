// Settings management
function saveSettings() {
    const stackSelect = document.getElementById('stackSelect');
    const positionQuiz = document.getElementById('positionQuiz');
    const cardQuiz = document.getElementById('cardQuiz');
    const cutQuiz = document.getElementById('cutQuiz');

    // Only save if we're on the settings page
    if (stackSelect && positionQuiz && cardQuiz && cutQuiz) {
        const settings = {
            stack: stackSelect.value,
            quizTypes: {
                position: positionQuiz.checked,
                card: cardQuiz.checked,
                cut: cutQuiz.checked
            }
        };
        localStorage.setItem('memdeckSettings', JSON.stringify(settings));

        // Find other open windows
        const windows = JSON.parse(localStorage.getItem('memdeckWindows') || '[]');
        const currentTime = Date.now();
        
        // Remove windows that haven't been active for more than 1 minute
        const activeWindows = windows.filter(w => (currentTime - w.lastActive) < 60000);
        
        // Add current window if not already present
        if (!activeWindows.find(w => w.id === window.name)) {
            window.name = window.name || 'window_' + Math.random().toString(36).substr(2, 9);
            activeWindows.push({
                id: window.name,
                lastActive: currentTime
            });
        }
        
        localStorage.setItem('memdeckWindows', JSON.stringify(activeWindows));
        
        // Trigger reload in other windows
        localStorage.setItem('settingsChanged', currentTime.toString());
    }
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('memdeckSettings')) || {
        stack: 'mnemonica',
        quizTypes: {
            position: true,
            card: true,
            cut: true
        }
    };

    // Only update form elements if they exist (we're on settings page)
    const stackSelect = document.getElementById('stackSelect');
    const positionQuiz = document.getElementById('positionQuiz');
    const cardQuiz = document.getElementById('cardQuiz');
    const cutQuiz = document.getElementById('cutQuiz');

    if (stackSelect && positionQuiz && cardQuiz && cutQuiz) {
        stackSelect.value = settings.stack;
        positionQuiz.checked = settings.quizTypes.position;
        cardQuiz.checked = settings.quizTypes.card;
        cutQuiz.checked = settings.quizTypes.cut;
    }

    return settings;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    // Update window activity timestamp
    window.name = window.name || 'window_' + Math.random().toString(36).substr(2, 9);
    const windows = JSON.parse(localStorage.getItem('memdeckWindows') || '[]');
    const currentTime = Date.now();
    const activeWindows = windows.filter(w => (currentTime - w.lastActive) < 60000);
    
    const windowIndex = activeWindows.findIndex(w => w.id === window.name);
    if (windowIndex >= 0) {
        activeWindows[windowIndex].lastActive = currentTime;
    } else {
        activeWindows.push({
            id: window.name,
            lastActive: currentTime
        });
    }
    
    localStorage.setItem('memdeckWindows', JSON.stringify(activeWindows));

    // Only add event listeners if we're on the settings page
    const stackSelect = document.getElementById('stackSelect');
    const positionQuiz = document.getElementById('positionQuiz');
    const cardQuiz = document.getElementById('cardQuiz');
    const cutQuiz = document.getElementById('cutQuiz');

    if (stackSelect && positionQuiz && cardQuiz && cutQuiz) {
        stackSelect.addEventListener('change', saveSettings);
        positionQuiz.addEventListener('change', saveSettings);
        cardQuiz.addEventListener('change', saveSettings);
        cutQuiz.addEventListener('change', saveSettings);
    }
});

// Listen for settings changes from other windows
window.addEventListener('storage', (e) => {
    if (e.key === 'settingsChanged' && e.newValue) {
        if (window.location.pathname.endsWith('settings.html')) {
            // Don't reload the settings page itself
            return;
        }
        window.location.reload();
    }
});
