// main.js

// 利用可能なアートクラスをここで登録していく
const artPatterns = [];

// クラスをインスタンス化して登録（今は PatternA のみ）
artPatterns.push(new PatternA());

// 現在の選択されたアートクラス（デフォルトは最初のやつ）
let selectedPattern = artPatterns[0];

// 描画に使うバッファ（p5.Graphics）
let graphicsBuffer;

// 評価対象パラメータ
let currentParams = null;

let evalTotalCount = 0;
let evalCurrentIndex = 0;

let isReevaluationMode = false;
let reevaluationIndex = 0;

let isAutoScoringMode = false;

let fixedAutoScoreCenters = []; // 評価中はこのコピーを使う

function setup() {
    const canvas = createCanvas(512, 512);
    canvas.parent("canvas-container");

    graphicsBuffer = createGraphics(width, height);
    graphicsBuffer.pixelDensity(1);

    populatePatternSelector();
    createManualScoringUI("score-ui"); // ← 評価ボタンの生成！
    generateNewArt();
}

function draw() {
    background(255);
    if (graphicsBuffer) {
        image(graphicsBuffer, 0, 0, width, height);
    }
}

// UIにあるセレクトメニューに登録済みパターンを追加
function populatePatternSelector() {
    const selector = document.getElementById("pattern-selector");
    selector.innerHTML = "";

    artPatterns.forEach((pattern, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = pattern.name;
        selector.appendChild(option);
    });

    // イベントリスナーを追加
    selector.addEventListener("change", (e) => {
        const idx = parseInt(e.target.value);
        selectedPattern = artPatterns[idx];
        generateNewArt();
    });
}

// ランダムなアートを生成
function generateNewArt() {
    if (!selectedPattern) return;
    currentParams = selectedPattern.generateParams();

    graphicsBuffer.clear();
    selectedPattern.drawScene(graphicsBuffer, currentParams);

    if (!isReevaluationMode) {
        createAutoScoreSlidersFromParams(currentParams);
    }

    // ✅ 自動スコアリングモードなら評価を自動で進める
    if (isAutoScoringMode) {
        setTimeout(() => {
            recordScore();
        }, 300); // 少し待ってから実行（描画が完了してから）
    }
}

function startEvaluation() {
    const countInput = document.getElementById("eval-count-input");
    const count = parseInt(countInput.value);
    if (isNaN(count) || count <= 0) {
        alert("評価枚数を1以上に設定してください");
        return;
    }

    evalTotalCount = count;
    evalCurrentIndex = 0;

    updateEvalProgress();

    // ✅ UI切り替え（自動スコア時は評価ボタンを非表示）
    const scoreUI = document.getElementById("score-ui");
    if (isAutoScoringMode) {
        scoreUI.style.display = "none";
    } else {
        scoreUI.style.display = "block";
    }

    generateNewArt();

    // ✅ 中心点の固定化（generateNewArt後なら currentParams も初期化済み）
    fixedAutoScoreCenters = JSON.parse(JSON.stringify(autoScoreCenters));

    if (!isReevaluationMode && !isAutoScoringMode) {
        createAutoScoreSlidersFromParams(currentParams);
    }
}

function updateEvalProgress() {
    const label = document.getElementById("eval-progress-label");
    if (evalTotalCount === 0) {
        label.textContent = "";
    } else {
        label.textContent = `${evalCurrentIndex + 1} / ${evalTotalCount} 枚 評価中`;
    }
}

function showReevaluationItem() {
    if (!isReevaluationMode) return;

    if (!scoreLog || scoreLog.length === 0) {
        alert("再評価データが読み込まれていません！");
        isReevaluationMode = false;
        return;
    }

    if (reevaluationIndex >= scoreLog.length) {
        alert("再評価が完了しました！");
        isReevaluationMode = false;
        return;
    }

    const item = scoreLog[reevaluationIndex];
    const pattern = artPatterns.find(p => p.name === item.patternName);
    if (!pattern) {
        alert(`パターン "${item.patternName}" が見つかりませんでした`);
        reevaluationIndex++;
        showReevaluationItem(); // スキップして次へ
        return;
    }

    selectedPattern = pattern;
    currentParams = item.params;

    graphicsBuffer.clear();
    selectedPattern.drawScene(graphicsBuffer, currentParams);

    updateReevalProgress();
}

function updateReevalProgress() {
    const label = document.getElementById("eval-progress-label");
    label.textContent = `再評価中: ${reevaluationIndex + 1} / ${scoreLog.length}`;
}


function onToggleAutoScoring() {
    const checkbox = document.getElementById("auto-score-toggle");
    isAutoScoringMode = checkbox.checked;
}
