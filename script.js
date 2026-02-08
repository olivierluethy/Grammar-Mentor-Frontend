lucide.createIcons();

// Kleiner Framer-Motion Effekt nur für die Features-Icons (optional)
// Kann komplett entfernt werden, wenn du keine externen Libs willst
document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".group");
    icons.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            el.style.transform = "translateY(-6px)";
        });
        el.addEventListener("mouseleave", () => {
            el.style.transform = "translateY(0)";
        });
    });
});

// Realistische Simulation: 80–320 User online (für eine neue AI-Tool-Landingpage plausibel)
function getRandomOnlineUsers() {
    // Basiswert + etwas Rauschen + leichte Tageszeit-Simulation
    const base = 140;
    const variation = Math.floor(Math.random() * 80) - 40; // ±40
    const timeFactor = Math.sin(Date.now() / 1000 / 60 / 15) * 30; // sanfte Welle ~alle 15 Min
    return Math.max(80, Math.round(base + variation + timeFactor));
}

function updateOnlineCount() {
    const countEl = document.getElementById("online-count");
    if (countEl) {
        countEl.textContent = getRandomOnlineUsers().toLocaleString();
    }
}

// Sofort setzen + alle 8–14 Sekunden aktualisieren (natürlich wirkend)
updateOnlineCount();
setInterval(updateOnlineCount, 8000 + Math.random() * 6000);

// Character count update
const textarea = document.getElementById("input-textarea");
const wordCount = document.getElementById("word-count");
const charCount = document.getElementById("char-count");
textarea.addEventListener("input", () => {
    const text = textarea.value.trim();
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    wordCount.textContent = `${words} words`;
    charCount.textContent = `${textarea.value.length} characters`;
});

// ────────────────────────────────────────────────
// Hilfsfunktion für temporäre Feedback-Klasse
// ────────────────────────────────────────────────
function addFeedback(btnId, feedbackClasses = ["btn-feedback"], duration = 800) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.classList.add(...feedbackClasses);
    setTimeout(() => {
        btn.classList.remove(...feedbackClasses);
    }, duration);
}

// ────────────────────────────────────────────────
// Paste functionality
// ────────────────────────────────────────────────
document.getElementById("paste-button").addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        textarea.value = text;

        const words = text
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length;
        wordCount.textContent = `${words} words`;
        charCount.textContent = `${text.length} characters`;

        // Feedback
        addFeedback("paste-button");
    } catch (err) {
        console.error("Failed to paste:", err);
    }
});

// ────────────────────────────────────────────────
// Clear functionality
// ────────────────────────────────────────────────
document.getElementById("clear-button").addEventListener("click", () => {
    try {
        textarea.value = "";
        wordCount.textContent = "0 words";
        charCount.textContent = "0 characters";

        // Feedback mit rotem Touch
        addFeedback("clear-button", ["btn-feedback", "btn-feedback-clear"]);
    } catch (err) {
        console.error("Failed to clear:", err);
    }
});

// ────────────────────────────────────────────────
// Copy functionality
// ────────────────────────────────────────────────
document.getElementById("copy-button").addEventListener("click", async () => {
    try {
        const text = textarea.value;
        if (!text) return; // nichts zu kopieren → früh raus

        await navigator.clipboard.writeText(text);

        // Feedback (besonderer Check-Style)
        addFeedback("copy-button", ["btn-feedback", "btn-feedback-copy"], 900);

        // Optional: beliebte "Copied!" Variante (1400 ms sichtbar)
        const btn = document.getElementById("copy-button");
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-4.5 h-4.5"></i> Copied!';
        lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            lucide.createIcons();
        }, 1400);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
});

