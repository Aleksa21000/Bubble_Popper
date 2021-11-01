// Canvas setup
const canvas = document.querySelector('#canvas1');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let gameSpeed = 1;
let gameOver = false;
context.font = '40px Georgia';

// Mose movements
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false
}

// Mouse down event listener
canvas.addEventListener('mousedown', function (e) {
  mouse.click = true;
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});

// Mouse Up event listener
canvas.addEventListener('mouseup', function () {
  mouse.click = false;
});

// Player class

// Fish swiming left sprite
const playerLeft = new Image();
playerLeft.src = './img/fish_left_swim.png';

// Fish swiming right sprite
const playerRight = new Image();
playerRight.src = './img/fish_right_swim.png';

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 45;
    this.angle = 0;

    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;

    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  movePlayer() {
    const distanceX = this.x - mouse.x;
    const distanceY = this.y - mouse.y;

    // Calculate the angle based on mouse position
    let counterClockwiseAngle = Math.atan2(distanceY, distanceX);
    this.angle = counterClockwiseAngle;

    if (mouse.x != this.x) {
      this.x -= distanceX / 20;
    }
    if (mouse.y != this.y) {
      this.y -= distanceY / 20;
    }
  }

  draw() {
    if (mouse.click) {
      context.lineWidth = 0.2;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }

    // context.fillStyle = 'red';
    // context.beginPath();
    // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.fill();
    // context.closePath();

    // Draw and animate sprite sheet
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    if (this.x >= mouse.x) {
      context.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 70, 0 - 45, this.spriteWidth / 3.5, this.spriteHeight / 3.5);

      if (gameFrame % 3 == 0) {
        this.frame++;
        if (this.frame >= 12) { this.frame = 0 }
        if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }

        if (this.frame < 3) { this.frameY = 0; }
        else if (this.frame < 7) { this.frameY = 1; }
        else if (this.frame < 11) { this.frameY = 2; }
        else { this.frameY = 0; }
      }
    } else {
      context.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 70, 0 - 45, this.spriteWidth / 3.5, this.spriteHeight / 3.5);

      if (gameFrame % 4 == 0) {
        this.frame++;
        if (this.frame >= 12) { this.frame = 0 }
        if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }

        if (this.frame < 0) { this.frameY = 2; }
        else if (this.frame < 7) { this.frameY = 1; }
        else if (this.frame < 11) { this.frameY = 0; }
        else { this.frameY = 2; }
      }
    }

    context.restore();
  }
}
const player = new Player();

// Bubbles
const bubblesArr = [];
const bubbleImage = new Image();
bubbleImage.src = './img/bubble_pop_frame_01.png';

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.frame = 0;
    this.distance;

    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }

  moveBubble() {
    this.y -= this.speed;
    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;

    // Formula for distance between fish and bubble
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  draw() {
    // context.fillStyle = '#2A9EE5';
    // context.beginPath();
    // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.fill();
    // context.closePath();
    // context.stroke();
    context.drawImage(bubbleImage, this.x - 68, this.y - 68, this.radius * 2.7, this.radius * 2.7);
  }
}

// Sound 1
const bubbleSound1 = document.createElement('audio');
bubbleSound1.src = './sound/Plop.ogg';

// Sound 2
const bubbleSound2 = document.createElement('audio');
bubbleSound2.src = './sound/bubbles-single2.wav';

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArr.push(new Bubble());
  }

  for (let i = 0; i < bubblesArr.length; i++) {
    bubblesArr[i].moveBubble();
    bubblesArr[i].draw();

    // Remove the bubble after reaching top
    if (bubblesArr[i].y < 0 - bubblesArr[i].radius * 2) {
      bubblesArr.splice(i, 1);
      i--;
      // Else remove the bubble on the collision with fish
    } else if (bubblesArr[i].distance < bubblesArr[i].radius + player.radius) {
      if (bubblesArr[i].sound == 'sound1') {
        bubbleSound1.play();
      } else {
        bubbleSound2.play();
      }

      bubblesArr.splice(i, 1);
      i--;
      score += 1;
    }
  }
}

// Background
const background = new Image();
background.src = './img/background.png';

const bgObject = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height
}

function handleBackground() {
  bgObject.x1 -= gameSpeed;
  if (bgObject.x1 < -bgObject.width) { bgObject.x1 = bgObject.width; }

  bgObject.x2 -= gameSpeed;
  if (bgObject.x2 < -bgObject.width) { bgObject.x2 = bgObject.width; }

  context.drawImage(background, bgObject.x1, bgObject.y, bgObject.width, bgObject.height);
  context.drawImage(background, bgObject.x2, bgObject.y, bgObject.width, bgObject.height);
}

// Enemies
const enemyImage = new Image();
enemyImage.src = './img/swim_to_left_sheet.png';

// Enemy class
class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 50;
    this.radius = 50;
    this.speed = (Math.random() * 10) + 5;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 256;
    this.spriteHeight = 256;
  }

  draw() {
    // context.fillStyle = 'red';
    // context.beginPath();
    // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.fill();
    // context.closePath();
    // context.stroke();
    context.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 85, this.y - 80, this.spriteWidth / 1.5, this.spriteHeight / 1.5);
  }

  moveEnemy() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 50;
      this.speed = (Math.random() * 10) + 5;
    }

    if (gameFrame % 2 == 0) {
      this.frame++;
      if (this.frame >= 6) { this.frame = 0 }
      if (this.frame == 5) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
    }

    // Collision with player
    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;

    // Formula for distance between player and enemy
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (enemy1.distance < enemy1.radius + player.radius) {
      handleGameOver();
    }
  }
}

const enemy1 = new Enemy();
function handleEnemy() {
  enemy1.draw();
  enemy1.moveEnemy();
}

function handleGameOver() {
  context.fillStyle = '#fff';
  context.fillText('Game Over, Your score: ' + score, 180, 250);
  gameOver = true;
}

// Animation
function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  player.movePlayer();
  handleBubbles();
  handleBackground();
  handleEnemy();
  context.fillStyle = '#000';
  context.fillText('Score: ' + score, 10, 50);
  gameFrame++;
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
}
animate();

window.addEventListener('resize', function () {
  canvasPosition = canvas.getBoundingClientRect();
});