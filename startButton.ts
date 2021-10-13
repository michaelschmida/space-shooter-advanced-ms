import p5 = require('p5');
import { p } from './index';

export class StartButton {
    private static image: p5.Image;
    public static width = 410;
    public static height = 121;

    static preload() {
        StartButton.image = p.loadImage(
            `https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/assets/Start_BTN.png`
        );
    }

    constructor(public x: number, public y: number) {}

    draw() {
        p.push();
        p.translate(this.x, this.y);
        p.image(
            StartButton.image,
            (StartButton.width / 2) * -1,
            (StartButton.height / 2) * -1,
            StartButton.width,
            StartButton.height
        );
        p.pop();
    }

    get left() {
        return this.x - StartButton.width / 2;
    }

    get top() {
        return this.y - StartButton.height / 2;
    }

    get right() {
        return this.x + StartButton.width / 2;
    }

    get bottom() {
        return this.y + StartButton.height / 2;
    }
}
