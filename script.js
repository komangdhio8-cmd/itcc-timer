let timerInput = document.getElementById('timer');
let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let resetBtn = document.getElementById('reset');
let statusText = document.getElementById('status');

let interval = null;
let remainingSeconds = 0;
// The seconds set when the reset button is pressed.
let timeWhenReset = 0; 

// Audio for end
let endSound = new Audio('assets/sounds/timer-ended.mp3'); 

// Helper: show or hide status
function updateStatus(text) {
    if (text === '') {
        statusText.style.display = 'none';
    } else {
        statusText.style.display = 'block';
        statusText.textContent = text;
    }
}

// Play sound when timer ends
function playSound() {
    endSound.currentTime = 0;
    endSound.play();
}

// Convert input string to seconds
function parseInput(str) {
    str = str.trim();
    if (!str) return null;

    // Accept formats:
    // 1. H:M:S or M:S
    // 2. plain number in seconds
    let parts = str.split(':').map(Number);
    if (parts.some(isNaN)) return null;

    if (parts.length === 1) {
        return parts[0]; // seconds only
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
        return null;
    }
}

// Format seconds to H:MM:SS or MM:SS
function formatTime(sec) {
    let hours = Math.floor(sec / 3600);
    let mins = Math.floor((sec % 3600) / 60);
    let secs = sec % 60;
    if (hours > 0) return `${hours}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    else return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

// Update timer text to the remaining seconds.
function updateDisplay() {
    timerInput.value = formatTime(remainingSeconds);
}

//   Start button.
startBtn.addEventListener('click', () => {
    let parsed = parseInput(timerInput.value);
    if (parsed === null || parsed <= 0) {
        alert('Invalid time! Use SS, MM:SS, or HH:MM:SS.');
        return;
    }
    remainingSeconds = parsed;

    timerInput.disabled = true;
    updateStatus(''); 
    updateDisplay();

    if (!interval) {
        interval = setInterval(() => {
            remainingSeconds--;
            updateDisplay();
            if (remainingSeconds <= 0) {
                clearInterval(interval);
                interval = null;
                timerInput.disabled = false;
                updateStatus('ENDED');
                playSound(); 
            }
        }, 1000);
    }
});

// Update timeWhenReset whenever user types a new value.
timerInput.addEventListener('input', () => {
    let parsed = parseInput(timerInput.value);
    if (parsed !== null && parsed > 0) {
        timeWhenReset = parsed;
    }
});

// Pause
pauseBtn.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    timerInput.disabled = false;
    updateStatus('PAUSED'); 
});

// Reset
resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    remainingSeconds = timeWhenReset || 0;
    updateDisplay();
    timerInput.disabled = false;
    updateStatus('PAUSED');
});

// Initialize display and status
updateDisplay();
updateStatus('PAUSED');
