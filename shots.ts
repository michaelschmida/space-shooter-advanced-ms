import p5 = require('p5');
import { p } from './index';

export class Shots {
  private static images: p5.Image[] = [];
  private available = 10;

  static preload() {
    for (let i = 0; i <= 10; i++) {
      Shots.images.push(
        p.loadImage(
          "https://raw.githubusercontent.com/coderdojo-linz/coderdojo-linz.github.io/develop/static/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/assets/shots-" +
            i.toString() +
            ".png"
        )
      );
    }
  }

  constructor(public x: number, public y: number) {}

  reset() {
    this.available = 10;
  }

  set availableShots(value: number) {
    if (value > 10 || value < 0) return;
    this.available = value;
  }

  get availableShots() {
    return this.available;
  }

  draw() {
    p.image(Shots.images[this.available], this.x, this.y, 150, 20);
  }
}
