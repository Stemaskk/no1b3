// ---------- helpers ----------
function collectForm(formEl) {
    const data = {};
    const fd = new FormData(formEl);

    for (const [name, value] of fd.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else {
            data[name] = value;
        }
    }
    // include unchecked checkbox groups as empty arrays
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!fd.has(cb.name)) data[cb.name] = [];
    });
    return data;
}

function sameSet(a = [], b = []) {
    const A = [...a].sort();
    const B = [...b].sort();
    return JSON.stringify(A) === JSON.stringify(B);
}
function spanOk(text)  { return `<span class="ok">${text}</span>`; }
function spanBad(text) { return `<span class="bad">${text}</span>`; }

// ---------- answer key ----------
// NOTE: For Q1, you didn’t specify the correct facility. I set a sensible default
// ("Learning Commons")—change it below if needed.
const correct = {
    "b3-facility": "Learning Commons",    // <-- change if the real answer is different
    "b3-ctc": "3415",
    "b3-floor5": ["Tutoring Lab", "Library", "MESA"]
};

// Optional redirect after OK (leave empty to disable)
// const REDIRECT_URL = "https://ohlonecicada.netlify.app/";
const REDIRECT_URL = "";

// ---------- checker (no spoilers) ----------
function checkAllAnswers(ans) {
    const lines = [];
    let allCorrect = true;

    // Q1: Facility
    const fac = ans["b3-facility"] || "";
    const facOK = fac === correct["b3-facility"];
    lines.push(`Q1 (Facility): ${fac || "—"} → ${facOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect &&= facOK;

    // Q2: Room number (typed)
    const room = (ans["b3-ctc"] || "").trim();
    const roomOK = room === correct["b3-ctc"];
    lines.push(`Q2 (Comm Tutor Center Room): ${room || "—"} → ${roomOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect &&= roomOK;

    // Q3: Floor 5 multi-answer
    const floor5 = ans["b3-floor5"] || [];
    const floor5OK = sameSet(floor5, correct["b3-floor5"]);
    lines.push(`Q3 (Floor 5): [${floor5.join(", ") || "—"}] → ${floor5OK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect &&= floor5OK;

    // If you add Q4/Q5 later, extend checks here.

    return { html: lines.join("\n"), allCorrect };
}

// ---------- modal controls ----------
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("access-modal");
const okBtn = document.getElementById("modal-ok");
function showModal() {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
}
function hideModal() {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
}

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ans = collectForm(form);
    const { html, allCorrect } = checkAllAnswers(ans);
    results.innerHTML = html;
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });

    if (allCorrect) {
        showModal(); // shows M3SA
    }
});

okBtn.addEventListener("click", () => {
    hideModal();
    if (REDIRECT_URL) window.location.href = REDIRECT_URL;
});

overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

resetAll.addEventListener("click", () => {
    form.reset();
    results.innerHTML = "";
    hideModal();
});
