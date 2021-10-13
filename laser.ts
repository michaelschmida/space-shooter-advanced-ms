import p5 = require('p5');
import { p } from './index';

export enum ShotType {
    Up,
    Left,
    Right,
}

export class Laser {
    private static image: p5.Image;
    private age = 0;
    private dx = 0;
    private dy = 0;

    static preload() {
        Laser.image = p.loadImage(
            'https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/img/shot.png'
        );
    }

    constructor(public x: number, public y: number, type: ShotType = ShotType.Up) {
        switch (type) {
            case ShotType.Up:
                this.dy = -10;
                break;
            case ShotType.Left:
                this.dx = -10;
                break;
            case ShotType.Right:
                this.dx = 10;
                break;
            default:
                break;
        }
    }

    draw() {
        p.push();
        p.translate(this.x, this.y);
        if (this.dx > 0) p.rotate(67.5);
        else if (this.dx < 0) p.rotate(-67.5);

        const imgNumber = Math.min(3, Math.floor(this.age / 3));
        p.image(Laser.image, -6, 0, 12, 60);
        p.pop();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.age++;
    }
}
