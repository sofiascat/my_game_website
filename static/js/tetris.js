// Tetris Game using p5.js

// Game constants
const GRID_SIZE = 30;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const WIDTH = GRID_WIDTH * GRID_SIZE;
const HEIGHT = GRID_HEIGHT * GRID_SIZE;
const SIDEBAR_WIDTH = 100; // Reduced sidebar width

// Difficulty levels
const DIFFICULTY = {
  EASY: { speed: 800, label: "Easy" },
  MEDIUM: { speed: 500, label: "Medium" },
  HARD: { speed: 300, label: "Hard" }
};

// Game variables
let grid = [];
let currentPiece;
let nextPiece;
let heldPiece = null; // New variable for held piece
let canHold = true; // Flag to prevent multiple holds in a row
let score = 0;
let highScore = 0; // New variable for high score
let level = 1;
let linesCleared = 0;
let gameState = "start"; // start, playing, paused, gameOver
let lastMoveTime = 0;
let currentDifficulty = DIFFICULTY.MEDIUM; // Default difficulty
let sparkleParticles = [];
let backgroundStars = []; // New array for background stars

// Tetromino shapes and colors
const TETROMINOS = [
  {
    // I piece
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: [0, 255, 255] // Cyan
  },
  {
    // J piece
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: [0, 0, 255] // Blue
  },
  {
    // L piece
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: [255, 165, 0] // Orange
  },
  {
    // O piece
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: [255, 255, 0] // Yellow
  },
  {
    // S piece
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: [0, 255, 0] // Green
  },
  {
    // T piece
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: [128, 0, 128] // Purple
  },
  {
    // Z piece
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: [255, 0, 0] // Red
  }
];

// Sparkle particle class
class Sparkle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = random(3, 8);
    this.color = color;
    this.alpha = 255;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.lifetime = random(20, 40);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 255 / this.lifetime;
    this.lifetime--;
  }
  
  draw() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    circle(this.x, this.y, this.size);
  }
  
  isDead() {
    return this.lifetime <= 0;
  }
}

// Star class for background decoration
class Star {
  constructor() {
    this.x = random(WIDTH, WIDTH + SIDEBAR_WIDTH);
    this.y = random(HEIGHT);
    this.size = random(1, 3);
    this.brightness = random(100, 200);
    this.twinkleSpeed = random(0.02, 0.05);
    this.angle = random(TWO_PI);
  }
  
  update() {
    this.angle += this.twinkleSpeed;
    this.brightness = 150 + sin(this.angle) * 50;
  }
  
  draw() {
    fill(this.brightness);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

// Initialize the game grid
function initGrid() {
  grid = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push(null);
    }
    grid.push(row);
  }
}

// Create a new tetromino piece
function createPiece() {
  const pieceType = floor(random(TETROMINOS.length));
  return {
    type: pieceType,
    shape: TETROMINOS[pieceType].shape,
    color: TETROMINOS[pieceType].color,
    x: floor(GRID_WIDTH / 2) - floor(TETROMINOS[pieceType].shape.length / 2),
    y: 0
  };
}

// Check if the piece can move to the specified position
function canMoveTo(piece, offsetX, offsetY, newShape = null) {
  const shape = newShape || piece.shape;
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        
        // Check boundaries
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
          return false;
        }
        
        // Check collision with placed pieces
        if (newY >= 0 && grid[newY][newX] !== null) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Rotate a piece
function rotatePiece(piece) {
  const newShape = [];
  const size = piece.shape.length;
  
  for (let y = 0; y < size; y++) {
    newShape.push([]);
    for (let x = 0; x < size; x++) {
      newShape[y][x] = piece.shape[size - 1 - x][y];
    }
  }
  
  if (canMoveTo(piece, 0, 0, newShape)) {
    piece.shape = newShape;
  }
}

