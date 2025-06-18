## 実装したいWEBサイト

### 概要

- p5.jsによるランダムなパラメータを用いた描画に対して、スコアをつけてcsvで保存するサイトを実装したいと思っています。
- 以下のような、`generateParams()`と `drawScene(g, params)` が複数用意されているイメージです。
  - 私はこの関数を沢山用意して追加したり、修正したりしていきます。

```JavaScript
function generateParams() {
    return {
        radiusScale: random(0.2, 0.7),
        num: floor(random(5, 20)),
        hue: random(360),
    }
}

function drawScene(g, params) {
    g,push();
    g.textFont("Helvetica");
    g.colorMode(HSB, 360, 100, 100);
    g.translate(g.width / 2, g.height / 2);
    for(let i = 0; i < params.num; i++) {
        g.push();
        g.rotate(TWO_PI * (i / params.num));
        g.fill(params.hue, 100, 100);
        g.textSize(min(width, height) * 0.15);
        g.textAlign(CENTER, CENTER);
        g.translate(min(width, height) * 0.5 * params.radiusScale, 0);
        g.rotate(PI/2);
        g.text("A", 0, 0);
        g.pop();
    }
    g.pop();
}
```

- どの`generateParams()`と `drawScene(g, params)`を選ぶかをWEBサイト内で選ぶことができると良いなと思っています。
- スコアリングについては、1つずつの絵に対して、10段階のスコアをつけるか、任意のパラメーターの点を作って、その点からの距離をとってスコアを入れるパターンの2つを選べるようにすることを考えています。

- 最終的に出力されるcsvのカラムは以下のようなものです。
  - タイムコード、各パラメータ、スコア、全体データの中でのランキング

### Webサイトの要素

- どの`generateParams()`と `drawScene(g, params)`を選ぶかのボタンなど
- 画像もcsv保存するか、csvのみ保存するか、画像のみ保存するか
  - csvのみの場合はcsvのみだが、その他の場合はzipにして保存
- csvを読み込んで評価するモード、csvを読み込むボタン
- 評価中の画像のプレビュー画面および、そのオンオフボタン
- 自分で評価するか、自動評価する点を作るかのモード選択
- 評価する個数を入力するところ
- 自分で評価する場合は5段階の評価ボタン
- 自動評価の場合は、各パラメータの中心点をスライダーなどで決められるようにする
- 2つ以上の点を増やせるようにしたい
- 中断してダウンロードを行うことも可能なように

### 自動評価の場合のスコア生成について

- 点から、正規分布で決めたい
- 2つ以上の点がある場合は、それぞれの点からの距離を取り、高い方を選ぶ