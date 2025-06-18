// pattern/patternA.js

// base.js を読み込んでおく（index.html側で <script> の順番に注意）
class PatternA extends ArtPattern {
    constructor() {
        super("パターンA - 円の配列"); // UIに表示する名前
    }

    generateParams() {
        return {
            radiusScale: random(0.2, 0.7),
            num: floor(random(5, 20)),
            hue: random(360),
        };
    }

    drawScene(g, params) {
        g.push();
        g.background(255);
        g.textFont("Helvetica");
        g.colorMode(HSB, 360, 100, 100);
        g.translate(g.width / 2, g.height / 2);

        for (let i = 0; i < params.num; i++) {
            g.push();
            g.rotate(TWO_PI * (i / params.num));
            g.fill(params.hue, 100, 100);
            g.textSize(min(g.width, g.height) * 0.15);
            g.textAlign(CENTER, CENTER);
            g.translate(min(g.width, g.height) * 0.5 * params.radiusScale, 0);
            g.rotate(PI / 2);
            g.text("A", 0, 0);
            g.pop();
        }

        g.pop();
    }
}