// Place the current piece on the grid
function placePiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const gridY = currentPiece.y + y;
        const gridX = currentPiece.x + x;
        
        // Game over if piece is placed outside the visible grid
        if (gridY < 0) {
          gameState = "gameOver";
          // Update high score if current score is higher
          if (score > highScore) {
            highScore = score;
          }
          return;
        }
        
        grid[gridY][gridX] = currentPiece.color;
        
        // Add sparkles at the placed block
        for (let i = 0; i < 5; i++) {
          sparkleParticles.push(new Sparkle(
            gridX * GRID_SIZE + GRID_SIZE/2,
            gridY * GRID_SIZE + GRID_SIZE/2,
            currentPiece.color
          ));
        }
      }
    }
  }
  
  // Check for completed lines
  checkLines();
  
  // Create new piece
  currentPiece = nextPiece;
  nextPiece = createPiece();
  
  // Reset hold flag
  canHold = true;
}

// Hold the current piece
function holdPiece() {
  if (!canHold) return;
  
  if (heldPiece === null) {
    // First hold - store current piece and get a new one
    heldPiece = {
      type: currentPiece.type,
      shape: TETROMINOS[currentPiece.type].shape,
      color: TETROMINOS[currentPiece.type].color
    };
    currentPiece = nextPiece;
    nextPiece = createPiece();
  } else {
    // Swap current piece with held piece
    const temp = {
      type: currentPiece.type,
      shape: TETROMINOS[currentPiece.type].shape,
      color: TETROMINOS[currentPiece.type].color
    };
    
    currentPiece = {
      type: heldPiece.type,
      shape: heldPiece.shape,
      color: heldPiece.color,
      x: floor(GRID_WIDTH / 2) - floor(heldPiece.shape.length / 2),
      y: 0
    };
    
    heldPiece = temp;
  }
  
  // Prevent multiple holds in a row
  canHold = false;
  
  // Add sparkle effect
  for (let i = 0; i < 20; i++) {
    sparkleParticles.push(new Sparkle(
      WIDTH + SIDEBAR_WIDTH/2,
      150,
      [255, 255, 255]
    ));
  }
}

// Check for completed lines
function checkLines() {
  let linesCompleted = 0;
  
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    let lineComplete = true;
    
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] === null) {
        lineComplete = false;
        break;
      }
    }
    
    if (lineComplete) {
      linesCompleted++;
      
      // Add sparkles for the completed line
      for (let x = 0; x < GRID_WIDTH; x++) {
        for (let i = 0; i < 10; i++) {
          sparkleParticles.push(new Sparkle(
            x * GRID_SIZE + GRID_SIZE/2,
            y * GRID_SIZE + GRID_SIZE/2,
            grid[y][x]
          ));
        }
      }
      
      // Remove the line
      grid.splice(y, 1);
      
      // Add a new empty line at the top
      let newRow = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        newRow.push(null);
      }
      grid.unshift(newRow);
      
      // Check the same line again (since we removed a line)
      y++;
    }
  }
  
  if (linesCompleted > 0) {
    // Update score and level
    linesCleared += linesCompleted;
    score += linesCompleted * linesCompleted * 100 * level;
    level = floor(linesCleared / 10) + 1;
  }
}

// Draw the game grid
function drawGrid() {
  // Draw background grid
  stroke(230);
  strokeWeight(1);
  fill(240);
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  }
  
  // Draw placed blocks
  noStroke();
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] !== null) {
        fill(grid[y][x]);
        rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        
        // Add inner highlight for 3D effect
        fill(255, 255, 255, 100);
        rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE/4);
        rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE/4, GRID_SIZE);
        
        // Add shadow
        fill(0, 0, 0, 50);
        rect(x * GRID_SIZE + GRID_SIZE*3/4, y * GRID_SIZE, GRID_SIZE/4, GRID_SIZE);
        rect(x * GRID_SIZE, y * GRID_SIZE + GRID_SIZE*3/4, GRID_SIZE, GRID_SIZE/4);
      }
    }
  }
}

