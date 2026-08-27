// ========================================
// PERSONALIZED PRACTICE SHEET
// ----------------------------------------
// Builds a printable worksheet from the mistakes a learner actually made,
// with targeted exercises and a separate answer key so they can practise
// each error and check themselves. "Print" opens the browser print dialog,
// which also offers "Save as PDF" — no PDF library or server is needed.
// ========================================

export interface PracticeItem {
  original: string;
  correction: string;
  explanation?: string;
  ruleName?: string;
  // Optional surrounding text so an exercise reads as a real sentence.
  contextBefore?: string;
  contextAfter?: string;
}

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function todayLabel(): string {
  try {
    return new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date().toDateString();
  }
}

function buildExercisesHtml(items: PracticeItem[]): string {
  return items
    .map((item, i) => {
      const before = escapeHtml(item.contextBefore || "");
      const after = escapeHtml(item.contextAfter || "");
      const original = escapeHtml(item.original);
      const rule = item.ruleName ? escapeHtml(item.ruleName) : "";

      // The incorrect sentence the learner has to fix, with the error marked.
      const sentence =
        before || after
          ? `${before}<span class="wrong">${original}</span>${after}`
          : `<span class="wrong">${original}</span>`;

      return `
        <li class="exercise">
          <div class="ex-head">
            <span class="ex-num">${i + 1}</span>
            ${rule ? `<span class="ex-rule">${rule}</span>` : ""}
          </div>
          <p class="ex-label">Find and correct the mistake:</p>
          <p class="ex-sentence">${sentence}</p>
          <div class="ex-answerline"><span class="ex-answerlabel">Your correction:</span></div>
        </li>`;
    })
    .join("");
}

function buildAnswerKeyHtml(items: PracticeItem[]): string {
  return items
    .map((item, i) => {
      const original = escapeHtml(item.original);
      const correction = escapeHtml(item.correction);
      const explanation = item.explanation ? escapeHtml(item.explanation) : "";
      return `
        <li class="answer">
          <div class="ans-head"><span class="ex-num">${i + 1}</span></div>
          <p class="ans-line">
            <span class="ans-wrong">${original}</span>
            <span class="ans-arrow">&rarr;</span>
            <span class="ans-right">${correction}</span>
          </p>
          ${explanation ? `<p class="ans-why">${explanation}</p>` : ""}
        </li>`;
    })
    .join("");
}

export function buildPracticeSheetHtml(items: PracticeItem[]): string {
  const count = items.length;
  const exercises = buildExercisesHtml(items);
  const answers = buildAnswerKeyHtml(items);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Grammar Mentor — Personal Practice Sheet</title>
<style>
  :root { --ink:#1e293b; --muted:#64748b; --line:#cbd5e1; --accent:#4f46e5; --wrong:#dc2626; --right:#059669; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--ink);
    background: #fff;
    line-height: 1.6;
    padding: 32px 40px;
  }
  header { border-bottom: 3px solid var(--accent); padding-bottom: 16px; margin-bottom: 24px; }
  .brand { font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); font-family: Arial, Helvetica, sans-serif; font-weight: 700; }
  h1 { font-size: 26px; margin: 6px 0 4px; }
  .sub { color: var(--muted); font-size: 13px; font-family: Arial, Helvetica, sans-serif; }
  .intro { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 12px 16px; margin: 20px 0 28px; font-size: 14px; color: #3730a3; }
  h2 { font-size: 18px; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--line); font-family: Arial, Helvetica, sans-serif; }
  ol { list-style: none; margin: 0; padding: 0; counter-reset: none; }
  .exercise { padding: 14px 0 18px; border-bottom: 1px dashed var(--line); page-break-inside: avoid; }
  .ex-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .ex-num { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 13px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; }
  .ex-rule { font-size: 11px; font-family: Arial, Helvetica, sans-serif; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; }
  .ex-label { font-size: 12px; color: var(--muted); font-family: Arial, Helvetica, sans-serif; margin: 2px 0 4px; }
  .ex-sentence { font-size: 16px; margin: 4px 0 12px; }
  .wrong { text-decoration: underline wavy var(--wrong); text-underline-offset: 3px; }
  .ex-answerline { border-bottom: 1.5px solid var(--line); height: 26px; position: relative; }
  .ex-answerlabel { position: absolute; bottom: 2px; left: 0; font-size: 11px; color: var(--muted); font-family: Arial, Helvetica, sans-serif; }
  .answers { page-break-before: always; }
  .answer { padding: 10px 0; border-bottom: 1px dashed var(--line); page-break-inside: avoid; }
  .ans-head { margin-bottom: 4px; }
  .ans-line { font-size: 15px; margin: 2px 0; }
  .ans-wrong { color: var(--wrong); text-decoration: line-through; }
  .ans-arrow { margin: 0 8px; color: var(--muted); }
  .ans-right { color: var(--right); font-weight: 700; }
  .ans-why { font-size: 13px; color: var(--muted); margin: 4px 0 0; }
  footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 11px; color: var(--muted); font-family: Arial, Helvetica, sans-serif; text-align: center; }
  .print-hint { text-align: center; margin: 24px 0; }
  .print-hint button { font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; color: #fff; background: var(--accent); border: 0; border-radius: 8px; padding: 10px 22px; cursor: pointer; }
  @media print {
    body { padding: 0; }
    .print-hint { display: none; }
    @page { margin: 18mm; }
  }
</style>
</head>
<body>
  <header>
    <div class="brand">Grammar Mentor</div>
    <h1>Your Personal Practice Sheet</h1>
    <div class="sub">${count} targeted exercise${count === 1 ? "" : "s"} &middot; Generated ${escapeHtml(todayLabel())}</div>
  </header>

  <div class="print-hint">
    <button onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="intro">
    These exercises are built from the mistakes you just made. Work through each one,
    write your correction on the line, then check yourself against the answer key on the
    last page. Reviewing why each one was wrong is where the real learning happens.
  </div>

  <h2>Exercises</h2>
  <ol>${exercises}</ol>

  <section class="answers">
    <h2>Answer Key</h2>
    <ol>${answers}</ol>
  </section>

  <footer>Generated by Grammar Mentor · Keep practising — you've got this.</footer>
</body>
</html>`;
}

/**
 * Open the practice sheet in a new window/tab ready to print. Falls back to a
 * hidden iframe if a popup is blocked. Returns false if the sheet could not be
 * opened at all (e.g. no items).
 */
export function openPracticeSheet(items: PracticeItem[]): boolean {
  if (typeof window === "undefined") return false;
  if (!items || items.length === 0) return false;

  const html = buildPracticeSheetHtml(items);

  const win = window.open("", "_blank");
  if (win && win.document) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    return true;
  }

  // Popup blocked — render into a hidden iframe and print from there.
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return false;
  }
  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1000);
    }
  };
  return true;
}
