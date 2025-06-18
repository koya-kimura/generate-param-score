// scorer/auto.js

// 中心点群（ユーザーがUIで設定する前提）
const autoScoreCenters = [];

// 正規分布ベースのスコア計算（μ: 中心, σ: 分散）
function gaussian(x, mu, sigma = 1) {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * sigma * sigma);
    return coeff * Math.exp(exponent); // ← 絶対値は不要、スコア相対評価でOK
}

// 正規分布の最大値（ピーク）を1とするスコアに正規化する
function normalizedGaussian(x, mu, sigma = 1) {
    return Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
}

// 各パラメータの距離を使って、中心点ごとのスコアを出す
function calcAutoScore(params) {
    if (!fixedAutoScoreCenters || fixedAutoScoreCenters.length === 0) return 0;

    let maxScore = 0;

    for (const center of fixedAutoScoreCenters) {
        let score = 1;

        for (const key in center) {
            const targetValue = params[key];
            const centerValue = center[key].value;
            const sigma = center[key].sigma || 0.1;

            const paramScore = normalizedGaussian(targetValue, centerValue, sigma);
            score *= paramScore;
        }

        maxScore = Math.max(maxScore, score);
    }

    return maxScore;
}