// Draw the current piece
function drawCurrentPiece() {
  if (!currentPiece) return;
  
  noStroke();
  fill(currentPiece.color);
  
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const drawX = (currentPiece.x + x) * GRID_SIZE;
        const drawY = (currentPiece.y + y) * GRID_SIZE;
        
        // Draw block
        rect(drawX, drawY, GRID_SIZE, GRID_SIZE);
        
        // Add inner highlight for 3D effect
        fill(255, 255, 255, 100);
        rect(drawX, drawY, GRID_SIZE, GRID_SIZE/4);
        rect(drawX, drawY, GRID_SIZE/4, GRID_SIZE);
        
        // Add shadow
        fill(0, 0, 0, 50);
        rect(drawX + GRID_SIZE*3/4, drawY, GRID_SIZE/4, GRID_SIZE);
        rect(drawX, drawY + GRID_SIZE*3/4, GRID_SIZE, GRID_SIZE/4);
        
        // Reset fill color for next block
        fill(currentPiece.color);
      }
    }
  }
}

// Draw the ghost piece (preview of where the piece will land)
function drawGhostPiece() {
  if (!currentPiece) return;
  
  // Find the drop position
  let dropDistance = 0;
  while (canMoveTo(currentPiece, 0, dropDistance + 1)) {
    dropDistance++;
  }
  
  // Draw ghost piece
  noStroke();
  fill(currentPiece.color[0], currentPiece.color[1], currentPiece.color[2], 80);
  
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        rect(
          (currentPiece.x + x) * GRID_SIZE,
          (currentPiece.y + y + dropDistance) * GRID_SIZE,
          GRID_SIZE,
          GRID_SIZE
        );
      }
    }
  }
}

// Draw the next piece preview
function drawNextPiece() {
  if (!nextPiece) return;
  
  const previewX = WIDTH + SIDEBAR_WIDTH/2;
  const previewY = 120;
  
  // Draw preview box with gradient background
  drawGradientBox(previewX - 40, previewY - 40, 80, 80, [70, 130, 180], [100, 180, 255]);
  
  // Draw next piece label
  noStroke();
  fill(255);
  textSize(14);
  textAlign(CENTER);
  text("NEXT", previewX, previewY - 50);
  textAlign(LEFT);
  
  // Draw the next piece
  noStroke();
  fill(nextPiece.color);
  
  // Center the piece in the preview box
  const offsetX = nextPiece.shape[0].length === 2 ? 0.5 : 0;
  
  for (let y = 0; y < nextPiece.shape.length; y++) {
    for (let x = 0; x < nextPiece.shape[y].length; x++) {
      if (nextPiece.shape[y][x]) {
        const drawX = previewX - (nextPiece.shape[y].length * GRID_SIZE / 2) + x * GRID_SIZE + offsetX * GRID_SIZE;
        const drawY = previewY - (nextPiece.shape.length * GRID_SIZE / 2) + y * GRID_SIZE;
        
        // Draw block
        rect(drawX, drawY, GRID_SIZE, GRID_SIZE);
        
        // Add inner highlight for 3D effect
        fill(255, 255, 255, 100);
        rect(drawX, drawY, GRID_SIZE, GRID_SIZE/4);
        rect(drawX, drawY, GRID_SIZE/4, GRID_SIZE);
        
        // Add shadow
        fill(0, 0, 0, 50);
        rect(drawX + GRID_SIZE*3/4, drawY, GRID_SIZE/4, GRID_SIZE);
        rect(drawX, drawY + GRID_SIZE*3/4, GRID_SIZE, GRID_SIZE/4);
        
        // Reset fill color for next block
        fill(nextPiece.color);
      }
    }
  }
}