// Check now button handling with tracking and notification display
document.getElementById("check-now-button").addEventListener("click", async () => {
    // ────────────────────────────────────────────────
    // 1. Read user selections
    // ────────────────────────────────────────────────
    const modeSelect = document.querySelector("select option:checked")?.parentElement; // the <select>
    const correctionMode = modeSelect?.value?.trim() || "Authentic (errors only)";

    const langSelect = document.querySelectorAll("select")[1]; // second select = language
    const language = langSelect?.value?.trim() || "Auto-detect language";

    // ────────────────────────────────────────────────
    // 2. Get elements & clean text (always use plain text for backend & highlighting)
    // ────────────────────────────────────────────────
    const container = document.getElementById("input-textarea");
    if (!container) return;

    const isInitialTextarea = container.tagName === "TEXTAREA";
    const cleanText = isInitialTextarea ? container.value.trim() : container.innerText.trim();

    if (!cleanText) {
        alert("Please enter some text to check.");
        return;
    }

    // ────────────────────────────────────────────────
    // 3. Show loading state
    // ────────────────────────────────────────────────
    const placeholder = document.getElementById("feedback-placeholder");
    const loading = document.getElementById("feedback-loading");
    const resultsDiv = document.getElementById("feedback-results");

    placeholder.classList.add("hidden");
    loading.classList.remove("hidden");
    resultsDiv.classList.add("hidden");
    resultsDiv.innerHTML = "";

    // Disable button during request
    const btn = document.getElementById("check-now-button");
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Checking...';
    lucide.createIcons();

    try {
        // ────────────────────────────────────────────────
        // 4. Send request → always send clean plain text
        // ────────────────────────────────────────────────
        const response = await fetch("https://grammar-mentor.com/subscribe.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: cleanText,
                mode: correctionMode,
                language: language,
            }),
        });

        if (!response.ok) {
            let errorMsg = "Server error";
            try {
                const err = await response.json();
                errorMsg = err.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        const data = await response.json();

        // ────────────────────────────────────────────────
        // 5. Display results
        // ────────────────────────────────────────────────
        if (!data.data?.errors?.length) {
            resultsDiv.innerHTML = `
                <div class="p-5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl text-center">
                    <i data-lucide="check-circle" class="w-10 h-10 text-emerald-400 mx-auto mb-3"></i>
                    <p class="text-emerald-300 font-medium">No issues found</p>
                    <p class="text-sm text-emerald-200/70 mt-1">Your text looks great!</p>
                </div>`;
        } else {
            // ── Highlighting auf Basis des reinen Textes ──
            let offset = 0;
            const fragments = [];

            // Sort just to be safe (normally backend should already sort)
            data.data.errors
                .sort((a, b) => a.start - b.start)
                .forEach((err, index) => {
                    const before = cleanText.slice(offset, err.start);
                    const wrong = cleanText.slice(err.start, err.end);

                    const mark = `<mark class="bg-red-900/40 border-b-2 border-red-500 cursor-help relative group" title="${err.message.replace(/"/g, "&quot;")}">${wrong}</mark>`;

                    fragments.push(before, mark);
                    offset = err.end;

                    // Explanation card
                    const explanation = document.createElement("div");
                    explanation.className =
                        "p-4 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-indigo-600/50 transition-colors";

                    explanation.innerHTML = `
                        <div class="flex items-start gap-3">
                            <div class="mt-0.5">
                                ${index + 1}.
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-red-300">${err.wrong || wrong}</p>
                                <p class="text-sm text-slate-300 mt-1">${err.message}</p>
                                ${
                                    err.suggestion
                                        ? `
                                    <p class="mt-2 text-sm">
                                        <span class="text-slate-400">Suggestion:</span>
                                        <span class="text-emerald-300 font-medium">${err.suggestion}</span>
                                    </p>
                                `
                                        : ""
                                }
                            </div>
                        </div>`;

                    resultsDiv.appendChild(explanation);
                });

            // Rest des Textes
            fragments.push(cleanText.slice(offset));

            const highlightedHTML = fragments.join("");

            // ── Jetzt nur innerHTML aktualisieren ── (egal ob textarea oder div)
            if (isInitialTextarea) {
                // Erste Umwandlung: textarea → contenteditable div
                container.outerHTML = `
                    <div id="input-textarea"
                         contenteditable="true"
                         class="w-full editor-min-h bg-transparent text-lg text-text-primary placeholder-slate-500 border-none focus:ring-0 outline-none resize-none font-medium leading-relaxed prose prose-invert max-w-none">
                        ${highlightedHTML}
                    </div>`;
            } else {
                // Bereits contenteditable → nur Inhalt austauschen
                container.innerHTML = highlightedHTML;
            }
        }
    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = `
            <div class="p-5 bg-red-950/30 border border-red-800/50 rounded-xl">
                <p class="text-red-300 font-medium">Sorry, something went wrong</p>
                <p class="text-sm text-red-200/80 mt-2">${err.message || "Please try again later."}</p>
            </div>`;
    }

    // ────────────────────────────────────────────────
    // 6. Restore UI state
    // ────────────────────────────────────────────────
    loading.classList.add("hidden");
    resultsDiv.classList.remove("hidden");
    btn.disabled = false;
    btn.innerHTML = `
        <i data-lucide="sparkles" class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"></i>
        Check now
    `;
    lucide.createIcons();
});

// Notify button handling with email submission to backend
document.getElementById("notify-button").addEventListener("click", async () => {
    const email = document.getElementById("email-input").value;
    if (!email) return;

    try {
        const response = await fetch("https://grammar-mentor.com/subscribe.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            document.getElementById("thanks-message").classList.remove("hidden");
            document.getElementById("email-input").classList.add("hidden");
            document.getElementById("notify-button").classList.add("hidden");

            gtag("event", "button_click", {
                button: "notify_me",
                page: "home",
                action: "email_submitted",
            });
        } else {
            console.error("Server error:", await response.text());
        }
    } catch (err) {
        console.error("Failed to submit email:", err);
    }
});

// Scroll behavior tracking
// Tracks scroll depth at 25%, 50%, 75%, 100% and sends gtag events
const scrollThresholds = [25, 50, 75, 100];
let scrolledThresholds = [];

function trackScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrollPercent = Math.floor(((scrollTop + clientHeight) / scrollHeight) * 100);

    for (let threshold of scrollThresholds) {
        if (scrollPercent >= threshold && !scrolledThresholds.includes(threshold)) {
            gtag("event", "scroll_depth", {
                depth: `${threshold}%`,
                page: "home",
                action: "scrolled_to_depth",
            });
            scrolledThresholds.push(threshold);
        }
    }
}

window.addEventListener("scroll", trackScroll);
// Initial check in case page is already scrolled
trackScroll();
