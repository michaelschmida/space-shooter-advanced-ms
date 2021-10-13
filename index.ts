import "./style.css";
import p5 = require('p5');
import { Asteroid } from "./asteroid";
import { Laser, ShotType } from "./laser";
import { Explosion } from "./explosion";
import { Spaceship } from "./spaceship";
import { Stars } from "./stars";
import { Shots } from "./shots";
import { Sounds } from "./sounds";
import { StartButton } from "./startButton";

let spaceship: Spaceship;
let stars: Stars;
let lasers: Laser[] = [];
const asteroids: Asteroid[] = [];
let explosions: Explosion[] = [];
let startButton: StartButton;
let gameOver = false;
let shots: Shots;
let lastShotFrame = 0;
const initialSpeed = 120;
let speed = initialSpeed; // <<< Changing number of asteroids / sec
let hits = 0; // <<< Hit counter
let hitsAsteroid: Asteroid; // <<< Icon for Asteroid hits
const initialSpaceshipX = 250;
const initialSpaceshipY = 360;

export let p: p5;
new p5((p5: p5) => {
    p = p5;
    p.preload = preload;
    p.setup = setup;
    p.draw = draw;
    p.mouseClicked = mouseClicked;
  });

function preload() {
  Spaceship.preload();
  Laser.preload();
  Asteroid.preload(p);
  Explosion.preload();
  Shots.preload();
  StartButton.preload();
  spaceship = new Spaceship(initialSpaceshipX, initialSpaceshipY);
  startButton = new StartButton(250, 320);
  stars = new Stars();
  shots = new Shots(10, 470);
  hitsAsteroid = new Asteroid(470, 468, 20); // <<< Icon for Asteroid hits

  Sounds.preload();
}

function setup() {
  p.createCanvas(500, 400 + 100);

  // <<< Changing number of shots and asteroid speed over time
  setInterval(() => shots.availableShots++, 1000);
  setInterval(() => (speed = Math.max(20, speed - 10)), 2000);
}

function draw() {
  p.background("black");

  if (gameOver) {
    drawGameOver();
    return;
  }

  stars.draw();
  drawAsteroids();
  drawLasers();
  drawSpaceship();
  drawExplosions();
  drawStatusBar();

  detectCollisions();
  checkFire();
}

function drawStatusBar() {
  p.fill("lightgray");
  p.rect(0, 460, 500, 500);
  shots.draw();

  p.textSize(15);
  p.textAlign(p.RIGHT, p.CENTER);
  p.fill("darkred");
  p.stroke("yellow");
  p.text(hits.toString(), 463, 480);
  hitsAsteroid.drawStatic();
  p.noStroke();
}

function drawGameOver() {
  p.textSize(40);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill("white");
  p.noStroke();
  p.text(`GAME OVER\n${hits} Points 👍`, p.width / 2, 150);

  startButton.draw();
}

function mouseClicked() {
  if (gameOver && p.mouseX >= startButton.left && p.mouseX <= startButton.right && p.mouseY >= startButton.top && p.mouseY <= startButton.bottom) {
    lasers.splice(0, lasers.length);
    asteroids.splice(0, asteroids.length);
    explosions.splice(0, explosions.length);
    shots.reset();
    lastShotFrame = 0;
    speed = initialSpeed;
    hits = 0;
    stars = new Stars();
    spaceship.x = initialSpaceshipX;
    spaceship.y = initialSpaceshipY;

    gameOver = false;
  }
}

function checkFire() {
  if (
    p.frameCount > lastShotFrame + 7 &&
    (p.keyIsDown(32) || p.keyIsDown(88) || p.keyIsDown(89)) &&
    shots.availableShots > 0 &&
    !gameOver
  ) {
    lastShotFrame = p.frameCount;

    // <<< Powershots
    if (p.keyIsDown(88) && shots.availableShots >= 2) {
      lasers.push(new Laser(spaceship.x - 5, spaceship.y));
      lasers.push(new Laser(spaceship.x + 5, spaceship.y));
      shots.availableShots -= 2;
      Sounds.powershot.currentTime = 0;
      Sounds.powershot.play();
    } else if (p.keyIsDown(89) && shots.availableShots >= 3) {
      lasers.push(new Laser(spaceship.x, spaceship.y));
      lasers.push(new Laser(spaceship.x, spaceship.y, ShotType.Right));
      lasers.push(new Laser(spaceship.x, spaceship.y, ShotType.Left));
      shots.availableShots -= 3;
      Sounds.powershot.currentTime = 0;
      Sounds.powershot.play();
    } else {
      lasers.push(new Laser(spaceship.x, spaceship.y));
      shots.availableShots--;
      Sounds.laser.currentTime = 0;
      Sounds.laser.play();
    }
  }
}

function drawExplosions() {
  for (const explosion of explosions) {
    explosion.draw();
    explosion.duration++;
  }

  explosions = explosions.filter(e => !e.reachedAnimationEnd);
}

function detectCollisions() {
  const asteroidCollisions = Asteroid.getCollidingLasers(lasers, asteroids);
  explosions.push(
    ...asteroidCollisions.map(c => {
      return new Explosion(lasers[c.laserIndex].x, lasers[c.laserIndex].y);
    })
  );

  for (let i = 0; i < asteroidCollisions.length; i++) {
    hits++;

    Sounds.explosion.currentTime = 0;
    Sounds.explosion.play();

    asteroids.splice(asteroidCollisions[i].asteroidIndex, 1);
    lasers.splice(asteroidCollisions[i].laserIndex, 1);
  }

  if (spaceship.isCollidingWithAsteroids(p, asteroids)) {
    gameOver = true;
  }
}

function drawSpaceship() {
  // https://keycode.info/
  if (p.keyIsDown(p.LEFT_ARROW) && spaceship.x >= 5) spaceship.x -= 5;
  else if (p.keyIsDown(p.RIGHT_ARROW) && spaceship.x <= p.width - 2)
    spaceship.x += 5;

  // <<< Move forward/backward
  if (p.keyIsDown(p.UP_ARROW) && spaceship.y >= 15) spaceship.y -= 5;
  else if (p.keyIsDown(p.DOWN_ARROW) && spaceship.y <= p.height - 35)
    spaceship.y += 5;

  spaceship.draw();
}

function drawAsteroids() {
  if (p.frameCount % speed === 0) {
    asteroids.push(new Asteroid(p.random(0, p.width), 0, 10));
  }

  for (const asteroid of asteroids) {
    asteroid.draw();
    asteroid.y += asteroid.randomSpeed;
    asteroid.size += 0.05;
  }
}

function drawLasers() {
  for (const laser of lasers) {
    laser.draw();
    laser.move();
  }
}
