// Animal Dress-Up Adventure Game using p5.js

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SIDEBAR_WIDTH = 200;
const MAIN_AREA_WIDTH = CANVAS_WIDTH - SIDEBAR_WIDTH;

// Game states
const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  CELEBRATION: 'celebration'
};

// Animal types
const ANIMALS = [
  { name: 'Bunny', color: '#FFCCCC' },
  { name: 'Kitty', color: '#FFDDAA' },
  { name: 'Puppy', color: '#DDCCAA' }
];

// Themes/Occasions
const THEMES = [
  { name: 'Beach Day', colors: ['#87CEEB', '#E0F7FA', '#FFF59D', '#FFD54F'] },
  { name: 'Birthday Party', colors: ['#E1BEE7', '#CE93D8', '#FFD54F', '#FFECB3'] },
  { name: 'Winter Fun', colors: ['#B3E5FC', '#81D4FA', '#E1F5FE', '#FFFFFF'] }
];

// Clothing categories
const CATEGORIES = [
  'Hats',
  'Tops',
  'Bottoms',
  'Shoes',
  'Accessories'
];

// Game variables
let gameState = GAME_STATES.START;
let currentAnimal = 0;
let currentTheme = 0;
let currentCategory = 0;
let selectedItems = {};
let draggingItem = null;
let itemsInCategory = [];
let animalImages = {};
let themeImages = {};
let itemImages = {};
let soundEffects = {};
let confetti = [];
let stars = [];

// Create a cute animal graphic
function createAnimalGraphic(animalName, baseColor) {
  const img = createGraphics(300, 400);
  img.background(255, 250, 250, 0);
  
  // Draw body
  img.fill(baseColor);
  img.noStroke();
  
  if (animalName === 'Bunny') {
    // Draw bunny
    img.ellipse(150, 250, 180, 240); // body
    img.ellipse(150, 150, 140, 140); // head
    
    // Ears
    img.push();
    img.fill(baseColor);
    img.ellipse(120, 70, 40, 100);
    img.ellipse(180, 70, 40, 100);
    img.pop();
    
    // Inner ears
    img.push();
    img.fill('#FFAAAA');
    img.ellipse(120, 70, 20, 80);
    img.ellipse(180, 70, 20, 80);
    img.pop();
    
    // Face
    img.fill(255);
    img.ellipse(130, 140, 30, 30); // left eye area
    img.ellipse(170, 140, 30, 30); // right eye area
    
    img.fill(0);
    img.ellipse(130, 140, 15, 15); // left eye
    img.ellipse(170, 140, 15, 15); // right eye
    
    // Nose
    img.fill('#FFAAAA');
    img.ellipse(150, 165, 20, 15);
    
    // Mouth
    img.stroke(0);
    img.strokeWeight(2);
    img.noFill();
    img.arc(150, 180, 30, 20, 0, PI);
    
    // Whiskers
    img.line(140, 170, 110, 165);
    img.line(140, 175, 110, 180);
    img.line(160, 170, 190, 165);
    img.line(160, 175, 190, 180);
    
  } else if (animalName === 'Kitty') {
    // Draw kitty
    img.ellipse(150, 250, 180, 240); // body
    img.ellipse(150, 150, 140, 140); // head
    
    // Ears
    img.triangle(110, 90, 130, 50, 150, 90); // left ear
    img.triangle(150, 90, 170, 50, 190, 90); // right ear
    
    // Inner ears
    img.fill('#FFAACC');
    img.triangle(115, 90, 130, 60, 145, 90); // left inner ear
    img.triangle(155, 90, 170, 60, 185, 90); // right inner ear
    
    // Face
    img.fill(255);
    img.ellipse(130, 140, 30, 30); // left eye area
    img.ellipse(170, 140, 30, 30); // right eye area
    
    img.fill(0);
    img.ellipse(130, 140, 10, 20); // left eye
    img.ellipse(170, 140, 10, 20); // right eye
    
    // Nose
    img.fill('#FFAACC');
    img.triangle(140, 165, 150, 175, 160, 165);
    
    // Mouth
    img.stroke(0);
    img.strokeWeight(2);
    img.noFill();
    img.arc(140, 185, 20, 10, PI, TWO_PI);
    img.arc(160, 185, 20, 10, PI, TWO_PI);
    
    // Whiskers
    img.line(140, 170, 100, 165);
    img.line(140, 175, 100, 180);
    img.line(160, 170, 200, 165);
    img.line(160, 175, 200, 180);
    
  } else if (animalName === 'Puppy') {
    // Draw puppy
    img.ellipse(150, 250, 180, 240); // body
    img.ellipse(150, 150, 150, 140); // head
    
    // Ears
    img.ellipse(100, 100, 60, 80); // left ear
    img.ellipse(200, 100, 60, 80); // right ear
    
    // Face
    img.fill(255);
    img.ellipse(130, 140, 30, 30); // left eye area
    img.ellipse(170, 140, 30, 30); // right eye area
    
    img.fill(0);
    img.ellipse(130, 140, 15, 15); // left eye
    img.ellipse(170, 140, 15, 15); // right eye
    
    // Nose
    img.fill('#333333');
    img.ellipse(150, 170, 25, 20);
    
    // Mouth
    img.stroke(0);
    img.strokeWeight(2);
    img.noFill();
    img.arc(150, 190, 50, 30, 0, PI);
    
    // Tongue
    img.fill('#FFAAAA');
    img.noStroke();
    img.arc(150, 190, 30, 20, 0, PI);
  }
  
  return img;
}