// Draw the held piece
function drawHeldPiece() {
  const holdX = WIDTH + SIDEBAR_WIDTH/2;
  const holdY = 250;
  
  // Draw hold box with gradient background
  drawGradientBox(holdX - 40, holdY - 40, 80, 80, [180, 70, 130], [255, 100, 180]);
  
  // Draw hold piece label
  noStroke();
  fill(255);
  textSize(14);
  textAlign(CENTER);
  text("HOLD", holdX, holdY - 50);
  textAlign(LEFT);
  
  if (!heldPiece) {
    // Draw empty indicator
    noFill();
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    rect(holdX - 30, holdY - 20, 60, 40);
    line(holdX - 30, holdY - 20, holdX + 30, holdY + 20);
    line(holdX + 30, holdY - 20, holdX - 30, holdY + 20);
    noStroke();
    return;
  }
  
  // Draw the held piece
  noStroke();
  fill(heldPiece.color);
  
  // Center the piece in the hold box
  const offsetX = heldPiece.shape[0].length === 2 ? 0.5 : 0;
  
  for (let y = 0; y < heldPiece.shape.length; y++) {
    for (let x = 0; x < heldPiece.shape[y].length; x++) {
      if (heldPiece.shape[y][x]) {
        const drawX = holdX - (heldPiece.shape[y].length * GRID_SIZE / 2) + x * GRID_SIZE + offsetX * GRID_SIZE;
        const drawY = holdY - (heldPiece.shape.length * GRID_SIZE / 2) + y * GRID_SIZE;
        
        // Draw block
        rect(drawX, drawY, GRID_SIZE, GRID_SIZE);
        
        // Add inner highlight for 3D effect
        fill(255, 255, 255, 100);
        rect(drawX, drawY, GRID_SIZE, GRID_SIZE/4);
        rect(drawX, drawY, GRID_SIZE/4, GRID_SIZE);
        
        // Add shadow
        fill(0, 0, 0, 50);
        rect(drawX + GRID_SIZE*3/4, drawY, GRID_SIZE/4, GRID_SIZE);
        rect(drawX, drawY + GRID_SIZE*3/4, GRID_SIZE, GRID_SIZE/4);
        
        // Reset fill color for next block
        fill(heldPiece.color);
      }
    }
  }
  
  // Indicate if hold is unavailable
  if (!canHold) {
    fill(255, 0, 0, 80);
    rect(holdX - 50, holdY - 40, 100, 100);
  }
}

// Draw a box with gradient background
function drawGradientBox(x, y, w, h, colorStart, colorEnd) {
  noFill();
  for (let i = 0; i < h; i++) {
    const inter = map(i, 0, h, 0, 1);
    const c = lerpColor(
      color(colorStart[0], colorStart[1], colorStart[2], 200),
      color(colorEnd[0], colorEnd[1], colorEnd[2], 200),
      inter
    );
    stroke(c);
    line(x, y + i, x + w, y + i);
  }
  
  // Draw border
  noFill();
  stroke(255, 255, 255, 150);
  strokeWeight(2);
  rect(x, y, w, h, 5);
  strokeWeight(1);
}

// Draw game info (score, level, etc.)
function drawGameInfo() {
  const infoX = WIDTH + SIDEBAR_WIDTH/2;
  
  // Draw score panel
  drawGradientBox(WIDTH + 10, 350, SIDEBAR_WIDTH - 20, 100, [50, 50, 100], [100, 100, 200]);
  
  // Draw scores
  noStroke();
  fill(255);
  textSize(14);
  textAlign(CENTER);
  
  text("SCORE", infoX, 370);
  textSize(18);
  text(score, infoX, 400);
  
  textSize(12);
  text("HIGH", infoX, 430);
  textSize(16);
  text(highScore, infoX, 455);
  
  // Draw level info
  drawGradientBox(WIDTH + 10, 470, SIDEBAR_WIDTH - 20, 60, [100, 50, 50], [200, 100, 100]);
  
  textSize(14);
  text("LEVEL " + level, infoX, 490);
  
  // Draw level progress bar
  const progressWidth = 80;
  const progressHeight = 10;
  const progressX = infoX - progressWidth/2;
  const progressY = 510;
  const progress = (linesCleared % 10) / 10;
  
  // Progress bar background
  noStroke();
  fill(50);
  rect(progressX, progressY, progressWidth, progressHeight, 5);
  
  // Progress bar fill
  fill(255, 100, 100);
  rect(progressX, progressY, progressWidth * progress, progressHeight, 5);
  
  // Progress text
  fill(255);
  textSize(10);
  text(`${linesCleared % 10}/10`, infoX, progressY + progressHeight + 15);
  
  // Draw difficulty
  textAlign(CENTER);
  textSize(12);
  text("DIFFICULTY", infoX, 550);
  
  // Reset text alignment
  textAlign(LEFT);
}

