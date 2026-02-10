// ========================================
// STATE MANAGEMENT
// ========================================
let corrections = [];
let fixedCount = 0;
let snippets = JSON.parse(localStorage.getItem("grammarSnippets") || "[]");
const API_ENDPOINT = "subscribe.php";

// ========================================
// DOM ELEMENTS
// ========================================
const textEditor = document.getElementById("textEditor");
const highlightLayer = document.getElementById("highlightLayer");
const checkBtn = document.getElementById("checkBtn");
const acceptAllBtn = document.getElementById("acceptAllBtn");
const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");
const copyBtn = document.getElementById("copyBtn");
const advicePanel = document.getElementById("advicePanel");
const adviceSection = document.getElementById("adviceSection");
const statsSection = document.getElementById("statsSection");
const wordCount = document.getElementById("wordCount");
const issueCount = document.getElementById("issueCount");
const fixedCountEl = document.getElementById("fixedCount");
const detectedLang = document.getElementById("detectedLang");
const languageSelect = document.getElementById("languageSelect");
const styleSelect = document.getElementById("styleSelect");
const toneSelect = document.getElementById("toneSelect");
const ruleModal = document.getElementById("ruleModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

// Snippet elements
const toggleSnippets = document.getElementById("toggleSnippets");
const snippetContainer = document.getElementById("snippetContainer");
const snippetList = document.getElementById("snippetList");
const snippetInput = document.getElementById("snippetInput");
const saveSnippetBtn = document.getElementById("saveSnippetBtn");

// ========================================
// EVENT LISTENERS
// ========================================

textEditor.addEventListener("scroll", () => {
  highlightLayer.scrollTop = textEditor.scrollTop;
  highlightLayer.scrollLeft = textEditor.scrollLeft;
});

textEditor.addEventListener("input", () => {
  updateWordCount();
});

checkBtn.addEventListener("click", async () => {
  const text = textEditor.value.trim();
  if (!text) {
    alert("Please enter some text to check.");
    return;
  }
  await checkGrammar(text);
});

acceptAllBtn.addEventListener("click", () => {
  acceptAllCorrections();
});

clearBtn.addEventListener("click", () => {
  textEditor.value = "";
  corrections = [];
  fixedCount = 0;
  renderHighlights();
  renderAdvicePanel();
  updateStats();
  statsSection.style.display = "none";
  acceptAllBtn.style.display = "none";
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    // Hängt den Text einfach hinten an
    textEditor.value += text;
  } catch (err) {
    console.error("Fehler beim Lesen der Zwischenablage: ", err);
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    // Den aktuellen Wert des Texteditors nehmen
    const textToCopy = textEditor.value;

    // In die Zwischenablage schreiben
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {
    console.error("Fehler beim Kopieren: ", err);
  }
});

// Snippet management
toggleSnippets.addEventListener("click", () => {
  snippetContainer.style.display =
    snippetContainer.style.display === "none" ? "block" : "none";
});

saveSnippetBtn.addEventListener("click", () => {
  const text = snippetInput.value.trim();
  if (text) {
    snippets.push(text);
    localStorage.setItem("grammarSnippets", JSON.stringify(snippets));
    snippetInput.value = "";
    renderSnippets();
  }
});

// Close modal on background click
ruleModal.addEventListener("click", (e) => {
  if (e.target === ruleModal) {
    closeRuleModal();
  }
});

// ========================================
// MAIN GRAMMAR CHECKING FUNCTION
// ========================================
async function checkGrammar(text) {
  checkBtn.disabled = true;
  checkBtn.textContent = "Checking...";
  acceptAllBtn.style.display = "none";
  advicePanel.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Analyzing your text...</p>
                </div>
            `;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        language: languageSelect.value,
        style: styleSelect.value,
        tone: toneSelect.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    corrections = data.corrections || [];
    fixedCount = 0;

    // Update detected language
    if (data.detected_language) {
      detectedLang.textContent = data.detected_language.toUpperCase();
    }

    renderHighlights();
    renderAdvicePanel();
    updateStats();
    statsSection.style.display = "flex";

    if (corrections.length > 0) {
      acceptAllBtn.style.display = "block";
    }
  } catch (error) {
    console.error("Error:", error);
    advicePanel.innerHTML = `
                    <div class="empty-state">
                        <p style="color: #ef4444; font-weight: 600;">Error: ${error.message}</p>
                        <p style="margin-top: 1rem; font-size: 0.9rem;">Please check your API configuration and try again.</p>
                    </div>
                `;
  } finally {
    checkBtn.disabled = false;
    checkBtn.textContent = "Check Grammar";
  }
}

// ========================================
// RENDERING FUNCTIONS
// ========================================

function renderHighlights() {
  const text = textEditor.value;

  if (corrections.length === 0) {
    highlightLayer.innerHTML = "";
    return;
  }

  let htmlParts = [];
  let currentPos = 0;

  const sortedCorrections = [...corrections]
    .filter((c) => !c.ignored)
    .sort((a, b) => a.position - b.position);

  sortedCorrections.forEach((correction) => {
    const start = correction.position;
    const end = start + correction.original.length;

    if (currentPos < start) {
      htmlParts.push(escapeHtml(text.substring(currentPos, start)));
    }

    const actualIndex = corrections.indexOf(correction);

    htmlParts.push(
      `<span class="error-highlight" data-index="${actualIndex}" ` +
        `onmouseover="onHighlightHover(${actualIndex})" ` +
        `onmouseout="onHighlightLeave(${actualIndex})" ` +
        `onclick="clickHighlight(${actualIndex})">${escapeHtml(correction.original)}</span>`,
    );

    currentPos = end;
  });

  if (currentPos < text.length) {
    htmlParts.push(escapeHtml(text.substring(currentPos)));
  }

  highlightLayer.innerHTML = htmlParts.join("");
}

function renderAdvicePanel() {
  if (corrections.length === 0) {
    advicePanel.innerHTML = `
                    <div class="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p style="color: #10b981; font-weight: 600;">No issues found!</p>
                        <p style="margin-top: 0.5rem;">Your text looks great.</p>
                    </div>
                `;
    acceptAllBtn.style.display = "none";
    return;
  }

  const activeCorrections = corrections.filter((c) => !c.ignored);

  if (activeCorrections.length === 0) {
    advicePanel.innerHTML = `
                    <div class="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p style="color: #10b981; font-weight: 600;">All suggestions handled!</p>
                    </div>
                `;
    acceptAllBtn.style.display = "none";
    return;
  }

  advicePanel.innerHTML = activeCorrections
    .map((correction) => {
      const actualIndex = corrections.indexOf(correction);
      return `
                    <div class="advice-card" id="advice-${actualIndex}" 
                         data-index="${actualIndex}"
                         onmouseover="highlightText(${actualIndex})"
                         onmouseout="unhighlightText(${actualIndex})">
                        <div class="advice-error">
                            <strong>Issue:</strong> "${escapeHtml(correction.original)}"
                        </div>
                        <div class="advice-correction">
                            <strong>Suggestion:</strong> "${escapeHtml(correction.correction)}"
                        </div>
                        <div class="advice-explanation">
                            <strong>Reason:</strong> ${escapeHtml(correction.explanation)}
                        </div>
                        <div class="advice-actions">
                            <button class="btn btn-learn" onclick="showGrammarRule(${actualIndex})">
                                📚 Learn More
                            </button>
                            <button class="btn btn-accept" onclick="acceptCorrection(${actualIndex})">
                                Accept
                            </button>
                            <button class="btn btn-ignore" onclick="ignoreCorrection(${actualIndex})">
                                Ignore
                            </button>
                        </div>
                    </div>
                `;
    })
    .join("");
}

// ========================================
// CORRECTION HANDLING
// ========================================

function acceptCorrection(index) {
  const correction = corrections[index];
  if (!correction || correction.ignored) return;

  const text = textEditor.value;
  const start = correction.position;
  const end = start + correction.original.length;

  const newText =
    text.substring(0, start) + correction.correction + text.substring(end);
  textEditor.value = newText;

  const lengthDiff = correction.correction.length - correction.original.length;

  corrections.forEach((c, i) => {
    if (i !== index && c.position > start && !c.ignored) {
      c.position += lengthDiff;
    }
  });

  correction.ignored = true;
  fixedCount++;

  const card = document.getElementById(`advice-${index}`);
  if (card) {
    card.classList.add("dismissed");
  }

  setTimeout(() => {
    renderHighlights();
    renderAdvicePanel();
    updateStats();
  }, 300);
}

function acceptAllCorrections() {
  if (corrections.length === 0) return;

  const activeCorrections = corrections
    .map((c, index) => ({ ...c, originalIndex: index }))
    .filter((c) => !c.ignored)
    .sort((a, b) => b.position - a.position);

  if (activeCorrections.length === 0) return;

  let text = textEditor.value;

  activeCorrections.forEach((correction) => {
    const start = correction.position;
    const end = start + correction.original.length;

    text =
      text.substring(0, start) + correction.correction + text.substring(end);

    corrections[correction.originalIndex].ignored = true;
    fixedCount++;
  });

  textEditor.value = text;

  renderHighlights();
  renderAdvicePanel();
  updateStats();
}

function ignoreCorrection(index) {
  corrections[index].ignored = true;

  const card = document.getElementById(`advice-${index}`);
  if (card) {
    card.classList.add("dismissed");
  }

  setTimeout(() => {
    renderHighlights();
    renderAdvicePanel();
    updateStats();
  }, 300);
}

// ========================================
// BIDIRECTIONAL HOVER & SCROLL SYNC
// ========================================

/**
 * NEW: When hovering over highlighted text in editor
 * → Scroll to and emphasize the corresponding advice card
 */
function onHighlightHover(index) {
  const card = document.getElementById(`advice-${index}`);
  if (card) {
    card.classList.add("emphasized");
    // SCROLL THE ADVICE PANEL TO SHOW THIS CARD
    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
}

function onHighlightLeave(index) {
  const card = document.getElementById(`advice-${index}`);
  if (card) {
    card.classList.remove("emphasized");
  }
}

/**
 * When hovering over advice card
 * → Emphasize the corresponding text highlight
 */
function highlightText(index) {
  const highlights = document.querySelectorAll(
    `.error-highlight[data-index="${index}"]`,
  );
  highlights.forEach((h) => h.classList.add("emphasized"));
}

function unhighlightText(index) {
  const highlights = document.querySelectorAll(
    `.error-highlight[data-index="${index}"]`,
  );
  highlights.forEach((h) => h.classList.remove("emphasized"));
}

function clickHighlight(index) {
  const highlights = document.querySelectorAll(
    `.error-highlight[data-index="${index}"]`,
  );
  highlights.forEach((h) => h.classList.add("clicked"));
  setTimeout(() => {
    highlights.forEach((h) => h.classList.remove("clicked"));
  }, 500);

  const card = document.getElementById(`advice-${index}`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("emphasized");
    setTimeout(() => card.classList.remove("emphasized"), 1000);
  }
}

// ========================================
// GRAMMAR RULE MODAL
// ========================================

async function showGrammarRule(index) {
  const correction = corrections[index];
  if (!correction) return;

  modalTitle.textContent =
    "Grammar Rule: " + (correction.rule_name || "Grammar Error");
  modalBody.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading detailed explanation...</p>
                </div>
            `;
  ruleModal.classList.add("active");

  try {
    // Request detailed rule from API
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get_rule",
        correction: correction,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const rule = data.rule;

    modalBody.innerHTML = `
                    <div class="rule-section">
                        <h3>📖 Rule Explanation</h3>
                        <p>${escapeHtml(rule.explanation || correction.explanation)}</p>
                    </div>

                    <div class="rule-section">
                        <h3>✅ Correct Examples</h3>
                        <div class="examples-grid">
                            ${(rule.correct_examples || [])
                              .map(
                                (ex) => `
                                <div class="example-item correct">
                                    <div class="example-label">✓ Correct</div>
                                    <div class="example-text">${escapeHtml(ex)}</div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>

                    <div class="rule-section">
                        <h3>❌ Incorrect Examples</h3>
                        <div class="examples-grid">
                            ${(rule.incorrect_examples || [])
                              .map(
                                (ex) => `
                                <div class="example-item incorrect">
                                    <div class="example-label">✗ Incorrect</div>
                                    <div class="example-text">${escapeHtml(ex)}</div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>

                    ${
                      rule.quiz
                        ? `
                        <div class="rule-section">
                            <h3>🎯 Quick Quiz</h3>
                            <p><strong>Question:</strong> ${escapeHtml(rule.quiz.question)}</p>
                            <div class="examples-grid" style="margin-top: 1rem;">
                                ${rule.quiz.options
                                  .map(
                                    (opt, i) => `
                                    <div class="example-item" style="cursor: pointer; border-left-color: #6b7280;" 
                                         onclick="checkQuizAnswer(${i}, ${rule.quiz.correct})">
                                        <div class="example-text">${String.fromCharCode(65 + i)}. ${escapeHtml(opt)}</div>
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }
                `;
  } catch (error) {
    console.error("Error loading rule:", error);
    modalBody.innerHTML = `
                    <div class="rule-section">
                        <h3>📖 Rule Explanation</h3>
                        <p>${escapeHtml(correction.explanation)}</p>
                        <p style="margin-top: 1rem; color: #ef4444; font-size: 0.875rem;">
                            Could not load detailed examples. ${error.message}
                        </p>
                    </div>
                `;
  }
}

function checkQuizAnswer(selected, correct) {
  if (selected === correct) {
    alert("✅ Correct! Well done!");
  } else {
    alert(
      "❌ Not quite. The correct answer is option " +
        String.fromCharCode(65 + correct) +
        ".",
    );
  }
}

function closeRuleModal() {
  ruleModal.classList.remove("active");
}

// ========================================
// SNIPPET MANAGEMENT
// ========================================

function renderSnippets() {
  if (snippets.length === 0) {
    snippetList.innerHTML =
      '<p style="text-align: center; color: #9ca3af; padding: 1rem;">No snippets saved yet.</p>';
    return;
  }

  snippetList.innerHTML = snippets
    .map(
      (snippet, index) => `
                <div class="snippet-item">
                    <div class="snippet-text" onclick="insertSnippet(${index})">
                        ${escapeHtml(snippet.substring(0, 60))}${snippet.length > 60 ? "..." : ""}
                    </div>
                    <div class="snippet-actions">
                        <button class="snippet-btn insert" onclick="insertSnippet(${index})">Insert</button>
                        <button class="snippet-btn delete" onclick="deleteSnippet(${index})">Delete</button>
                    </div>
                </div>
            `,
    )
    .join("");
}

function insertSnippet(index) {
  const snippet = snippets[index];
  const cursorPos = textEditor.selectionStart;
  const textBefore = textEditor.value.substring(0, cursorPos);
  const textAfter = textEditor.value.substring(cursorPos);

  textEditor.value = textBefore + snippet + textAfter;
  textEditor.selectionStart = textEditor.selectionEnd =
    cursorPos + snippet.length;
  textEditor.focus();
  updateWordCount();
}

function deleteSnippet(index) {
  if (confirm("Delete this snippet?")) {
    snippets.splice(index, 1);
    localStorage.setItem("grammarSnippets", JSON.stringify(snippets));
    renderSnippets();
  }
}

// ========================================
// STATISTICS
// ========================================

function updateStats() {
  updateWordCount();
  const activeIssues = corrections.filter((c) => !c.ignored).length;
  issueCount.textContent = activeIssues;
  fixedCountEl.textContent = fixedCount;

  if (activeIssues === 0) {
    acceptAllBtn.style.display = "none";
  }
}

function updateWordCount() {
  const text = textEditor.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  wordCount.textContent = words;
}

// ========================================
// UTILITY
// ========================================

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// INITIALIZATION
// ========================================
updateWordCount();
renderSnippets();