// Create a themed background
function createThemeBackground(theme) {
  const img = createGraphics(MAIN_AREA_WIDTH, CANVAS_HEIGHT);
  const colors = theme.colors;
  
  if (theme.name === 'Beach Day') {
    // Sky
    img.background(colors[0]);
    
    // Sun
    img.fill(colors[3]);
    img.noStroke();
    img.ellipse(100, 100, 80, 80);
    
    // Sand
    img.fill(colors[2]);
    img.rect(0, CANVAS_HEIGHT - 150, MAIN_AREA_WIDTH, 150);
    
    // Waves
    img.fill(colors[1]);
    img.noStroke();
    for (let x = 0; x < MAIN_AREA_WIDTH; x += 40) {
      img.arc(x, CANVAS_HEIGHT - 150, 80, 40, PI, TWO_PI);
    }
    
    // Beach ball
    img.fill(255);
    img.ellipse(500, 400, 60, 60);
    img.fill('#FF5555');
    img.arc(500, 400, 60, 60, 0, PI/2);
    img.fill('#55FF55');
    img.arc(500, 400, 60, 60, PI/2, PI);
    img.fill('#5555FF');
    img.arc(500, 400, 60, 60, PI, 3*PI/2);
    img.fill('#FFFF55');
    img.arc(500, 400, 60, 60, 3*PI/2, TWO_PI);
    
  } else if (theme.name === 'Birthday Party') {
    // Background
    img.background(colors[0]);
    
    // Balloons
    for (let i = 0; i < 10; i++) {
      const x = random(MAIN_AREA_WIDTH);
      const y = random(100, 300);
      const size = random(30, 60);
      img.fill(random([colors[1], colors[2], colors[3], '#FF9999', '#99FF99', '#9999FF']));
      img.noStroke();
      img.ellipse(x, y, size, size * 1.2);
      img.stroke(0);
      img.strokeWeight(1);
      img.line(x, y + size * 0.6, x, y + size * 1.5);
    }
    
    // Banner
    img.fill(colors[1]);
    img.noStroke();
    img.rect(50, 50, MAIN_AREA_WIDTH - 100, 40);
    
    img.fill(255);
    img.textSize(24);
    img.textAlign(CENTER, CENTER);
    img.text("HAPPY BIRTHDAY!", MAIN_AREA_WIDTH/2, 70);
    
    // Cake
    img.fill('#AA7777');
    img.rect(MAIN_AREA_WIDTH/2 - 75, CANVAS_HEIGHT - 200, 150, 100);
    img.fill('#FFAAAA');
    img.rect(MAIN_AREA_WIDTH/2 - 75, CANVAS_HEIGHT - 230, 150, 30);
    
    // Candles
    for (let i = 0; i < 5; i++) {
      const x = MAIN_AREA_WIDTH/2 - 60 + i * 30;
      img.fill('#FFFF99');
      img.rect(x, CANVAS_HEIGHT - 260, 10, 30);
      img.fill('#FF5555');
      img.ellipse(x + 5, CANVAS_HEIGHT - 265, 15, 20);
    }
    
  } else if (theme.name === 'Winter Fun') {
    // Sky
    img.background(colors[0]);
    
    // Snow ground
    img.fill(colors[3]);
    img.rect(0, CANVAS_HEIGHT - 150, MAIN_AREA_WIDTH, 150);
    
    // Snowflakes
    img.fill(255);
    img.noStroke();
    for (let i = 0; i < 100; i++) {
      const x = random(MAIN_AREA_WIDTH);
      const y = random(CANVAS_HEIGHT - 150);
      const size = random(3, 8);
      img.ellipse(x, y, size, size);
    }
    
    // Snowman
    img.fill(255);
    img.ellipse(500, CANVAS_HEIGHT - 100, 100, 100); // bottom
    img.ellipse(500, CANVAS_HEIGHT - 170, 70, 70); // middle
    img.ellipse(500, CANVAS_HEIGHT - 220, 50, 50); // head
    
    // Snowman face
    img.fill(0);
    img.ellipse(490, CANVAS_HEIGHT - 225, 5, 5); // left eye
    img.ellipse(510, CANVAS_HEIGHT - 225, 5, 5); // right eye
    
    img.fill('#FF7700');
    img.triangle(500, CANVAS_HEIGHT - 220, 500, CANVAS_HEIGHT - 210, 520, CANVAS_HEIGHT - 215); // carrot nose
    
    // Scarf
    img.fill('#FF5555');
    img.rect(480, CANVAS_HEIGHT - 195, 40, 10);
    img.rect(480, CANVAS_HEIGHT - 195, 10, 30);
  }
  
  return img;
}

