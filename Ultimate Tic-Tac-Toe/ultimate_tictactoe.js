const gameBoard = document.getElementById("game-board");
const gameStatus = document.getElementById("game-status");
const resetButton = document.getElementById("reset-button");
const changeNamesButton = document.getElementById('change-names');
const currentTurnDisplay = document.getElementById('current-player-turn');

// Game state variables
let currentBigCell = null;
const players = ["X", "O"];
let currentPlayer = 0;
let bigGrid = Array(9).fill(null);
let smallGrids = Array(9).fill(null).map(() => Array(9).fill(null));
let gameEnded = false;
let scores = { X: 0, O: 0, draws: 0 };
let player1Name = "Player 1";
let player2Name = "Player 2";

// Winning combinations for checking
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-message');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function hideToast() {
    document.getElementById('toast-message').classList.remove('show');
}

function markWonGrid(gridIndex, winner) {
    const grid = document.querySelectorAll('.small-grid')[gridIndex];
    console.log("Marking grid:", gridIndex, "as won by", winner);
    
    if (winner === 'X') {
        grid.style.backgroundColor = 'rgba(0, 255, 255, 0.6)'; // subtle blue
    } else if (winner === 'O') {
        grid.style.backgroundColor = 'rgba(255, 0, 255, 0.6)'; // subtle pink
    }
}

function checkSmallGridWin(grid) {
    for (let [a, b, c] of WINNING_COMBINATIONS) {
        if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
            return grid[a];
        }
    }
    return null;
}

function checkBigGridWin() {
    for (let [a, b, c] of WINNING_COMBINATIONS) {
        if (bigGrid[a] && bigGrid[a] === bigGrid[b] && bigGrid[a] === bigGrid[c]) {
            return bigGrid[a];
        }
    }
    return null;
}

function initializeGame() {
    gameBoard.innerHTML = '';
    bigGrid.fill(null);
    smallGrids = Array(9).fill(null).map(() => Array(9).fill(null));
    gameEnded = false;
    currentBigCell = null;
    currentPlayer = 0;

    // Create game board
    for (let i = 0; i < 9; i++) {
        const bigCell = document.createElement('div');
        bigCell.classList.add('small-grid');
        bigCell.dataset.gridIndex = i;

        for (let j = 0; j < 9; j++) {
            const smallCell = document.createElement('div');
            smallCell.classList.add('small-grid-cell');
            smallCell.dataset.bigCell = i;
            smallCell.dataset.smallCell = j;
            smallCell.addEventListener('click', handlePlayerMove);
            bigCell.appendChild(smallCell);
        }
        gameBoard.appendChild(bigCell);
    }

    updateGridHighlight();
    updateScoreboard();
    updateCurrentTurnDisplay();
    gameStatus.textContent = '';
}

function updateScoreboard() {
    const scoreboardElement = document.querySelector('.scoreboard');
    scoreboardElement.innerHTML = `
        <h2><i class="fas fa-trophy"></i> Scoreboard</h2>
        <div class="player-score">
            <span id="player1" class="${currentPlayer === 0 ? 'active-player' : ''}">
                <i class="fas fa-user"></i> ${player1Name} (X): ${scores.X}
            </span>
            <span id="player2" class="${currentPlayer === 1 ? 'active-player' : ''}">
                <i class="fas fa-user"></i> ${player2Name} (O): ${scores.O}
            </span>
            <span id="draws">
                <i class="fas fa-handshake"></i> Draws: ${scores.draws}
            </span>
        </div>
    `;
}

function updateCurrentTurnDisplay() {
    const currentPlayerName = currentPlayer === 0 ? player1Name : player2Name;
    const symbol = players[currentPlayer];
    currentTurnDisplay.innerHTML = `
        <i class="fas fa-play"></i> 
        Current Turn: ${currentPlayerName} (${symbol})
    `;
}

function handlePlayerMove(event) {
    if (gameEnded) return;
    
    const target = event.target;
    if (target.classList.contains("X") || target.classList.contains("O")) return;
    
    const parentBigCell = parseInt(target.dataset.bigCell, 10);
    const smallCellIndex = parseInt(target.dataset.smallCell, 10);

    if (currentBigCell !== null && parentBigCell !== currentBigCell) {
        showToast("Invalid move! Play in the highlighted grid.");
        return;
    }

    const currentMark = players[currentPlayer];
    target.classList.add(currentMark);
    smallGrids[parentBigCell][smallCellIndex] = currentMark;

    const smallGridWinner = checkSmallGridWin(smallGrids[parentBigCell]);
    if (smallGridWinner && !bigGrid[parentBigCell]) {
        bigGrid[parentBigCell] = smallGridWinner;
        markWonGrid(parentBigCell, smallGridWinner);
    }

    const nextGridFull = smallGrids[smallCellIndex].every(cell => cell !== null);
    if (nextGridFull) {
        currentBigCell = null;
        showToast("Next grid is full! Play anywhere!");
    } else {
        currentBigCell = smallCellIndex;
    }

    const bigGridWinner = checkBigGridWin();
    if (bigGridWinner) {
        handleGameEnd(bigGridWinner);
        return;
    }

    if (checkForDraw()) {
        handleGameEnd('draw');
        return;
    }

    currentPlayer = 1 - currentPlayer;
    updateGridHighlight();
    updateCurrentTurnDisplay();
}

function handleGameEnd(result) {
    gameEnded = true;
    gameBoard.classList.add('game-ended');

    if (result === 'draw') {
        scores.draws++;
        gameStatus.textContent = "It's a draw!";
        showToast("Game ended in a draw!", 5000);
    } else {
        const winnerName = result === 'X' ? player1Name : player2Name;
        scores[result]++;
        gameStatus.textContent = `${winnerName} wins!`;
        showToast(`Congratulations ${winnerName}!`, 5000);
    }

    updateScoreboard();
}

function updateGridHighlight() {
    const bigCells = document.querySelectorAll(".small-grid");
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.toggle("active-grid", 
            currentBigCell === null || index === currentBigCell);
    });
}

function checkForDraw() {
    return bigGrid.every((cell, index) => 
        cell !== null || smallGrids[index].every(smallCell => smallCell !== null));
}

function resetGame() {
    gameEnded = false;
    gameBoard.classList.remove('game-ended');
    initializeGame();
}

function openNameModal() {
    const modal = document.getElementById('nameModal');
    document.getElementById('player1Name').value = player1Name;
    document.getElementById('player2Name').value = player2Name;
    modal.style.display = 'flex';
}

function closeNameModal() {
    document.getElementById('nameModal').style.display = 'none';
}

function saveNames() {
    const newName1 = document.getElementById('player1Name').value.trim();
    const newName2 = document.getElementById('player2Name').value.trim();
    
    if (!newName1 || !newName2) {
        showToast('Please enter names for both players');
        return;
    }
    
    player1Name = newName1;
    player2Name = newName2;
    updateScoreboard();
    updateCurrentTurnDisplay();
    closeNameModal();
    showToast('Player names updated!');
}

// Event Listeners
resetButton.addEventListener('click', resetGame);
changeNamesButton.addEventListener('click', openNameModal);

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});