// Draw difficulty buttons
function drawDifficultyButtons() {
  const buttonWidth = 25;
  const buttonHeight = 25;
  const buttonX = WIDTH + SIDEBAR_WIDTH/2 - 45;
  const buttonY = 560;
  const spacing = 5;
  
  for (const [key, difficulty] of Object.entries(DIFFICULTY)) {
    let btnX = 0;
    
    if (key === "EASY") {
      btnX = buttonX;
    } else if (key === "MEDIUM") {
      btnX = buttonX + buttonWidth + spacing;
    } else if (key === "HARD") {
      btnX = buttonX + 2 * (buttonWidth + spacing);
    }
    
    // Button background with gradient
    if (currentDifficulty === difficulty) {
      drawGradientBox(btnX, buttonY, buttonWidth, buttonHeight, [0, 128, 255], [0, 200, 255]);
    } else {
      drawGradientBox(btnX, buttonY, buttonWidth, buttonHeight, [80, 80, 80], [120, 120, 120]);
    }
    
    // Button text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(difficulty.label.charAt(0), btnX + buttonWidth/2, buttonY + buttonHeight/2);
    textAlign(LEFT, BASELINE);
  }
}

// Draw the sidebar background
function drawSidebar() {
  // Draw starry background
  noStroke();
  fill(20, 20, 40, 200);
  rect(WIDTH, 0, SIDEBAR_WIDTH, HEIGHT);
  
  // Draw stars
  for (let star of backgroundStars) {
    star.update();
    star.draw();
  }
  
  // Draw decorative header
  drawGradientBox(WIDTH, 0, SIDEBAR_WIDTH, 50, [60, 20, 120], [120, 60, 180]);
  
  // Draw title
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("TETRIS", WIDTH + SIDEBAR_WIDTH/2, 35);
  textAlign(LEFT);
  
  // Draw decorative dividers
  stroke(255, 255, 255, 100);
  strokeWeight(1);
  line(WIDTH + 20, 70, WIDTH + SIDEBAR_WIDTH - 20, 70);
  line(WIDTH + 20, 320, WIDTH + SIDEBAR_WIDTH - 20, 320);
  line(WIDTH + 20, 480, WIDTH + SIDEBAR_WIDTH - 20, 480);
  line(WIDTH + 20, 580, WIDTH + SIDEBAR_WIDTH - 20, 580);
}

// Handle difficulty button clicks
function checkDifficultyButtonClick() {
  const buttonWidth = 25;
  const buttonHeight = 25;
  const buttonX = WIDTH + SIDEBAR_WIDTH/2 - 45;
  const buttonY = 560;
  const spacing = 5;
  
  if (mouseY < buttonY || mouseY > buttonY + buttonHeight) return;
  
  if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth) {
    currentDifficulty = DIFFICULTY.EASY;
  } else if (mouseX >= buttonX + buttonWidth + spacing && mouseX <= buttonX + 2 * buttonWidth + spacing) {
    currentDifficulty = DIFFICULTY.MEDIUM;
  } else if (mouseX >= buttonX + 2 * (buttonWidth + spacing) && mouseX <= buttonX + 3 * buttonWidth + 2 * spacing) {
    currentDifficulty = DIFFICULTY.HARD;
  }
}

