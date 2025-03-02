// Balloon Popper Game using p5.js

// Game constants
const WIDTH = 800;
const HEIGHT = 400; // Match the container height
const TARGET_SCORE = 15;

// Game variables
let bird;
let balloons = [];
let poppedBalloons = [];
let score = 0;
let gameState = "start"; // start, playing, win
let lastBalloonTime = 0;
let balloonSpawnDelay = 1000; // milliseconds

// Bird class
class Bird {
  constructor() {
    this.x = 100;
    this.y = HEIGHT / 2;
    this.width = 50;
    this.height = 40;
    this.speed = 5;
    this.color = [255, 255, 0]; // Yellow
  }
  
  draw() {
    // Draw bird body
    fill(this.color);
    noStroke();
    ellipse(this.x + this.width/2, this.y + this.height/2, this.width, this.height);
    
    // Draw beak
    fill(255, 165, 0); // Orange
    triangle(
      this.x + this.width, this.y + this.height/2 - 5,
      this.x + this.width + 20, this.y + this.height/2,
      this.x + this.width, this.y + this.height/2 + 5
    );
    
    // Draw eye
    fill(0);
    ellipse(this.x + this.width - 10, this.y + 15, 10, 10);
  }
  
  move() {
    // Keyboard controls
    if (keyIsDown(UP_ARROW) && this.y > 0) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW) && this.y < HEIGHT - this.height) {
      this.y += this.speed;
    }
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < WIDTH - this.width) {
      this.x += this.speed;
    }
    
    // Mouse controls
    if (mouseIsPressed) {
      let targetX = mouseX;
      let targetY = mouseY;
      
      // Calculate direction to move
      let dx = targetX - (this.x + this.width/2);
      let dy = targetY - (this.y + this.height/2);
      
      // Normalize and scale by speed
      let distance = max(1, sqrt(dx*dx + dy*dy)); // Avoid division by zero
      dx = dx / distance * this.speed;
      dy = dy / distance * this.speed;
      
      // Update position
      let newX = this.x + dx;
      let newY = this.y + dy;
      
      // Keep within bounds
      this.x = constrain(newX, 0, WIDTH - this.width);
      this.y = constrain(newY, 0, HEIGHT - this.height);
    }
  }
  
  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

// Balloon class
class Balloon {
  constructor() {
    this.width = 40;
    this.height = 60;
    this.x = random(0, WIDTH - this.width);
    this.y = HEIGHT;
    this.speed = random(1, 3);
    
    // Random color
    const colors = [
      [255, 0, 0],    // Red
      [0, 0, 255],    // Blue
      [0, 255, 0],    // Green
      [128, 0, 128],  // Purple
      [255, 165, 0]   // Orange
    ];
    this.color = random(colors);
    
    this.popped = false;
    this.popTime = 0;
  }
  
  draw() {
    if (this.popped) {
      // Draw popping animation
      fill(255);
      noStroke();
      let popRadius = min(30, (millis() - this.popTime) / 20);
      ellipse(this.x + this.width/2, this.y + this.height/2, popRadius*2);
    } else {
      // Draw balloon body
      fill(this.color);
      noStroke();
      ellipse(this.x + this.width/2, this.y + this.height/2, this.width, this.height);
      
      // Draw balloon knot
      triangle(
        this.x + this.width/2, this.y + this.height,
        this.x + this.width/2 - 5, this.y + this.height + 10,
        this.x + this.width/2 + 5, this.y + this.height + 10
      );
      
      // Draw balloon string
      stroke(0);
      line(
        this.x + this.width/2, this.y + this.height + 10,
        this.x + this.width/2, this.y + this.height + 30
      );
    }
  }
  
  move() {
    if (!this.popped) {
      this.y -= this.speed;
    }
  }
  
  isOffScreen() {
    return this.y < -this.height;
  }
  
