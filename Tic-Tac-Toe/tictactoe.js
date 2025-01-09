const board = document.getElementById('board');
const message = document.getElementById('message');
let currentPlayer = 'x';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Score = 0;
let player2Score = 0;
let player1IsX = true;
let player1Name = "Player 1";
let player2Name = "Player 2";

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function createScoreBoard() {
    const scoreboardElement = document.querySelector('.scoreboard');
    scoreboardElement.innerHTML = `
        <h2><i class="fas fa-trophy"></i> Scoreboard</h2>
        <div class="player-score">
            <span id="player1">
                <i class="fas fa-user"></i> ${player1Name}: ${player1Score}
            </span>
            <span id="player2">
                <i class="fas fa-user"></i> ${player2Name}: ${player2Score}
            </span>
        </div>
    `;
}

function updateScoreDisplay() {
    const player1Display = document.getElementById('player1');
    const player2Display = document.getElementById('player2');
    const currentTurnDisplay = document.getElementById('current-player-turn');

    player1Display.innerHTML = `<i class="fas fa-user"></i> ${player1Name}: ${player1Score}`;
    player2Display.innerHTML = `<i class="fas fa-user"></i> ${player2Name}: ${player2Score}`;

    if (gameActive) {
        const currentPlayerName = currentPlayer === (player1IsX ? 'x' : 'o') ? player1Name : player2Name;
        currentTurnDisplay.innerHTML = `<i class="fas fa-play"></i> Current Turn: ${currentPlayerName}`;
    }
}

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
    updateScoreDisplay();
    createScoreBoard();
}

function handleClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.dataset.index);

    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer.toUpperCase();
        cell.classList.add(currentPlayer);
        checkWinner();
        if (gameActive) {
            switchPlayer();
            updateScoreDisplay();
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            const winningSymbol = gameBoard[a];
            const isPlayer1Winner = (player1IsX && winningSymbol === 'x') || (!player1IsX && winningSymbol === 'o');

            combination.forEach(index => {
                const cell = board.children[index];
                cell.classList.add('winning-cell');
                if(Math.random() < 0.5){
                  cell.classList.add('wave-effect');
                }
            });

            if (isPlayer1Winner) {
                player1Score++;
                message.innerHTML = `<i class="fas fa-crown"></i> ${player1Name} wins!`;
            } else {
                player2Score++;
                message.innerHTML = `<i class="fas fa-crown"></i> ${player2Name} wins!`;
            }

            gameActive = false;
            updateScoreDisplay();
            celebrateWin();
            return;
        }
    }

    if (!gameBoard.includes('')) {
        message.classList.add('draw-message');
        message.innerHTML = "<i class='fas fa-handshake'></i> It's a draw!";
        gameActive = false;
        updateScoreDisplay();
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = '';
    document.body.classList.remove('winning-background');
    document.querySelector('.fireworks-container').innerHTML = '';
    document.querySelector('.confetti-container').innerHTML = '';
    createBoard();
}

function openNameModal() {
    const modal = document.getElementById('nameModal');
    const input1 = document.getElementById('player1Name');
    const input2 = document.getElementById('player2Name');
    input1.value = player1Name;
    input2.value = player2Name;
    modal.style.display = 'flex';
}

function closeNameModal() {
    document.getElementById('nameModal').style.display = 'none';
}

function saveNames() {
    const newName1 = document.getElementById('player1Name').value.trim();
    const newName2 = document.getElementById('player2Name').value.trim();

    if (newName1 && newName2) {
        player1Name = newName1;
        player2Name = newName2;
        updateScoreDisplay();
        createScoreBoard();
        closeNameModal();
        createBoard();
    } else {
        alert('Please enter names for both players.');
    }
}

function createFirework(x, y) {
    const colors = ['#ff0', '#f0f', '#0ff', '#ff4444', '#44ff44'];
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.fireworks-container').appendChild(firework);


    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      if(Math.random() < 0.5){
        particle.classList.add('particle--sparkle');
      } else {
        particle.classList.add('particle--trail');
      }

      const angle = (i * (360 / particleCount)) * Math.PI / 180;
      const velocity = 50 + Math.random() * 100;
      const rotation = Math.random() * 360;

      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--x', Math.cos(angle) * velocity + 'px');
      particle.style.setProperty('--y', Math.sin(angle) * velocity + 'px');
      particle.style.setProperty('--rotation', rotation + 'deg');
      document.querySelector('.fireworks-container').appendChild(particle);
    }

    setTimeout(() => {
        firework.remove();
    }, 1500);
}

function createConfetti() {
    const colors = ['#ff0', '#f0f', '#0ff', '#ff4444', '#44ff44'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.querySelector('.confetti-container').appendChild(confetti);
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function celebrateWin() {
    document.body.classList.add('winning-background');
    const celebrate = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight / 2);
        createFirework(x, y);
    }, 300);
    createConfetti();
    setTimeout(() => {
        clearInterval(celebrate);
        document.body.classList.remove('winning-background');
        document.querySelector('.fireworks-container').innerHTML = '';
        document.querySelector('.confetti-container').innerHTML = '';
    }, 3000);
}

createScoreBoard();
createBoard();

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  document.getElementById('installBanner').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Clear the saved prompt since it can't be used again
    deferredPrompt = null;
    // Hide the install button
    document.getElementById('installBanner').style.display = 'none';
  }
});