// Draw sparkle particles
function drawSparkles() {
  for (let i = sparkleParticles.length - 1; i >= 0; i--) {
    sparkleParticles[i].update();
    sparkleParticles[i].draw();
    
    if (sparkleParticles[i].isDead()) {
      sparkleParticles.splice(i, 1);
    }
  }
}

// Show start screen
function showStartScreen() {
  background(0);
  
  // Draw stars
  for (let star of backgroundStars) {
    star.update();
    star.draw();
  }
  
  // Title with gradient
  textSize(60);
  textAlign(CENTER);
  
  // Draw "TETRIS" with rainbow colors
  const title = "TETRIS";
  const colors = [
    [255, 0, 0],    // Red
    [255, 165, 0],  // Orange
    [255, 255, 0],  // Yellow
    [0, 255, 0],    // Green
    [0, 0, 255],    // Blue
    [128, 0, 128]   // Purple
  ];
  
  for (let i = 0; i < title.length; i++) {
    fill(colors[i % colors.length]);
    text(title[i], WIDTH/2 - 120 + i * 40, HEIGHT/3);
    
    // Add sparkles around each letter
    if (random() < 0.3) {
      for (let j = 0; j < 3; j++) {
        sparkleParticles.push(new Sparkle(
          WIDTH/2 - 120 + i * 40 + random(-20, 20),
          HEIGHT/3 + random(-30, 30),
          colors[i % colors.length]
        ));
      }
    }
  }
  
  // Instructions
  fill(255);
  textSize(24);
  text("Press SPACE to start", WIDTH/2, HEIGHT/2);
  
  textSize(18);
  text("Arrow keys: Move and rotate", WIDTH/2, HEIGHT/2 + 50);
  text("Space: Hard drop | H: Hold piece", WIDTH/2, HEIGHT/2 + 80);
  text("P: Pause game", WIDTH/2, HEIGHT/2 + 110);
  
  // Draw difficulty options
  text("Select Difficulty:", WIDTH/2, HEIGHT/2 + 150);
  
  // Draw difficulty buttons centered
  const buttonWidth = 100;
  const buttonHeight = 30;
  const buttonY = HEIGHT/2 + 180;
  let buttonX = WIDTH/2 - 160;
  
  for (const [key, difficulty] of Object.entries(DIFFICULTY)) {
    // Button background
    if (currentDifficulty === difficulty) {
      fill(0, 128, 255); // Highlight selected difficulty
    } else {
      fill(100);
    }
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
    
    // Button text
    fill(255);
    textAlign(CENTER, CENTER);
    text(difficulty.label, buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    
    buttonX += buttonWidth + 20;
  }
  
  textAlign(LEFT, BASELINE);
  
  // Draw sparkles
  drawSparkles();
}

// Show game over screen
function showGameOverScreen() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, WIDTH, HEIGHT);
  
  // Game over text
  fill(255, 0, 0);
  textSize(60);
  textAlign(CENTER);
  text("GAME OVER", WIDTH/2, HEIGHT/3);
  
  // Score
  fill(255);
  textSize(24);
  text(`Final Score: ${score}`, WIDTH/2, HEIGHT/2);
  
  // New high score notification
  if (score >= highScore && score > 0) {
    fill(255, 215, 0); // Gold color
    text("NEW HIGH SCORE!", WIDTH/2, HEIGHT/2 + 40);
    
    // Add celebratory sparkles
    if (random() < 0.5) {
      for (let i = 0; i < 10; i++) {
        sparkleParticles.push(new Sparkle(
          WIDTH/2 + random(-150, 150),
          HEIGHT/2 + 40 + random(-20, 20),
          [255, 215, 0]
        ));
      }
    }
  } else {
    fill(255);
    text(`Level: ${level}`, WIDTH/2, HEIGHT/2 + 40);
  }
  
  text(`Lines Cleared: ${linesCleared}`, WIDTH/2, HEIGHT/2 + 80);
  
  // Restart instructions
  textSize(20);
  text("Press SPACE to play again", WIDTH/2, HEIGHT/2 + 140);
  
  textAlign(LEFT, BASELINE);
  
  // Add random sparkles
  if (random() < 0.3) {
    for (let i = 0; i < 5; i++) {
      sparkleParticles.push(new Sparkle(
        random(WIDTH),
        random(HEIGHT),
        [random(255), random(255), random(255)]
      ));
    }
  }
  
  // Draw sparkles
  drawSparkles();
}

