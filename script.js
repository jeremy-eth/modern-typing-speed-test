document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sampleTextElement = document.getElementById('sample-text');
    const inputField = document.getElementById('input-field');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const timeElement = document.getElementById('time');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const resultsElement = document.getElementById('results');

    // Sample texts for typing
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
        "In a world of digital transformation, typing speed and accuracy are essential skills. Practice makes perfect, and consistent effort leads to improvement in both speed and precision.",
        "Programming is the art of telling another human what one wants the computer to do. It requires logical thinking, problem-solving abilities, and attention to detail.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. Every expert was once a beginner, and every master started as an apprentice."
    ];

    let timeLeft = 60;
    let timer = null;
    let isTestActive = false;
    let startTime = null;
    let totalTypedChars = 0;
    let correctTypedChars = 0;

    // Initialize the test
    function initializeTest() {
        const randomIndex = Math.floor(Math.random() * sampleTexts.length);
        sampleTextElement.textContent = sampleTexts[randomIndex];
        inputField.value = '';
        timeLeft = 60;
        isTestActive = false;
        startTime = null;
        totalTypedChars = 0;
        correctTypedChars = 0;
        
        // Reset displays
        timeElement.textContent = timeLeft;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        
        // Reset buttons
        startButton.disabled = false;
        resetButton.disabled = true;
        inputField.disabled = true;
        
        // Hide results
        resultsElement.style.display = 'none';
    }

    // Start the typing test
    function startTest() {
        isTestActive = true;
        startTime = new Date().getTime();
        inputField.disabled = false;
        startButton.disabled = true;
        resetButton.disabled = false;
        inputField.focus();

        // Start timer
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }

    // End the typing test
    function endTest() {
        isTestActive = false;
        clearInterval(timer);
        inputField.disabled = true;
        
        // Calculate final results
        const timeTaken = (new Date().getTime() - startTime) / 1000;
        const wordsTyped = inputField.value.trim().split(/\s+/).length;
        const wpm = Math.round((wordsTyped / timeTaken) * 60);
        const accuracy = Math.round((correctTypedChars / totalTypedChars) * 100) || 0;

        // Update display
        wpmElement.textContent = wpm;
        accuracyElement.textContent = accuracy;

        // Show results
        displayResults(wpm, accuracy);
    }

    // Display the final results
    function displayResults(wpm, accuracy) {
        resultsElement.style.display = 'block';
        const resultMetrics = resultsElement.querySelector('.result-metrics');
        resultMetrics.innerHTML = `
            <div class="metric-box">
                <span class="metric-value">${wpm}</span>
                <span class="metric-label">Final WPM</span>
            </div>
            <div class="metric-box">
                <span class="metric-value">${accuracy}%</span>
                <span class="metric-label">Final Accuracy</span>
            </div>
        `;
    }

    // Check typing accuracy in real-time
    function checkAccuracy() {
        const sampleText = sampleTextElement.textContent;
        const userInput = inputField.value;
        totalTypedChars = userInput.length;
        correctTypedChars = 0;

        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === sampleText[i]) {
                correctTypedChars++;
            }
        }

        // Update accuracy
        const currentAccuracy = Math.round((correctTypedChars / totalTypedChars) * 100) || 0;
        accuracyElement.textContent = currentAccuracy;

        // Update WPM
        if (startTime) {
            const timeElapsed = (new Date().getTime() - startTime) / 1000;
            const wordsTyped = userInput.trim().split(/\s+/).length;
            const currentWpm = Math.round((wordsTyped / timeElapsed) * 60);
            wpmElement.textContent = currentWpm;
        }
    }

    // Event Listeners
    startButton.addEventListener('click', startTest);
    resetButton.addEventListener('click', initializeTest);
    inputField.addEventListener('input', () => {
        if (isTestActive) {
            checkAccuracy();
        }
    });

    // Initialize the test when the page loads
    initializeTest();
});