  pop() {
    if (!this.popped) {
      this.popped = true;
      this.popTime = millis();
      return true;
    }
    return false;
  }
  
  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

// Check for collision between two rectangles
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// Draw clouds in the background
function drawClouds() {
  fill(135, 206, 235); // Sky blue color
  noStroke();
  
  for (let i = 0; i < 3; i++) {
    let cloudX = (WIDTH / 3) * i + 50;
    let cloudY = 50 + (i * 20);
    ellipse(cloudX, cloudY, 100, 50);
    ellipse(cloudX + 25, cloudY - 20, 80, 50);
    ellipse(cloudX + 50, cloudY, 100, 50);
  }
}

// Show start screen
function showStartScreen() {
  background(255);
  drawClouds();
  
  // Title
  fill(0, 0, 255);
  textSize(60);
  textAlign(CENTER);
  text("Balloon Popper", WIDTH/2, HEIGHT/4);
  
  // Instructions
  fill(0);
  textSize(24);
  text("Pop 15 balloons to win!", WIDTH/2, HEIGHT/2);
  text("Use arrow keys or click to move the bird", WIDTH/2, HEIGHT/2 + 50);
  
  fill(0, 255, 0);
  text("Press SPACE to start", WIDTH/2, HEIGHT/2 + 150);
}

// Show win screen
function showWinScreen() {
  background(255);
  drawClouds();
  
  // Win message
  fill(0, 255, 0);
  textSize(80);
  textAlign(CENTER);
  text("You Did It!", WIDTH/2, HEIGHT/3);
  
  // Score
  fill(0, 0, 255);
  textSize(40);
  text(`You popped ${score} balloons!`, WIDTH/2, HEIGHT/2);
  
  // Restart instructions
  fill(0);
  textSize(30);
  text("Press SPACE to play again", WIDTH/2, HEIGHT/2 + 100);
}

// p5.js setup function
function setup() {
  console.log("Setting up Balloon Popper game");
  
  // Create canvas that fits in the container
  const gameContainer = document.getElementById('game-canvas');
  if (!gameContainer) {
    console.error("Game container not found!");
    return;
  }
  
  console.log("Game container dimensions:", gameContainer.offsetWidth, gameContainer.offsetHeight);
  
  // Create canvas with the container's width and a fixed height
  const canvas = createCanvas(gameContainer.offsetWidth, 400);
  canvas.parent('game-canvas');
  
  // Initialize game
  resetGame();
  
  // Set text properties
  textFont('Arial, sans-serif'); // Fallback to system fonts if Comic Sans is not available
  textAlign(LEFT);
  
  // Log that setup is complete
  console.log("Balloon Popper setup complete");
}

// Reset game state
function resetGame() {
  bird = new Bird();
  balloons = [];
  poppedBalloons = [];
  score = 0;
  lastBalloonTime = millis();
  gameState = "start";
}

// p5.js draw function
function draw() {
  if (gameState === "start") {
    showStartScreen();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "win") {
    showWinScreen();
  }
}

// Main game logic
function playGame() {
  // Spawn new balloons
  let currentTime = millis();
  if (currentTime - lastBalloonTime > balloonSpawnDelay) {
    balloons.push(new Balloon());
    lastBalloonTime = currentTime;
  }
  
  // Move bird
  bird.move();
  
  // Move balloons
  for (let balloon of balloons) {
    balloon.move();
  }
  
  // Check for collisions
  let birdRect = bird.getRect();
  for (let balloon of balloons) {
    if (!balloon.popped && checkCollision(birdRect, balloon.getRect())) {
      if (balloon.pop()) {
        score++;
        poppedBalloons.push(balloon);
      }
    }
  }
  
  // Remove balloons that are off screen
  balloons = balloons.filter(b => !b.isOffScreen());
  
  // Remove popped balloons after animation
  currentTime = millis();
  for (let i = poppedBalloons.length - 1; i >= 0; i--) {
    if (currentTime - poppedBalloons[i].popTime > 500) { // 500ms for pop animation
      const index = balloons.indexOf(poppedBalloons[i]);
      if (index !== -1) {
        balloons.splice(index, 1);
      }
      poppedBalloons.splice(i, 1);
    }
  }
  
  // Draw everything
  background(255);
  drawClouds();
  
  // Draw balloons
  for (let balloon of balloons) {
    balloon.draw();
  }
  
  // Draw bird
  bird.draw();
  
  // Draw score
  fill(0);
  textSize(24);
  text(`Score: ${score}/${TARGET_SCORE}`, 10, 30);
  
  // Check win condition
  if (score >= TARGET_SCORE) {
    gameState = "win";
  }
}

// Handle key presses
function keyPressed() {
  if (keyCode === 32) { // Space key
    if (gameState === "start") {
      gameState = "playing";
    } else if (gameState === "win") {
      resetGame();
      gameState = "playing";
    }
  }
  
  // Prevent default behavior for arrow keys
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || 
      keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    return false;
  }
} 