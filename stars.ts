import p5 = require('p5');
import { p } from './index';

export class Stars {
    private stars: { x: number; y: number; z: number }[] = [];

    constructor() {}

    draw() {
        // nach einer Lösung von https://editor.p5js.org/amyxiao/sketches/S1qEhKf2Z
        // alte Sterne löschen
        this.stars = this.stars.filter((star) => star.z >= 0);

        // neue Sterne generieren
        for (let i = 0; i < Math.min(50, p.frameCount / 600); i++) {
            this.stars.push({
                x: p.random(-p.width / 2, p.width / 2),
                y: p.random(-p.height / 2, p.height / 2),
                z: p.random(p.width),
            });
        }

        // Sterne zeichnen
        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.fill('white');
        p.noStroke();

        let speed = Math.min(50, p.frameCount / 600 + 1);

        for (const star of this.stars) {
            star.z = star.z - speed;
            // sx = map(star.x / star.z, 0, 1, 0, width);
            // sy = map(star.y / star.z, 0, 1, 0, height);
            // r = map(star.z, 0, width, 8, 0);
            const sx = (star.x / star.z) * p.width;
            const sy = (star.y / star.z) * p.height;
            const r = p.map(star.z, p.width, 0, 0, 8);
            p.circle(sx, sy, r);
        }

        p.pop();
    }
}
