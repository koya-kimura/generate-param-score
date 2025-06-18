// ui/export.js

function downloadCSVFromScoreLog(scoreLog) {
    if (!scoreLog || scoreLog.length === 0) {
        alert("No evaluation data found.");
        return;
    }

    const sampleParams = scoreLog[0].params;
    const paramKeys = Object.keys(sampleParams);
    const headers = ["id", "timestamp", "pattern", ...paramKeys, "score", "usedAutoCenters"];
    const rows = [headers];

    for (const entry of scoreLog) {
        const row = [
            entry.id,
            entry.timestamp,
            entry.patternName,
            ...paramKeys.map(k => entry.params[k]),
            entry.score,
            JSON.stringify(entry.usedAutoCenters || null)
        ];
        rows.push(row);
    }

    const csvContent = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `score_log_${getJSTTimestampForFilename()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
}

// 必ず lib/JSZip.min.js & FileSaver.min.js を index.html に読み込ませること！

async function downloadZIPFromScoreLog(scoreLog) {
    if (!scoreLog || scoreLog.length === 0) {
        alert("No evaluation data found.");
        return;
    }

    const zip = new JSZip();
    const sampleParams = scoreLog[0].params;
    const paramKeys = Object.keys(sampleParams);
    const headers = ["id", "timestamp", "pattern", ...paramKeys, "score", "usedAutoCenters"];
    const rows = [headers];

    scoreLog.forEach((entry, idx) => {
        const row = [
            entry.id,
            entry.timestamp,
            entry.patternName,
            ...paramKeys.map(k => entry.params[k]),
            entry.score,
            JSON.stringify(entry.usedAutoCenters || null)
        ];
        rows.push(row);
    });

    const csvContent = rows.map(r => r.join(",")).join("\n");
    zip.file("score_log.csv", csvContent);

    for (let i = 0; i < scoreLog.length; i++) {
        const entry = scoreLog[i];
        const g = createGraphics(graphicsBuffer.width, graphicsBuffer.height);
        g.pixelDensity(1);
        g.background(255);
        const ptn = artPatterns.find(p => p.name === entry.patternName);
        ptn.drawScene(g, entry.params);
        const base64 = g.canvas.toDataURL("image/png").split(",")[1];
        zip.file(`images/${entry.id}.png`, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `art_score_log_${getJSTTimestampForFilename()}.zip`);
}

function getJSTTimestampForFilename() {
    const now = new Date();
    return now
        .toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" }) // "YYYY-MM-DD HH:mm:ss"
        .replace(/[: ]/g, "-"); // "YYYY-MM-DD-HH-mm-ss"
}