// Show pause screen
function showPauseScreen() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, WIDTH, HEIGHT);
  
  // Pause text
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("GAME PAUSED", WIDTH/2, HEIGHT/2 - 20);
  
  textSize(20);
  text("Press P to resume", WIDTH/2, HEIGHT/2 + 30);
  
  textAlign(LEFT, BASELINE);
}

// p5.js setup function
function setup() {
  // Create canvas that fits in the container
  const gameContainer = document.getElementById('game-canvas');
  
  // Create canvas with the same dimensions
  const canvas = createCanvas(WIDTH + SIDEBAR_WIDTH, HEIGHT);
  canvas.parent('game-canvas');
  
  // Initialize game
  initGrid();
  currentPiece = createPiece();
  nextPiece = createPiece();
  
  // Set text properties
  textFont('Arial, sans-serif');
  textAlign(LEFT);
  
  // Create difficulty buttons
  createDifficultyButtons();
  
  // Create background stars
  for (let i = 0; i < 50; i++) {
    backgroundStars.push(new Star());
  }
}

// Create difficulty buttons
function createDifficultyButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'difficulty-buttons';
  buttonContainer.style.marginBottom = '10px';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.gap = '10px';
  
  // Easy button
  const easyBtn = document.createElement('button');
  easyBtn.textContent = 'Easy';
  easyBtn.className = 'difficulty-btn';
  easyBtn.style.padding = '5px 15px';
  easyBtn.style.cursor = 'pointer';
  easyBtn.onclick = () => changeDifficulty(DIFFICULTY.EASY);
  
  // Medium button
  const mediumBtn = document.createElement('button');
  mediumBtn.textContent = 'Medium';
  mediumBtn.className = 'difficulty-btn';
  mediumBtn.style.padding = '5px 15px';
  mediumBtn.style.cursor = 'pointer';
  mediumBtn.onclick = () => changeDifficulty(DIFFICULTY.MEDIUM);
  
  // Hard button
  const hardBtn = document.createElement('button');
  hardBtn.textContent = 'Hard';
  hardBtn.className = 'difficulty-btn';
  hardBtn.style.padding = '5px 15px';
  hardBtn.style.cursor = 'pointer';
  hardBtn.onclick = () => changeDifficulty(DIFFICULTY.HARD);
  
  // Add buttons to container
  buttonContainer.appendChild(easyBtn);
  buttonContainer.appendChild(mediumBtn);
  buttonContainer.appendChild(hardBtn);
  
  // Add container before the canvas
  const gameContainer = document.getElementById('game-canvas');
  gameContainer.parentNode.insertBefore(buttonContainer, gameContainer);
}

// Change difficulty
function changeDifficulty(difficulty) {
  currentDifficulty = difficulty;
}