// Create clothing items
function createClothingItem(category, index) {
  // Create larger clothing items to better fit the animals
  const img = createGraphics(160, 160);
  img.background(255, 250, 250, 0);
  
  // Different colors for variety
  const colors = [
    '#FF5555', '#55FF55', '#5555FF', 
    '#FFFF55', '#FF55FF', '#55FFFF',
    '#FF9999', '#99FF99', '#9999FF'
  ];
  
  const color = colors[(index + category.length) % colors.length];
  
  img.fill(color);
  img.noStroke();
  
  if (category === 'Hats') {
    if (index % 5 === 0) {
      // Baseball cap
      img.rect(20, 80, 120, 40, 10);
      img.arc(80, 80, 120, 120, PI, TWO_PI);
    } else if (index % 5 === 1) {
      // Crown
      img.rect(20, 80, 120, 40);
      img.triangle(20, 80, 50, 40, 80, 80);
      img.triangle(80, 80, 110, 40, 140, 80);
    } else if (index % 5 === 2) {
      // Beanie
      img.ellipse(80, 90, 120, 80);
      img.rect(20, 90, 120, 40);
    } else if (index % 5 === 3) {
      // Bow
      img.ellipse(50, 80, 60, 40);
      img.ellipse(110, 80, 60, 40);
      img.rect(70, 80, 20, 20);
    } else {
      // Party hat
      img.triangle(40, 120, 80, 20, 120, 120);
      img.fill(colors[(index + 3) % colors.length]);
      img.ellipse(80, 40, 20, 20);
    }
  } else if (category === 'Tops') {
    if (index % 5 === 0) {
      // T-shirt
      img.rect(40, 40, 80, 100, 10);
      img.rect(20, 40, 40, 60, 10); // left sleeve
      img.rect(100, 40, 40, 60, 10); // right sleeve
    } else if (index % 5 === 1) {
      // Sweater
      img.rect(30, 40, 100, 100, 10);
      img.rect(10, 40, 40, 70, 10); // left sleeve
      img.rect(110, 40, 40, 70, 10); // right sleeve
      // Collar
      img.fill(colors[(index + 2) % colors.length]);
      img.rect(60, 40, 40, 20);
    } else if (index % 5 === 2) {
      // Tank top
      img.rect(50, 40, 60, 100, 10);
      // Straps
      img.rect(50, 40, 20, 30);
      img.rect(90, 40, 20, 30);
    } else if (index % 5 === 3) {
      // Dress shirt
      img.rect(40, 40, 80, 100);
      // Collar
      img.fill(255);
      img.triangle(60, 40, 80, 70, 100, 40);
    } else {
      // Hoodie
      img.rect(30, 50, 100, 90, 10);
      img.rect(10, 50, 40, 70, 10); // left sleeve
      img.rect(110, 50, 40, 70, 10); // right sleeve
      // Hood
      img.arc(80, 50, 80, 80, PI, TWO_PI);
    }
  } else if (category === 'Bottoms') {
    if (index % 5 === 0) {
      // Shorts
      img.rect(40, 40, 80, 60, 10);
    } else if (index % 5 === 1) {
      // Pants
      img.rect(50, 40, 30, 100);
      img.rect(90, 40, 30, 100);
      img.rect(50, 40, 70, 30);
    } else if (index % 5 === 2) {
      // Skirt
      img.rect(40, 40, 80, 30);
      img.arc(80, 70, 80, 60, 0, PI);
    } else if (index % 5 === 3) {
      // Overalls
      img.rect(50, 40, 30, 100);
      img.rect(90, 40, 30, 100);
      img.rect(50, 40, 70, 60);
      // Straps
      img.rect(60, 20, 10, 40);
      img.rect(100, 20, 10, 40);
    } else {
      // Swim trunks
      img.rect(50, 60, 70, 50, 10);
      // Waistband
      img.fill(colors[(index + 4) % colors.length]);
      img.rect(50, 60, 70, 10);
    }
  } else if (category === 'Shoes') {
    if (index % 5 === 0) {
      // Sneakers
      img.rect(30, 80, 50, 30, 10);
      img.rect(90, 80, 50, 30, 10);
      // Laces
      img.fill(255);
      img.rect(44, 90, 20, 10);
      img.rect(104, 90, 20, 10);
    } else if (index % 5 === 1) {
      // Boots
      img.rect(30, 60, 50, 50, 0, 0, 10, 10);
      img.rect(90, 60, 50, 50, 0, 0, 10, 10);
    } else if (index % 5 === 2) {
      // Sandals
      img.rect(30, 100, 50, 10);
      img.rect(90, 100, 50, 10);
      // Straps
      img.rect(40, 80, 10, 30);
      img.rect(60, 80, 10, 30);
      img.rect(100, 80, 10, 30);
      img.rect(120, 80, 10, 30);
    } else if (index % 5 === 3) {
      // Slippers
      img.arc(50, 90, 60, 50, 0, PI);
      img.arc(110, 90, 60, 50, 0, PI);
      // Fluffy tops
      img.fill(255);
      img.rect(30, 80, 40, 10);
      img.rect(90, 80, 40, 10);
    } else {
      // Fancy shoes
      img.rect(30, 90, 50, 20, 0, 10, 0, 0);
      img.rect(90, 90, 50, 20, 0, 10, 0, 0);
      // Heels
      img.rect(30, 110, 20, 10);
      img.rect(90, 110, 20, 10);
    }
  } else if (category === 'Accessories') {
    if (index % 5 === 0) {
      // Glasses
      img.noFill();
      img.stroke(color);
      img.strokeWeight(6);
      img.ellipse(60, 80, 40, 40);
      img.ellipse(100, 80, 40, 40);
      img.line(80, 80, 80, 80);
      img.line(40, 80, 20, 70);
      img.line(120, 80, 140, 70);
    } else if (index % 5 === 1) {
      // Necklace
      img.noFill();
      img.stroke(color);
      img.strokeWeight(6);
      img.arc(80, 80, 80, 60, 0, PI);
      // Pendant
      img.fill(colors[(index + 1) % colors.length]);
      img.noStroke();
      img.triangle(80, 110, 70, 90, 90, 90);
    } else if (index % 5 === 2) {
      // Bowtie
      img.triangle(60, 60, 80, 80, 60, 100);
      img.triangle(100, 60, 80, 80, 100, 100);
      img.rect(76, 76, 8, 8);
    } else if (index % 5 === 3) {
      // Scarf
      img.rect(60, 60, 40, 80);
      img.rect(60, 100, 80, 20);
    } else {
      // Backpack
      img.rect(50, 60, 60, 70, 10);
      // Straps
      img.fill(colors[(index + 2) % colors.length]);
      img.rect(50, 60, 10, 50);
      img.rect(100, 60, 10, 50);
    }
  }
  
  return img;
}

