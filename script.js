// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const biteSound = document.getElementById("biteSound");

// Game settings
const tileSize = 20;
const totalTiles = canvas.width / tileSize;
const frameRate = 15; // Frames per second

// Snake
let snake = [
    { x: Math.floor(totalTiles / 2), y: Math.floor(totalTiles / 2) }
];
let dx = 1; // Initial direction is right
let dy = 0;

// Food
let food;
resetFood();

// Score
let currentScore = 0;
let highScore = 0;
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');

const appleImg = new Image();
appleImg.src = 'apple.png'; 

const GameOverImg = new Image();
GameOverImg.src = 'GameOver.png'; 

// Game loop
let lastTime = 0;
let gameOver = false;
scoreToUpdate = 100;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    const interval = 1000 / frameRate; // Interval between frames in milliseconds
    if (deltaTime >= interval) {
        lastTime = currentTime;
        scoreToUpdate--;
        // Move the snake
        let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);

        // Check for game over
        if (isGameOver(newHead)) {
            gameOver = true;
            ctx.drawImage(GameOverImg, 0, 0, canvas.width, canvas.height);
            return; // Exit the game loop
        }

        // Check for food
        if (newHead.x === food.x && newHead.y === food.y) {
            resetFood();
            if (scoreToUpdate < 10) {
                scoreToUpdate = 10;
            }
            currentScore += scoreToUpdate; // Increase current score by 10 when food is collected
            scoreToUpdate = 100;
            updateScoreDisplay();
            biteSound.play()
        } else {
            snake.pop();
        }
        


        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the snake
        ctx.fillStyle = 'lime';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Draw the head
                ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
            } else {
                // Draw the body
                ctx.fillRect(segment.x * tileSize + 2, segment.y * tileSize + 2, tileSize - 4, tileSize - 4);
            }
        });

        // Draw the food
        ctx.fillStyle = 'red';
        ctx.drawImage(appleImg, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
    }

    // Request the next frame
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}



function isGameOver(head) {
    return (
        head.x < 0 ||
        head.x >= totalTiles ||
        head.y < 0 ||
        head.y >= totalTiles ||
        snake.some((segment, i) => i !== 0 && segment.x === head.x && segment.y === head.y)
    );
}

function resetGame() {
    snake = [{ x: Math.floor(totalTiles / 2), y: Math.floor(totalTiles / 2) }];
    dx = 1; // Reset direction to right
    dy = 0;
    resetFood();

    // Update high score if current score is higher
    if (currentScore > highScore) {
        highScore = currentScore;
    }

    currentScore = 0;
    gameOver = false;
    updateScoreDisplay();
}

function resetFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * totalTiles),
            y: Math.floor(Math.random() * totalTiles)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function updateScoreDisplay() {
    currentScoreDisplay.textContent = `Score: ${currentScore}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

// Handle user input
document.addEventListener('keydown', function (event) {
  if (event.code === 'Enter' && gameOver)
  {
    resetGame();
    requestAnimationFrame(gameLoop);
  }
    if (event.code === 'ArrowUp' && dy !== 1) {
        dx = 0; dy = -1;
    } else if (event.code === 'ArrowDown' && dy !== -1) {
        dx = 0; dy = 1;
    } else if (event.code === 'ArrowLeft' && dx !== 1) {
        dx = -1; dy = 0;
    } else if (event.code === 'ArrowRight' && dx !== -1) {
        dx = 1; dy = 0;
    }
});





// Start the game loop
resetFood();
updateScoreDisplay(); // Initialize the score display
requestAnimationFrame(gameLoop);