// Snake Game using p5.js

// Game constants
const GRID_SIZE = 20;
let GRID_WIDTH, GRID_HEIGHT;

// Speed settings
const SPEED_SLOW = 5;
const SPEED_MEDIUM = 10;
const SPEED_FAST = 15;
let currentSpeed = SPEED_MEDIUM;

// Game variables
let snake;
let food;
let score;
let gameOver;
let direction;
let speedButtons = [];
let growthQueue = 0;

function setup() {
    // Create canvas that fits in the container
    const gameContainer = document.getElementById('game-canvas');
    const canvas = createCanvas(gameContainer.offsetWidth, 400);
    canvas.parent('game-canvas');
    
    // Calculate grid dimensions
    GRID_WIDTH = floor(width / GRID_SIZE);
    GRID_HEIGHT = floor(height / GRID_SIZE);
    
    // Create speed buttons
    createSpeedButtons();
    
    // Initialize game
    resetGame();
    
    // Set frame rate
    frameRate(currentSpeed);
}

function createSpeedButtons() {
    // Create speed button elements
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'speed-buttons';
    buttonContainer.style.marginBottom = '10px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '10px';
    
    // Slow button
    const slowBtn = document.createElement('button');
    slowBtn.textContent = 'Slow';
    slowBtn.className = 'speed-btn';
    slowBtn.style.padding = '5px 15px';
    slowBtn.style.cursor = 'pointer';
    slowBtn.onclick = () => changeSpeed(SPEED_SLOW);
    
    // Medium button
    const mediumBtn = document.createElement('button');
    mediumBtn.textContent = 'Medium';
    mediumBtn.className = 'speed-btn';
    mediumBtn.style.padding = '5px 15px';
    mediumBtn.style.cursor = 'pointer';
    mediumBtn.onclick = () => changeSpeed(SPEED_MEDIUM);
    
    // Fast button
    const fastBtn = document.createElement('button');
    fastBtn.textContent = 'Fast';
    fastBtn.className = 'speed-btn';
    fastBtn.style.padding = '5px 15px';
    fastBtn.style.cursor = 'pointer';
    fastBtn.onclick = () => changeSpeed(SPEED_FAST);
    
    // Add buttons to container
    buttonContainer.appendChild(slowBtn);
    buttonContainer.appendChild(mediumBtn);
    buttonContainer.appendChild(fastBtn);
    
    // Add container before the canvas
    const gameContainer = document.getElementById('game-canvas');
    gameContainer.parentNode.insertBefore(buttonContainer, gameContainer);
    
    // Store buttons for updating active state
    speedButtons = [
        { element: slowBtn, speed: SPEED_SLOW },
        { element: mediumBtn, speed: SPEED_MEDIUM },
        { element: fastBtn, speed: SPEED_FAST }
    ];
    
    // Set initial active button
    updateActiveButton();
}

function changeSpeed(speed) {
    currentSpeed = speed;
    frameRate(currentSpeed);
    updateActiveButton();
}

function updateActiveButton() {
    // Update button styles based on current speed
    speedButtons.forEach(btn => {
        if (btn.speed === currentSpeed) {
            btn.element.style.backgroundColor = '#6200ea';
            btn.element.style.color = 'white';
        } else {
            btn.element.style.backgroundColor = '#f0f0f0';
            btn.element.style.color = 'black';
        }
    });
}

function draw() {
    background(240);
    
    if (!gameOver) {
        // Move snake
        if (!moveSnake()) {
            gameOver = true;
        }
        
        // Check if snake ate food
        if (snake[0].x === food.x && snake[0].y === food.y) {
            eatFood();
        }
    }
    
    // Draw grid
    drawGrid();
    
    // Draw snake
    drawSnake();
    
    // Draw food
    drawFood();
    
    // Draw score
    drawScore();
    
    // Draw game over message
    if (gameOver) {
        drawGameOver();
    }
}

function resetGame() {
    // Initialize snake at the center
    snake = [];
    snake.push({
        x: floor(GRID_WIDTH / 2),
        y: floor(GRID_HEIGHT / 2)
    });
    
    // Set initial direction (right)
    direction = { x: 1, y: 0 };
    
    // Create food
    createFood();
    
    // Reset score
    score = 0;
    
    // Reset game state
    gameOver = false;
    
    // Initialize growth queue
    growthQueue = 0;
}

function moveSnake() {
    // Calculate new head position
    const head = { 
        x: (snake[0].x + direction.x) % GRID_WIDTH,
        y: (snake[0].y + direction.y) % GRID_HEIGHT
    };
    
    // Handle negative values (wrap around)
    if (head.x < 0) head.x = GRID_WIDTH - 1;
    if (head.y < 0) head.y = GRID_HEIGHT - 1;
    
    // Check if snake hit itself
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return false;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Remove tail unless we have pending growth
    if (growthQueue > 0) {
        growthQueue--;
    } else {
        snake.pop();
    }
    
    return true;
}

function createFood() {
    food = {
        x: floor(random(GRID_WIDTH)),
        y: floor(random(GRID_HEIGHT)),
    };
    
    // Make sure food doesn't spawn on snake
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            createFood();
            break;
        }
    }
}

function eatFood() {
    // Grow the snake by 3 segments when eating food
    growthQueue += 3;
    score++;
    createFood();
}

function drawGrid() {
    stroke(200);
    strokeWeight(1);
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += GRID_SIZE) {
        line(x, 0, x, height);
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += GRID_SIZE) {
        line(0, y, width, y);
    }
}

function drawSnake() {
    noStroke();
    
    // Draw each segment of the snake
    for (let i = 0; i < snake.length; i++) {
        // Head is a different color, body segments get darker as they go back
        if (i === 0) {
            fill(0, 255, 0); // Head color
        } else {
            // Create a gradient effect for the body
            const greenValue = max(50, 200 - (i * 5));
            fill(0, greenValue, 0);
        }
        
        rect(
            snake[i].x * GRID_SIZE,
            snake[i].y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE
        );
    }
}

function drawFood() {
    fill(255, 0, 0);
    noStroke();
    rect(
        food.x * GRID_SIZE,
        food.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
    );
}

function drawScore() {
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 10, 10);
}

function drawGameOver() {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2 - 20);
    
    textSize(16);
    text('Press R to restart', width / 2, height / 2 + 20);
}

function keyPressed() {
    // Game controls
    if (gameOver) {
        if (key === 'r' || key === 'R') {
            resetGame();
        }
    } else {
        if (keyCode === UP_ARROW && direction.y === 0) {
            direction = { x: 0, y: -1 };
        } else if (keyCode === DOWN_ARROW && direction.y === 0) {
            direction = { x: 0, y: 1 };
        } else if (keyCode === LEFT_ARROW && direction.x === 0) {
            direction = { x: -1, y: 0 };
        } else if (keyCode === RIGHT_ARROW && direction.x === 0) {
            direction = { x: 1, y: 0 };
        } else if (key === '1') {
            changeSpeed(SPEED_SLOW);
        } else if (key === '2') {
            changeSpeed(SPEED_MEDIUM);
        } else if (key === '3') {
            changeSpeed(SPEED_FAST);
        }
    }
    
    // Prevent default behavior for arrow keys
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || 
        keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        return false;
    }
} 