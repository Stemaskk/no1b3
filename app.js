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
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!fd.has(cb.name)) data[cb.name] = [];
    });
    return data;
}
function sameSet(a = [], b = []) {
    const A = [...a].sort(); const B = [...b].sort();
    return JSON.stringify(A) === JSON.stringify(B);
}

// ---------- correct answers ----------
const correct = {
    "b3-facility": "Computer Labs",                         // Q1
    "b3-ctc": "3418",                                       // Q2
    "b3-floor5": ["Tutoring Lab","Library","MESA"],         // Q3
    "b3-keys": "Library Front Desk",                        // Q4
    "b3-mesa": [                                            // Q5
        "Free food and drinks!",
        "Internship opportunities",
        "Academic Assist",
        "STEM-Oriented Counseling"
    ]
};

const REDIRECT_URL = "https://ohlonecicada.netlify.app/";

// ---------- overall checker ----------
function allAnswersCorrect(ans) {
    const q1 = (ans["b3-facility"] || "").toLowerCase() === correct["b3-facility"].toLowerCase();
    const q2 = (ans["b3-ctc"] || "").trim() === correct["b3-ctc"];
    const q3 = sameSet(ans["b3-floor5"] || [], correct["b3-floor5"]);
    const q4 = (ans["b3-keys"] || "") === correct["b3-keys"];
    const q5 = sameSet(ans["b3-mesa"] || [], correct["b3-mesa"]);
    return q1 && q2 && q3 && q4 && q5;
}

// ---------- modal controls ----------
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("access-modal");
const okBtn = document.getElementById("modal-ok");
function showModal(){ overlay.classList.remove("hidden"); modal.classList.remove("hidden"); overlay.setAttribute("aria-hidden","false"); }
function hideModal(){ overlay.classList.add("hidden"); modal.classList.add("hidden"); overlay.setAttribute("aria-hidden","true"); }

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = allAnswersCorrect(collectForm(form));
    results.textContent = ok ? "All correct! 🎉" : "Not quite — try again.";
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (ok) showModal(); // shows M3SA
});

okBtn.addEventListener("click", () => { hideModal(); window.location.href = REDIRECT_URL; });
overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });
resetAll.addEventListener("click", () => { form.reset(); results.textContent = ""; hideModal(); });
