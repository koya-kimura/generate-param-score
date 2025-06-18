// ui/import.js

function loadCSVAndRestoreScoreLog(inputElement) {
    const file = inputElement.files[0];
    if (!file) {
        alert("ファイルが選択されていません！");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const text = event.target.result;
        const lines = text.trim().split("\n");
        const headers = lines[0].split(",");

        const timeIdx = headers.indexOf("タイムコード");
        const nameIdx = headers.indexOf("描画関数名");
        const scoreIdx = headers.indexOf("スコア");
        const paramKeys = headers.slice(2, scoreIdx);

        const restored = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",");
            const entry = {
                timestamp: cols[timeIdx],
                patternName: cols[nameIdx],
                params: {},
                score: parseFloat(cols[scoreIdx])
            };
            paramKeys.forEach((key, j) => {
                entry.params[key] = parseFloat(cols[2 + j]);
            });
            restored.push(entry);
        }

        // 🔧 scoreLog を上書き
        scoreLog.length = 0;
        restored.forEach(e => scoreLog.push(e));

        // ✅ scoreLog が空だったら終了（ここでチェックする）
        if (scoreLog.length === 0) {
            alert("読み込んだCSVに有効なデータがありません！");
            return;
        }

        alert(`評価データ ${scoreLog.length} 件を読み込みました！`);

        // ✅ 読み込み完了後に明示的に再評価モードを開始
        isReevaluationMode = true;
        reevaluationIndex = 0;
        showReevaluationItem(); // ← 必ず最後に呼ぶ
    };

    reader.readAsText(file);

    isReevaluationMode = true;
    reevaluationIndex = 0;
    showReevaluationItem();
}