// Preload function - normally would load actual images
function preload() {
  // In a real implementation, we would load actual images here
  // For this example, we'll create placeholder graphics
  
  // Load sound effects (commented out for now)
  // soundEffects.pop = loadSound('pop.mp3');
  // soundEffects.cheer = loadSound('cheer.mp3');
  // soundEffects.click = loadSound('click.mp3');
}

// Setup function
function setup() {
  // Create canvas
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('game-canvas');
  
  // Set text properties
  textFont('Arial, sans-serif');
  textAlign(CENTER, CENTER);
  
  // Create animal graphics
  for (let animal of ANIMALS) {
    animalImages[animal.name] = createAnimalGraphic(animal.name, animal.color);
  }
  
  // Create theme backgrounds
  for (let theme of THEMES) {
    themeImages[theme.name] = createThemeBackground(theme);
  }
  
  // Create clothing items
  for (let category of CATEGORIES) {
    itemImages[category] = [];
    // Create 5 items per category
    for (let i = 0; i < 5; i++) {
      itemImages[category].push(createClothingItem(category, i));
    }
  }
  
  // Initialize selected items
  for (let category of CATEGORIES) {
    selectedItems[category] = null;
  }
  
  // Create stars for the background
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: random(MAIN_AREA_WIDTH),
      y: random(CANVAS_HEIGHT),
      size: random(1, 3),
      speed: random(0.5, 2),
      brightness: random(150, 255),
      twinkleSpeed: random(0.02, 0.05),
      angle: random(TWO_PI)
    });
  }
  
  // Set initial category
  updateItemsInCategory();
}

// Update the items shown in the current category
function updateItemsInCategory() {
  itemsInCategory = itemImages[CATEGORIES[currentCategory]];
}

// Draw function
function draw() {
  background(240);
  
  if (gameState === GAME_STATES.START) {
    drawStartScreen();
  } else if (gameState === GAME_STATES.PLAYING) {
    drawGameScreen();
  } else if (gameState === GAME_STATES.CELEBRATION) {
    drawCelebrationScreen();
  }
}

// Draw the start screen
function drawStartScreen() {
  // Background with gradient
  drawGradientBackground();
  
  // Draw stars
  drawStars();
  
  // Title
  fill(60, 0, 120);
  textSize(40);
  text("Animal Dress-Up Adventure", CANVAS_WIDTH/2, 100);
  
  // Instructions
  fill(80, 40, 120);
  textSize(20);
  text("Help your animal friend get ready for a fun adventure!", CANVAS_WIDTH/2, 160);
  text("Choose an animal and theme, then dress them up!", CANVAS_WIDTH/2, 190);
  
  // Animal selection
  drawAnimalSelection();
  
  // Theme selection
  drawThemeSelection();
  
  // Start button
  drawStartButton();
}

// Draw gradient background
function drawGradientBackground() {
  // Create gradient from top to bottom
  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    const inter = map(y, 0, CANVAS_HEIGHT, 0, 1);
    const c = lerpColor(color(180, 200, 255), color(255, 180, 220), inter);
    stroke(c);
    line(0, y, CANVAS_WIDTH, y);
  }
}

// Draw twinkling stars
function drawStars() {
  for (let star of stars) {
    star.angle += star.twinkleSpeed;
    star.brightness = 150 + sin(star.angle) * 50;
    
    fill(star.brightness);
    noStroke();
    ellipse(star.x, star.y, star.size);
    
    // Move stars down slowly
    star.y += star.speed * 0.1;
    if (star.y > CANVAS_HEIGHT) {
      star.y = 0;
      star.x = random(MAIN_AREA_WIDTH);
    }
  }
}

