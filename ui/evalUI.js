// 現在の設定スライダーから値を取得し、中心点を追加
function addAutoScoreCenter() {
    const inputs = document.querySelectorAll(".auto-center-input");
    const center = {};

    inputs.forEach(input => {
        const key = input.dataset.key;
        const type = input.dataset.type;
        const val = parseFloat(input.value);

        if (!center[key]) center[key] = {};
        center[key][type] = val;
    });

    autoScoreCenters.push(center);
    console.log("中心点追加:", center);

    updateAutoScoreCenterList();
}

// 現在の中心点リストを表示
function updateAutoScoreCenterList() {
    const container = document.getElementById("auto-center-list");
    container.innerHTML = "";

    autoScoreCenters.forEach((center, idx) => {
        const div = document.createElement("div");
        div.textContent = `#${idx + 1}: ` + Object.entries(center).map(([k, v]) =>
            `${k} = ${v.value} (σ=${v.sigma})`
        ).join(", ");
        container.appendChild(div);
    });
}

// 指定されたparams構造からスライダーを生成（たとえば generateParams() の返り値を使う）
function createAutoScoreSlidersFromParams(params) {
    const container = document.getElementById("auto-center-ui");
    container.innerHTML = "";

    for (const key in params) {
        const pDiv = document.createElement("div");
        pDiv.style.marginBottom = "8px";

        const label = document.createElement("label");
        label.textContent = `${key}: `;

        const valInput = document.createElement("input");
        valInput.type = "range";
        valInput.min = 0;
        valInput.max = 1;
        valInput.step = 0.01;
        valInput.value = normalizeParamValue(params[key]); // 自動初期化
        valInput.className = "auto-center-input";
        valInput.dataset.key = key;
        valInput.dataset.type = "value";

        const sigmaInput = document.createElement("input");
        sigmaInput.type = "range";
        sigmaInput.min = 0.01;
        sigmaInput.max = 0.5;
        sigmaInput.step = 0.01;
        sigmaInput.value = 0.1;
        sigmaInput.className = "auto-center-input";
        sigmaInput.dataset.key = key;
        sigmaInput.dataset.type = "sigma";

        pDiv.appendChild(label);
        pDiv.appendChild(valInput);
        pDiv.appendChild(document.createTextNode(" σ: "));
        pDiv.appendChild(sigmaInput);

        container.appendChild(pDiv);
    }
}

// 値を正規化して表示初期値に使う（0〜1仮定）
function normalizeParamValue(v) {
    if (typeof v === "number") {
        return Math.max(0, Math.min(1, v)); // 0〜1 に切る
    }
    return 0.5;
}