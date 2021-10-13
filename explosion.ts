import p5 = require('p5');
import { p } from './index';

export class Explosion {
    private static images: p5.Image[] = [];
    public duration = 0;

    static preload() {
        for (let i = 1; i <= 10; i++) {
            Explosion.images.push(
                p.loadImage(
                    'https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/img/shot6_exp' +
                        i.toString() +
                        '.png'
                )
            );
        }
    }

    constructor(public x: number, public y: number) {}

    get reachedAnimationEnd(): boolean {
        return this.duration / 3 > 9;
    }

    draw() {
        p.push();
        p.translate(this.x, this.y);
        p.scale(2);
        let imgNumber = Math.min(9, Math.floor(this.duration / 3));
        p.image(Explosion.images[imgNumber], -24, -24, 48, 48);
        p.pop();
        this.duration++;
    }
}