// Draw animal selection
function drawAnimalSelection() {
  fill(255);
  stroke(200, 100, 200);
  strokeWeight(2);
  rect(CANVAS_WIDTH/2 - 300, 230, 600, 100, 10);
  
  noStroke();
  fill(100, 50, 150);
  textSize(24);
  text("Choose Your Animal", CANVAS_WIDTH/2, 250);
  
  // Draw animal options
  for (let i = 0; i < ANIMALS.length; i++) {
    const x = CANVAS_WIDTH/2 - 200 + i * 200;
    const y = 300;
    
    // Highlight selected animal
    if (i === currentAnimal) {
      fill(255, 220, 220);
      stroke(255, 100, 150);
      strokeWeight(3);
    } else {
      fill(240);
      stroke(200);
      strokeWeight(1);
    }
    
    rect(x - 60, y - 20, 120, 40, 20);
    
    noStroke();
    fill(i === currentAnimal ? color(200, 0, 100) : color(100, 50, 150));
    textSize(16);
    text(ANIMALS[i].name, x, y);
  }
}

// Draw theme selection
function drawThemeSelection() {
  fill(255);
  stroke(100, 200, 200);
  strokeWeight(2);
  rect(CANVAS_WIDTH/2 - 300, 350, 600, 100, 10);
  
  noStroke();
  fill(50, 100, 150);
  textSize(24);
  text("Choose Your Theme", CANVAS_WIDTH/2, 370);
  
  // Draw theme options
  for (let i = 0; i < THEMES.length; i++) {
    const x = CANVAS_WIDTH/2 - 200 + i * 200;
    const y = 420;
    
    // Highlight selected theme
    if (i === currentTheme) {
      fill(220, 240, 255);
      stroke(100, 150, 255);
      strokeWeight(3);
    } else {
      fill(240);
      stroke(200);
      strokeWeight(1);
    }
    
    rect(x - 70, y - 20, 140, 40, 20);
    
    noStroke();
    fill(i === currentTheme ? color(0, 100, 200) : color(50, 100, 150));
    textSize(16);
    text(THEMES[i].name, x, y);
  }
}

// Draw start button
function drawStartButton() {
  // Button shadow
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(CANVAS_WIDTH/2 + 3, 513, 180, 60);
  
  // Button
  if (mouseX > CANVAS_WIDTH/2 - 90 && mouseX < CANVAS_WIDTH/2 + 90 &&
      mouseY > 480 && mouseY < 540) {
    fill(100, 200, 100);
    stroke(50, 150, 50);
  } else {
    fill(120, 220, 120);
    stroke(70, 170, 70);
  }
  strokeWeight(3);
  ellipse(CANVAS_WIDTH/2, 510, 180, 60);
  
  // Button text
  noStroke();
  fill(255);
  textSize(24);
  text("START!", CANVAS_WIDTH/2, 510);
}

// Draw the main game screen
function drawGameScreen() {
  // Draw theme background
  image(themeImages[THEMES[currentTheme].name], 0, 0, MAIN_AREA_WIDTH, CANVAS_HEIGHT);
  
  // Draw sidebar
  drawSidebar();
  
  // Draw base animal
  const animalX = MAIN_AREA_WIDTH/2;
  const animalY = CANVAS_HEIGHT/2 + 50;
  image(animalImages[ANIMALS[currentAnimal].name], animalX - 150, animalY - 200, 300, 400);
  
  // Draw selected items on animal
  for (let category of CATEGORIES) {
    if (selectedItems[category] !== null) {
      // Position items based on category and animal type
      let itemX = animalX;
      let itemY = animalY;
      let itemWidth = 160;
      let itemHeight = 160;
      
      // Adjust position based on category
      switch(category) {
        case 'Hats':
          if (ANIMALS[currentAnimal].name === 'Bunny') {
            itemY = animalY - 190;
          } else if (ANIMALS[currentAnimal].name === 'Kitty') {
            itemY = animalY - 180;
          } else { // Puppy
            itemY = animalY - 170;
          }
          break;
        case 'Tops':
          // Move tops down to not cover the face
          if (ANIMALS[currentAnimal].name === 'Bunny') {
            itemY = animalY - 30;
          } else if (ANIMALS[currentAnimal].name === 'Kitty') {
            itemY = animalY - 20;
          } else { // Puppy
            itemY = animalY - 25;
          }
          itemWidth = 200;
          itemHeight = 180;
          break;
        case 'Bottoms':
          // Move bottoms down to the lower body
          if (ANIMALS[currentAnimal].name === 'Bunny') {
            itemY = animalY + 100;
          } else if (ANIMALS[currentAnimal].name === 'Kitty') {
            itemY = animalY + 110;
          } else { // Puppy
            itemY = animalY + 105;
          }
          itemWidth = 180;
          itemHeight = 160;
          break;
        case 'Shoes':
          itemY = animalY + 170;
          break;
        case 'Accessories':
          if (category === 'Accessories' && selectedItems[category] === 0) {
            // Glasses
            itemY = animalY - 140;
          } else if (category === 'Accessories' && selectedItems[category] === 1) {
            // Necklace
            itemY = animalY - 80;
          } else if (category === 'Accessories' && selectedItems[category] === 2) {
            // Bowtie
            itemY = animalY - 100;
          } else if (category === 'Accessories' && selectedItems[category] === 3) {
            // Scarf
            itemY = animalY - 70;
          } else {
            // Backpack
            itemY = animalY - 50;
          }
          break;
      }
      
      // Draw the item
      const itemImg = itemImages[category][selectedItems[category]];
      image(itemImg, itemX - itemWidth/2, itemY - itemHeight/2, itemWidth, itemHeight);
    }
  }
  
  // Draw dragging item if any
  if (draggingItem) {
    image(draggingItem.img, mouseX - 80, mouseY - 80, 160, 160);
  }
  
  // Draw celebration button - move to the side instead of bottom
  drawCelebrateButton();
}

