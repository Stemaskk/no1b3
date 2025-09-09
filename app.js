// Building 3 — redirect, no popup

document.addEventListener("DOMContentLoaded", () => {
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
        // ensure unchecked checkbox groups appear as empty arrays
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

    // ---------- correct answers ----------
    const correct = {
        "b3-facility": "Computer Labs",
        "b3-ctc": "3418",
        "b3-floor5": ["Tutoring Lab","Library","MESA"],
        "b3-keys": "Library Front Desk",
        "b3-mesa": [
            "Free food and drinks!",
            "Internship opportunities",
            "Academic Assist",
            "STEM-Oriented Counseling"
        ]
    };

    // ---------- redirect ----------
    const REDIRECT_URL = "https://keysandgates.netlify.app/";

    // ---------- checker ----------
    function allAnswersCorrect(ans) {
        const q1 = (ans["b3-facility"] || "").toLowerCase() === correct["b3-facility"].toLowerCase();
        const q2 = (ans["b3-ctc"] || "").trim() === correct["b3-ctc"];
        const q3 = sameSet(ans["b3-floor5"] || [], correct["b3-floor5"]);
        const q4 = (ans["b3-keys"] || "") === correct["b3-keys"];
        const q5 = sameSet(ans["b3-mesa"] || [], correct["b3-mesa"]);
        return q1 && q2 && q3 && q4 && q5;
    }

    // ---------- wire up ----------
    const form = document.getElementById("quiz-form");
    const results = document.getElementById("results");
    const resetAll = document.getElementById("resetAll");

    if (!form || !results) {
        console.error("quiz-form or results not found. Check your HTML ids.");
        return;
    }

    // extra safety: neutralize form action
    form.setAttribute("action", "javascript:void(0)");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const ok = allAnswersCorrect(collectForm(form));
        if (ok) {
            results.textContent = "All correct! Redirecting…";
            // small delay so the message paints before navigation
            setTimeout(() => { window.location.href = REDIRECT_URL; }, 50);
        } else {
            results.textContent = "Not quite — try again.";
        }
        results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    if (resetAll) {
        resetAll.addEventListener("click", () => {
            form.reset();
            results.textContent = "";
        });
    }
});
