let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let undoBtn = document.querySelector("#undo-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let currentTurn = document.querySelector("#current-turn");
let scoreX = document.querySelector("#scoreX");
let scoreO = document.querySelector("#scoreO");
let modeButtons = document.querySelectorAll(".mode-btn");

let turnO = true;
let gameActive = true;
let gameMode = "pvp";
let moveHistory = [];
let scores = { X: 0, O: 0 };
let currentBoxIndex = 0;

// LocalStorage management
const STORAGE_KEY = 'ticTacToeScores';

const saveScores = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
        console.error('Failed to save scores:', error);
    }
};

const loadScores = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsedScores = JSON.parse(saved);
            if (parsedScores && typeof parsedScores.X === 'number' && typeof parsedScores.O === 'number') {
                scores = parsedScores;
                updateScores();
            }
        }
    } catch (error) {
        console.error('Failed to load scores:', error);
    }
};

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

// Initialize the game state
const initializeGame = () => {
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("winning-box");
    });
    turnO = true;
    gameActive = true;
    moveHistory = [];
    msgContainer.classList.add("hide");
    updateTurnIndicator();
};

// Update the turn indicator
const updateTurnIndicator = () => {
    currentTurn.textContent = `Player ${turnO ? "O" : "X"}'s Turn`;
    document.querySelectorAll(".score").forEach(score => {
        score.classList.remove("active");
    });
    document.querySelector(`#score${turnO ? "O" : "X"}`).parentElement.classList.add("active");
};

// Make a move
const makeMove = (box) => {
    if (!gameActive || box.innerText !== "") return;

    const symbol = turnO ? "O" : "X";
    box.innerText = symbol;
    box.disabled = true;
    moveHistory.push({ index: Array.from(boxes).indexOf(box), symbol });
    
    if (checkWinner()) {
        return;
    }

    turnO = !turnO;
    updateTurnIndicator();

    // If in computer mode and it's computer's turn
    if (gameMode === "pvc" && !turnO && gameActive) {
        setTimeout(makeComputerMove, 500);
    }
};

// Computer's move
const makeComputerMove = () => {
    if (!gameActive) return;

    // Try to win
    let move = findWinningMove("X");
    if (move === -1) {
        // Block player's winning move
        move = findWinningMove("O");
        if (move === -1) {
            // Take center if available
            if (boxes[4].innerText === "") {
                move = 4;
            } else {
                // Take any available corner
                const corners = [0, 2, 6, 8];
                const availableCorners = corners.filter(i => boxes[i].innerText === "");
                if (availableCorners.length > 0) {
                    move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
                } else {
                    // Take any available position
                    const availableMoves = Array.from(boxes)
                        .map((box, index) => box.innerText === "" ? index : -1)
                        .filter(index => index !== -1);
                    if (availableMoves.length > 0) {
                        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    }
                }
            }
        }
    }

    if (move !== -1) {
        makeMove(boxes[move]);
    }
};

// Find a winning move for a player
const findWinningMove = (symbol) => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const boxesText = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        
        // Check if two positions are filled with the symbol and one is empty
        if (boxesText.filter(text => text === symbol).length === 2 && 
            boxesText.includes("")) {
            return pattern[boxesText.indexOf("")];
        }
    }
    return -1;
};

// Check for winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        const [pos1, pos2, pos3] = pattern;
        const val1 = boxes[pos1].innerText;
        const val2 = boxes[pos2].innerText;
        const val3 = boxes[pos3].innerText;

        if (val1 && val1 === val2 && val1 === val3) {
            showWinner(val1, pattern);
            return true;
        }
    }

    // Check for draw
    if ([...boxes].every(box => box.innerText !== "")) {
        showDraw();
        return true;
    }

    return false;
};

// Show winner
const showWinner = (winner, winningPattern) => {
    scores[winner]++;
    updateScores();
    
    winningPattern.forEach(index => {
        boxes[index].classList.add("winning-box");
    });

    msg.innerText = `Player ${winner} Wins!`;
    msgContainer.classList.remove("hide");
    gameActive = false;
};

// Show draw
const showDraw = () => {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    gameActive = false;
};

// Update scores
const updateScores = () => {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    saveScores();
};

// Keyboard navigation
const handleKeyPress = (e) => {
    if (!gameActive) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            e.preventDefault();
            navigateBoard(e.key);
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            if (boxes[currentBoxIndex]) {
                makeMove(boxes[currentBoxIndex]);
            }
            break;
        case 'Escape':
            e.preventDefault();
            undoLastMove();
            break;
        case 'r':
        case 'R':
            e.preventDefault();
            initializeGame();
            break;
    }
};

const navigateBoard = (direction) => {
    const row = Math.floor(currentBoxIndex / 3);
    const col = currentBoxIndex % 3;
    let newRow = row, newCol = col;
    
    switch(direction) {
        case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
        case 'ArrowDown':
            newRow = Math.min(2, row + 1);
            break;
        case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
        case 'ArrowRight':
            newCol = Math.min(2, col + 1);
            break;
    }
    
    const newIndex = newRow * 3 + newCol;
    if (newIndex !== currentBoxIndex && newIndex >= 0 && newIndex < 9) {
        boxes[currentBoxIndex].classList.remove('keyboard-focus');
        currentBoxIndex = newIndex;
        boxes[currentBoxIndex].classList.add('keyboard-focus');
    }
};

// Undo last move
const undoLastMove = () => {
    if (moveHistory.length === 0 || !gameActive) return;

    const lastMove = moveHistory.pop();
    boxes[lastMove.index].innerText = "";
    boxes[lastMove.index].disabled = false;
    turnO = !turnO;
    updateTurnIndicator();
};

// Event Listeners
boxes.forEach((box, index) => {
    box.addEventListener("click", () => makeMove(box));
    box.addEventListener('mouseenter', () => {
        currentBoxIndex = index;
        boxes.forEach(b => b.classList.remove('keyboard-focus'));
    });
});

document.addEventListener('keydown', handleKeyPress);

// Initialize keyboard focus on first box
boxes[0].classList.add('keyboard-focus');

resetBtn.addEventListener("click", () => {
    scores = { X: 0, O: 0 };
    updateScores();
    initializeGame();
});

newGameBtn.addEventListener("click", initializeGame);

undoBtn.addEventListener("click", undoLastMove);

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        modeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        gameMode = button.dataset.mode;
    initializeGame();
    });
});

// Load scores on page load
loadScores();

// Initialize the game
initializeGame();