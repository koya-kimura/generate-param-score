// pattern/base.js

class ArtPattern {
    constructor(name) {
        this.name = name; // UIに表示する名前
    }

    // ランダムなパラメータを生成する関数（サブクラスで必ず実装）
    generateParams() {
        throw new Error("generateParams() must be implemented by subclasses.");
    }

    // p5.Graphics g に描画する関数（サブクラスで必ず実装）
    drawScene(g, params) {
        throw new Error("drawScene() must be implemented by subclasses.");
    }
}