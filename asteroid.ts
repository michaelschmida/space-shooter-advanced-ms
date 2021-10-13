import p5 = require('p5');
import { p } from './index';
import { Laser } from './laser';
import { collideRectCircle } from 'p5collide';

export class Asteroid {
    private static image?: p5.Image;
    private speed = Math.random() + 1;

    static preload(p: p5) {
        this.image = p.loadImage(
            'https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/img/asteroid.png'
        );
    }

    constructor(public x: number, public y: number, public size: number) {}

    drawStatic() {
        p.image(Asteroid.image, this.x, this.y, this.size, this.size);
    }

    get randomSpeed() {
        return this.speed;
    }

    draw() {
        p.push();
        p.translate(this.x, this.y);
        p.image(Asteroid.image, this.size / -2, this.size / -2, this.size, this.size);
        p.pop();
    }

    static getCollidingLasers(lasers: Laser[], asteroids: Asteroid[]): { laserIndex: number; asteroidIndex: number }[] {
        const asteroidCollisions: {
            laserIndex: number;
            asteroidIndex: number;
        }[] = [];
        for (let l = 0; l < lasers.length; l++) {
            for (let a = 0; a < asteroids.length; a++) {
                if (
                    collideRectCircle(
                        lasers[l].x - 2,
                        lasers[l].y - 20,
                        4,
                        20,
                        asteroids[a].x,
                        asteroids[a].y,
                        asteroids[a].size
                    )
                ) {
                    asteroidCollisions.push({ laserIndex: l, asteroidIndex: a });
                }
            }
        }

        return asteroidCollisions;
    }
}