// Draw the sidebar with clothing categories and items
function drawSidebar() {
  // Sidebar background
  fill(240, 240, 255);
  noStroke();
  rect(MAIN_AREA_WIDTH, 0, SIDEBAR_WIDTH, CANVAS_HEIGHT);
  
  // Title
  fill(80, 40, 120);
  textSize(20);
  text("Dress Up Items", MAIN_AREA_WIDTH + SIDEBAR_WIDTH/2, 30);
  
  // Category tabs
  drawCategoryTabs();
  
  // Items grid
  drawItemsGrid();
  
  // Reset button
  drawResetButton();
  
  // Back button
  drawBackButton();
}

// Draw category tabs
function drawCategoryTabs() {
  const tabWidth = SIDEBAR_WIDTH / CATEGORIES.length;
  
  for (let i = 0; i < CATEGORIES.length; i++) {
    const x = MAIN_AREA_WIDTH + i * tabWidth;
    
    // Tab background
    if (i === currentCategory) {
      fill(255, 220, 220);
      stroke(255, 150, 150);
    } else {
      fill(230, 230, 250);
      stroke(200, 200, 220);
    }
    strokeWeight(1);
    rect(x, 60, tabWidth, 40);
    
    // Tab text - adjust font size based on text length
    noStroke();
    fill(i === currentCategory ? color(200, 0, 100) : color(100, 50, 150));
    
    // Use smaller font for longer category names
    if (CATEGORIES[i] === 'Accessories') {
      textSize(10);
    } else if (CATEGORIES[i] === 'Bottoms' || CATEGORIES[i] === 'Shoes') {
      textSize(11);
    } else {
      textSize(12);
    }
    
    text(CATEGORIES[i], x + tabWidth/2, 80);
  }
}

// Draw items grid
function drawItemsGrid() {
  const gridTop = 120;
  const gridWidth = SIDEBAR_WIDTH - 20;
  const itemSize = 60; // Smaller size for the sidebar display
  const itemsPerRow = 2;
  const itemMargin = (gridWidth - (itemsPerRow * itemSize)) / (itemsPerRow + 1);
  
  // Background
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(MAIN_AREA_WIDTH + 10, gridTop, gridWidth, CANVAS_HEIGHT - gridTop - 70, 5);
  
  // Draw items
  for (let i = 0; i < itemsInCategory.length; i++) {
    const row = Math.floor(i / itemsPerRow);
    const col = i % itemsPerRow;
    const x = MAIN_AREA_WIDTH + 10 + itemMargin + col * (itemSize + itemMargin);
    const y = gridTop + 10 + row * (itemSize + 10);
    
    // Item background
    fill(240);
    stroke(200);
    strokeWeight(1);
    rect(x, y, itemSize, itemSize, 5);
    
    // Draw item
    image(itemsInCategory[i], x, y, itemSize, itemSize);
    
    // Highlight if selected
    if (selectedItems[CATEGORIES[currentCategory]] === i) {
      noFill();
      stroke(255, 100, 100);
      strokeWeight(3);
      rect(x, y, itemSize, itemSize, 5);
    }
  }
  
  // Reset button
  drawResetButton();
  
  // Back button
  drawBackButton();
}

// Draw reset button
function drawResetButton() {
  const x = MAIN_AREA_WIDTH + SIDEBAR_WIDTH/2;
  const y = CANVAS_HEIGHT - 100;
  
  // Button
  if (mouseX > x - 70 && mouseX < x + 70 &&
      mouseY > y - 20 && mouseY < y + 20) {
    fill(255, 150, 150);
    stroke(255, 100, 100);
  } else {
    fill(255, 180, 180);
    stroke(255, 120, 120);
  }
  strokeWeight(2);
  rect(x - 70, y - 20, 140, 40, 20);
  
  // Button text
  noStroke();
  fill(100, 0, 50);
  textSize(16);
  text("Reset Outfit", x, y);
}

// Draw back button
function drawBackButton() {
  const x = MAIN_AREA_WIDTH + SIDEBAR_WIDTH/2;
  const y = CANVAS_HEIGHT - 50;
  
  // Button
  if (mouseX > x - 70 && mouseX < x + 70 &&
      mouseY > y - 20 && mouseY < y + 20) {
    fill(200, 200, 255);
    stroke(150, 150, 255);
  } else {
    fill(220, 220, 255);
    stroke(180, 180, 255);
  }
  strokeWeight(2);
  rect(x - 70, y - 20, 140, 40, 20);
  
  // Button text
  noStroke();
  fill(50, 50, 150);
  textSize(16);
  text("Back to Menu", x, y);
}

