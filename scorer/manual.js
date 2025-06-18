// scorer/manual.js

// 評価結果を一時保存するリスト
const scoreLog = [];

// 現在のスコア（ボタンで選択される）
let currentScore = null;

// 評価ボタン生成 & イベント追加（UI初期化時に呼ぶ）
function createManualScoringUI(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "<p>このアートの評価（5段階）：</p>";

    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.addEventListener("click", () => {
            currentScore = i;
            recordScore(); // 評価記録＋ログ表示
        });
        container.appendChild(btn);
    }
}

// 評価を記録する関数
function recordScore() {
    if (!selectedPattern || !currentParams) return;

    // ✅ 再評価モードは常に手動上書き
    if (isReevaluationMode) {
        if (currentScore === null) return;

        scoreLog[reevaluationIndex].score = currentScore;
        console.log(`再評価: ${reevaluationIndex + 1}/${scoreLog.length}`, scoreLog[reevaluationIndex]);

        reevaluationIndex++;
        showReevaluationItem();
        currentScore = null;
        return;
    }

    // ✅ 評価未開始 or 終了済み
    if (evalTotalCount === 0 || evalCurrentIndex >= evalTotalCount) {
        alert("評価を開始してください、またはすべて完了しています。");
        return;
    }

    let score;

    if (isAutoScoringMode) {
        // ✅ 自動評価
        score = calcAutoScore(currentParams);
        score = Math.round(score * 100) / 100; // 小数第2位に丸める
    } else {
        // ✅ 手動評価（currentScoreが未設定なら中断）
        if (currentScore === null) return;
        score = currentScore;
    }

    const now = new Date();
    const timestamp = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    const record = {
        id: (evalCurrentIndex + 1).toString().padStart(4, '0'),
        timestamp: timestamp,
        patternName: selectedPattern.name,
        params: structuredClone(currentParams),
        score: score,
        usedAutoCenters: isAutoScoringMode ? JSON.parse(JSON.stringify(fixedAutoScoreCenters)) : null
    };

    scoreLog.push(record);
    console.log("評価記録:", record);

    evalCurrentIndex++;
    updateEvalProgress();

    if (evalCurrentIndex < evalTotalCount) {
        generateNewArt();
    } else {
        alert("すべての評価が完了しました！");
        currentParams = null;
    }

    currentScore = null;
    
}