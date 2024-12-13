const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const gameBoard = document.getElementById('gameBoard');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-instructions');
const highscoreList = document.getElementById('highscore-list');
let playerName = prompt("Enter your name: "); // Får personen til å skrive navnet når nettsiden starter
let timerInterval;
let timeLeft;
let score = 0;
const highScores = []; // Liste for å lagre poeng
// Funksjon for å hente og vise highscore-liste
function fetchHighscore() {
    highscoreList.innerHTML = ''; // Fjern gammel liste
    const sortedScores = [...highScores].sort((a, b) => b.score - a.score); // Sorter poeng fra høy til lav
    sortedScores.forEach((entry, index) => {
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `${index + 1}. ${entry.playerName}: ${entry.score}`;
        highscoreList.appendChild(scoreItem);
    });
    // sier hvilken som er beste, dårligste og gjennomsnittlige poeng
    if (highScores.length > 0) {
        const bestScore = Math.max(...highScores.map(s => s.score));
        const worstScore = Math.min(...highScores.map(s => s.score));
        const avgScore = Math.round(highScores.reduce((sum, s) => sum + s.score, 0) / highScores.length);
        const summary = document.createElement('p');
        summary.innerHTML = `<strong>Beste:</strong> ${bestScore}, <strong>Dårligste:</strong> ${worstScore}, <strong>Gjennomsnitt:</strong> ${avgScore}`;
        highscoreList.appendChild(summary);
    }
}
// Funksjon for å starte timeren
function startTimer(duration, onTimeUp) {
    timeLeft = duration;
    const timerDisplay = document.createElement('h3');
    timerDisplay.id = 'timer';
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    document.body.insertBefore(timerDisplay, gameBoard);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.remove();
            onTimeUp();
        }
    }, 1000);
}
// Funksjon for å stoppe timeren
function stopTimer() {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) timerDisplay.remove();
}
// Funksjon for å generere kortene basert på valgt nivå
function generateCards(level) {
    let cardArray;
    let duration;
    switch (level) {
        case 'easy':
            cardArray = symbols.slice(0, 4);
            duration = 20;
            break;
        case 'medium':
            cardArray = symbols.slice(0, 6);
            duration = 30;
            break;
        case 'hard':
            cardArray = symbols.slice(0, 8);
            duration = 60;
            break;
    }
    const cards = [...cardArray, ...cardArray];
    shuffle(cards);
    gameBoard.innerHTML = '';
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${level === 'easy' ? 4 : level === 'medium' ? 6 : 8}, 100px)`;
    let firstCard = null;
    let lockBoard = false;
    //denne cards for each har jeg brukt chatgpt - 
    // Denne koden håndterer logikken for å snu kortene, kontrollere om de matcher, 
    // og styre spillflyten (låse brettet når kort ikke matcher og sjekke for seier når de matcher).
    cards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = '<span>' + symbol + '</span>';
        card.querySelector('span').style.visibility = 'hidden';
        gameBoard.appendChild(card);
        card.addEventListener('click', () => {
            if (lockBoard || card === firstCard || card.classList.contains('flipped')) return;
            card.classList.add('flipped');
            card.querySelector('span').style.visibility = 'visible';
            if (!firstCard) {
                firstCard = card;
            } else {
                if (card.dataset.symbol === firstCard.dataset.symbol) {
                    firstCard = null;
                    checkVictory();
                } else {
                    lockBoard = true;
                    setTimeout(() => {
                        card.classList.remove('flipped');
                        firstCard.classList.remove('flipped');
                        card.querySelector('span').style.visibility = 'hidden';
                        firstCard.querySelector('span').style.visibility = 'hidden';
                        firstCard = null;
                        lockBoard = false;
                    }, 1000);
                }
            }
        });
    });
    startTimer(duration, () => {
        alert('Tiden er ute! Prøv igjen.');
        gameBoard.innerHTML = '';
        document.getElementById('difficulty-choice').style.display = 'block';
    });
}
// Funksjon for å sjekke om spilleren har vunnet
function checkVictory() {
    const allCards = document.querySelectorAll('.card');
    const allMatched = [...allCards].every(card => card.classList.contains('flipped'));
    if (allMatched) {
        stopTimer();
        setTimeout(() => {
            alert(`Gratulerer, ${playerName}! Du fullførte spillet.`);
            score = timeLeft * 10; // Enkel poenglogikk basert på gjenværende tid
            highScores.push({ playerName, score });
            fetchHighscore();
            document.getElementById('difficulty-choice').style.display = 'block'; // Vis nivåvalg
            gameBoard.style.display = 'none'; // Skjul spillebrettet
        }, 300);
    }
}
// Funksjon for å restarte spillet
function restartGame() {
    score = 0;
    gameBoard.innerHTML = ''; // Fjern alle kort
    document.getElementById('difficulty-choice').style.display = 'block'; // Vis nivåvalg
    stopTimer(); // Stopp timeren
}
// Legg til event listeners for nivåknappene
easyBtn.addEventListener('click', () => {
    generateCards('easy');
    document.getElementById('difficulty-choice').style.display = 'none';
});
mediumBtn.addEventListener('click', () => {
    generateCards('medium');
    document.getElementById('difficulty-choice').style.display = 'none';
});
hardBtn.addEventListener('click', () => {
    generateCards('hard');
    document.getElementById('difficulty-choice').style.display = 'none';
});
// Legg til en restart-knapp
const restartBtn = document.createElement('button');
restartBtn.id = 'restart-btn';
restartBtn.textContent = 'Restart Game';
document.body.appendChild(restartBtn);
// Restart-knappens event listener
restartBtn.addEventListener('click', () => {
    restartGame();
});
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.getElementById('difficulty-choice').style.display = 'block';
});
const symbols = ['🍎', '🍊', '🍇', '🍌', '🍉', '🍓', '🍒', '🥝', '🍍', '🍋', '🍑', '🍍', '🥭', '🍏', '🍒', '🍉'];
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}