// Draw celebrate button
function drawCelebrateButton() {
  // Move button to the right side instead of bottom center
  const x = MAIN_AREA_WIDTH - 100;
  const y = CANVAS_HEIGHT - 50;
  
  // Check if all items are selected
  let allDressed = true;
  for (let category of CATEGORIES) {
    if (selectedItems[category] === null) {
      allDressed = false;
      break;
    }
  }
  
  // Button
  if (allDressed) {
    if (mouseX > x - 90 && mouseX < x + 90 &&
        mouseY > y - 25 && mouseY < y + 25) {
      fill(255, 200, 100);
      stroke(255, 150, 50);
    } else {
      fill(255, 220, 120);
      stroke(255, 170, 70);
    }
  } else {
    fill(200, 200, 200);
    stroke(150, 150, 150);
  }
  strokeWeight(3);
  rect(x - 90, y - 25, 180, 50, 25);
  
  // Button text
  noStroke();
  fill(allDressed ? color(100, 50, 0) : color(100));
  textSize(20);
  text("Celebrate!", x, y);
}

// Draw the celebration screen
function drawCelebrationScreen() {
  // Draw theme background
  image(themeImages[THEMES[currentTheme].name], 0, 0, MAIN_AREA_WIDTH, CANVAS_HEIGHT);
  
  // Draw base animal
  const animalX = MAIN_AREA_WIDTH/2;
  const animalY = CANVAS_HEIGHT/2 + 50;
  image(animalImages[ANIMALS[currentAnimal].name], animalX - 150, animalY - 200, 300, 400);
  
  // Draw selected items on animal
  for (let category of CATEGORIES) {
    if (selectedItems[category] !== null) {
      // Position items based on category (same as in drawGameScreen)
      let itemX = animalX;
      let itemY = animalY;
      
      switch(category) {
        case 'Hats':
          itemX = animalX;
          itemY = animalY - 180;
          break;
        case 'Tops':
          itemX = animalX;
          itemY = animalY - 100;
          break;
        case 'Bottoms':
          itemX = animalX;
          itemY = animalY;
          break;
        case 'Shoes':
          itemX = animalX;
          itemY = animalY + 150;
          break;
        case 'Accessories':
          itemX = animalX;
          itemY = animalY - 140;
          break;
      }
      
      // Draw the item
      const itemImg = itemImages[category][selectedItems[category]];
      image(itemImg, itemX - itemImg.width/2, itemY - itemImg.height/2);
    }
  }
  
  // Draw confetti
  drawConfetti();
  
  // Draw celebration text
  drawCelebrationText();
  
  // Draw continue button
  drawContinueButton();
}

// Draw confetti
function drawConfetti() {
  // Add new confetti particles
  if (frameCount % 5 === 0 && confetti.length < 100) {
    confetti.push({
      x: random(MAIN_AREA_WIDTH),
      y: -20,
      size: random(5, 15),
      speedX: random(-2, 2),
      speedY: random(2, 5),
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.1, 0.1)
    });
  }
  
  // Update and draw confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    
    // Update position
    c.x += c.speedX;
    c.y += c.speedY;
    c.rotation += c.rotationSpeed;
    
    // Draw confetti
    push();
    translate(c.x, c.y);
    rotate(c.rotation);
    fill(c.color);
    noStroke();
    rect(-c.size/2, -c.size/2, c.size, c.size);
    pop();
    
    // Remove if off screen
    if (c.y > CANVAS_HEIGHT + 50) {
      confetti.splice(i, 1);
    }
  }
}

// Draw celebration text
function drawCelebrationText() {
  // Background panel
  fill(0, 0, 0, 100);
  noStroke();
  rect(MAIN_AREA_WIDTH/2 - 200, 50, 400, 100, 20);
  
  // Text
  fill(255, 255, 150);
  textSize(30);
  text("Hooray!", MAIN_AREA_WIDTH/2, 80);
  
  fill(255);
  textSize(18);
  text(`${ANIMALS[currentAnimal].name} is ready for the`, MAIN_AREA_WIDTH/2, 110);
  text(`${THEMES[currentTheme].name}!`, MAIN_AREA_WIDTH/2, 135);
}

// Draw continue button
function drawContinueButton() {
  const x = MAIN_AREA_WIDTH/2;
  const y = CANVAS_HEIGHT - 50;
  
  // Button
  if (mouseX > x - 90 && mouseX < x + 90 &&
      mouseY > y - 25 && mouseY < y + 25) {
    fill(100, 200, 100);
    stroke(50, 150, 50);
  } else {
    fill(120, 220, 120);
    stroke(70, 170, 70);
  }
  strokeWeight(3);
  rect(x - 90, y - 25, 180, 50, 25);
  
  // Button text
  noStroke();
  fill(255);
  textSize(20);
  text("Play Again", x, y);
}

// Mouse pressed event
function mousePressed() {
  if (gameState === GAME_STATES.START) {
    handleStartScreenClick();
  } else if (gameState === GAME_STATES.PLAYING) {
    handleGameScreenClick();
  } else if (gameState === GAME_STATES.CELEBRATION) {
    handleCelebrationScreenClick();
  }
}