// p5.js draw function
function draw() {
  background(240);
  
  if (gameState === "start") {
    showStartScreen();
  } else if (gameState === "playing") {
    // Move piece down at regular intervals
    if (millis() - lastMoveTime > currentDifficulty.speed) {
      if (canMoveTo(currentPiece, 0, 1)) {
        currentPiece.y++;
      } else {
        placePiece();
      }
      lastMoveTime = millis();
    }
    
    // Draw sidebar first (background)
    drawSidebar();
    
    // Draw game elements
    drawGrid();
    drawGhostPiece();
    drawCurrentPiece();
    drawNextPiece();
    drawHeldPiece();
    drawGameInfo();
    drawDifficultyButtons();
    drawSparkles();
  } else if (gameState === "paused") {
    // Draw sidebar first (background)
    drawSidebar();
    
    // Draw game elements
    drawGrid();
    drawCurrentPiece();
    drawNextPiece();
    drawHeldPiece();
    drawGameInfo();
    drawDifficultyButtons();
    
    // Draw pause overlay
    showPauseScreen();
  } else if (gameState === "gameOver") {
    // Draw sidebar first (background)
    drawSidebar();
    
    // Draw game elements
    drawGrid();
    drawNextPiece();
    drawHeldPiece();
    drawGameInfo();
    drawDifficultyButtons();
    
    // Draw game over overlay
    showGameOverScreen();
  }
}

// Handle key presses
function keyPressed() {
  if (gameState === "start") {
    if (keyCode === 32) { // Space
      gameState = "playing";
      lastMoveTime = millis();
    }
  } else if (gameState === "playing") {
    if (keyCode === LEFT_ARROW) {
      if (canMoveTo(currentPiece, -1, 0)) {
        currentPiece.x--;
      }
    } else if (keyCode === RIGHT_ARROW) {
      if (canMoveTo(currentPiece, 1, 0)) {
        currentPiece.x++;
      }
    } else if (keyCode === DOWN_ARROW) {
      if (canMoveTo(currentPiece, 0, 1)) {
        currentPiece.y++;
        lastMoveTime = millis(); // Reset drop timer
      }
    } else if (keyCode === UP_ARROW) {
      rotatePiece(currentPiece);
    } else if (keyCode === 32) { // Space - Hard drop
      while (canMoveTo(currentPiece, 0, 1)) {
        currentPiece.y++;
      }
      placePiece();
      lastMoveTime = millis();
    } else if (keyCode === 72 || keyCode === 104) { // H key - Hold piece
      holdPiece();
    } else if (keyCode === 80) { // P - Pause
      gameState = "paused";
    }
  } else if (gameState === "paused") {
    if (keyCode === 80) { // P - Resume
      gameState = "playing";
    }
  } else if (gameState === "gameOver") {
    if (keyCode === 32) { // Space - Restart
      initGrid();
      currentPiece = createPiece();
      nextPiece = createPiece();
      heldPiece = null;
      canHold = true;
      score = 0;
      level = 1;
      linesCleared = 0;
      gameState = "playing";
      lastMoveTime = millis();
    }
  }
  
  // Prevent default behavior for arrow keys
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || 
      keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || 
      keyCode === 32) {
    return false;
  }
}

// Handle mouse clicks
function mousePressed() {
  if (gameState === "start") {
    // Check difficulty button clicks on start screen
    const buttonWidth = 100;
    const buttonHeight = 30;
    const buttonY = HEIGHT/2 + 180;
    
    if (mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
      if (mouseX >= WIDTH/2 - 160 && mouseX <= WIDTH/2 - 160 + buttonWidth) {
        currentDifficulty = DIFFICULTY.EASY;
      } else if (mouseX >= WIDTH/2 - 40 && mouseX <= WIDTH/2 - 40 + buttonWidth) {
        currentDifficulty = DIFFICULTY.MEDIUM;
      } else if (mouseX >= WIDTH/2 + 80 && mouseX <= WIDTH/2 + 80 + buttonWidth) {
        currentDifficulty = DIFFICULTY.HARD;
      }
    }
  } else if (gameState === "playing" || gameState === "paused") {
    // Check difficulty button clicks in game
    checkDifficultyButtonClick();
  }
} 