// Handle clicks on the start screen
function handleStartScreenClick() {
  // Check animal selection
  for (let i = 0; i < ANIMALS.length; i++) {
    const x = CANVAS_WIDTH/2 - 200 + i * 200;
    const y = 300;
    
    if (mouseX > x - 60 && mouseX < x + 60 &&
        mouseY > y - 20 && mouseY < y + 20) {
      currentAnimal = i;
      // if (soundEffects.click) soundEffects.click.play();
      return;
    }
  }
  
  // Check theme selection
  for (let i = 0; i < THEMES.length; i++) {
    const x = CANVAS_WIDTH/2 - 200 + i * 200;
    const y = 420;
    
    if (mouseX > x - 70 && mouseX < x + 70 &&
        mouseY > y - 20 && mouseY < y + 20) {
      currentTheme = i;
      // if (soundEffects.click) soundEffects.click.play();
      return;
    }
  }
  
  // Check start button
  if (mouseX > CANVAS_WIDTH/2 - 90 && mouseX < CANVAS_WIDTH/2 + 90 &&
      mouseY > 480 && mouseY < 540) {
    gameState = GAME_STATES.PLAYING;
    // if (soundEffects.click) soundEffects.click.play();
  }
}

// Handle clicks on the game screen
function handleGameScreenClick() {
  // Check if clicked in sidebar
  if (mouseX > MAIN_AREA_WIDTH) {
    // Check category tabs
    if (mouseY > 60 && mouseY < 100) {
      const tabWidth = SIDEBAR_WIDTH / CATEGORIES.length;
      const tabIndex = Math.floor((mouseX - MAIN_AREA_WIDTH) / tabWidth);
      
      if (tabIndex >= 0 && tabIndex < CATEGORIES.length) {
        currentCategory = tabIndex;
        updateItemsInCategory();
        // if (soundEffects.click) soundEffects.click.play();
        return;
      }
    }
    
    // Check items grid
    if (mouseY > 120 && mouseY < 400) {
      const gridX = MAIN_AREA_WIDTH + 20;
      const gridY = 120;
      const itemSize = 70;
      const padding = 10;
      const itemsPerRow = 2;
      
      for (let i = 0; i < itemsInCategory.length; i++) {
        const row = Math.floor(i / itemsPerRow);
        const col = i % itemsPerRow;
        const x = gridX + col * (itemSize + padding);
        const y = gridY + row * (itemSize + padding);
        
        if (mouseX > x && mouseX < x + itemSize &&
            mouseY > y && mouseY < y + itemSize) {
          // Select this item
          selectedItems[CATEGORIES[currentCategory]] = i;
          // if (soundEffects.pop) soundEffects.pop.play();
          return;
        }
      }
    }
    
    // Check reset button
    const resetX = MAIN_AREA_WIDTH + SIDEBAR_WIDTH/2;
    const resetY = CANVAS_HEIGHT - 100;
    
    if (mouseX > resetX - 70 && mouseX < resetX + 70 &&
        mouseY > resetY - 20 && mouseY < resetY + 20) {
      // Reset all selected items
      for (let category of CATEGORIES) {
        selectedItems[category] = null;
      }
      // if (soundEffects.click) soundEffects.click.play();
      return;
    }
    
    // Check back button
    const backX = MAIN_AREA_WIDTH + SIDEBAR_WIDTH/2;
    const backY = CANVAS_HEIGHT - 50;
    
    if (mouseX > backX - 70 && mouseX < backX + 70 &&
        mouseY > backY - 20 && mouseY < backY + 20) {
      gameState = GAME_STATES.START;
      // if (soundEffects.click) soundEffects.click.play();
      return;
    }
  } else {
    // Check celebrate button - updated to match the new position
    const celebrateX = MAIN_AREA_WIDTH - 100;
    const celebrateY = CANVAS_HEIGHT - 50;
    
    if (mouseX > celebrateX - 90 && mouseX < celebrateX + 90 &&
        mouseY > celebrateY - 25 && mouseY < celebrateY + 25) {
      
      // Check if all items are selected
      let allDressed = true;
      for (let category of CATEGORIES) {
        if (selectedItems[category] === null) {
          allDressed = false;
          break;
        }
      }
      
      if (allDressed) {
        gameState = GAME_STATES.CELEBRATION;
        confetti = []; // Reset confetti
        // if (soundEffects.cheer) soundEffects.cheer.play();
      }
    }
  }
}

// Handle clicks on the celebration screen
function handleCelebrationScreenClick() {
  // Check continue button
  const x = MAIN_AREA_WIDTH/2;
  const y = CANVAS_HEIGHT - 50;
  
  if (mouseX > x - 90 && mouseX < x + 90 &&
      mouseY > y - 25 && mouseY < y + 25) {
    // Reset selected items
    for (let category of CATEGORIES) {
      selectedItems[category] = null;
    }
    
    // Go back to start screen
    gameState = GAME_STATES.START;
    // if (soundEffects.click) soundEffects.click.play();
  }
}

// Key pressed event
function keyPressed() {
  // For debugging
  if (key === 'd') {
    console.log("Current state:", gameState);
    console.log("Selected items:", selectedItems);
  }
} 