// ========================================
// TEXT-TO-SPEECH
// ----------------------------------------
// Reads corrected sentences aloud using the browser's built-in Web Speech
// API (`speechSynthesis`). No external TTS provider, key, or network call is
// required — the voices ship with the user's operating system / browser and
// work offline, which keeps this feature self-contained for the frontend.
// ========================================

// Map the tool's short language codes (as returned by the checker's
// `detected_language`, e.g. "EN", "de", "pt") to BCP-47 tags the speech
// engine understands.
const LANG_MAP: Record<string, string> = {
  auto: "",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  nl: "nl-NL",
  pl: "pl-PL",
  ru: "ru-RU",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ar: "ar-SA",
};

export function isTTSSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

function resolveVoiceLang(language?: string): string {
  if (!language) return "";
  const code = language.trim().toLowerCase();
  if (LANG_MAP[code] !== undefined) return LANG_MAP[code];
  // Already a BCP-47 tag (e.g. "en-GB") — pass through.
  if (code.includes("-")) return language;
  return "";
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (!lang) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  const base = lang.split("-")[0].toLowerCase();
  // Prefer an exact locale match, then any voice sharing the base language.
  return (
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ||
    null
  );
}

export interface SpeakOptions {
  language?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Speak `text` aloud. Cancels any in-progress speech first so rapid clicks
 * never stack up. Safe to call on the server (no-op).
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!isTTSSupported()) {
    options.onError?.();
    return;
  }
  const trimmed = (text || "").trim();
  if (!trimmed) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  const lang = resolveVoiceLang(options.language);
  if (lang) {
    utterance.lang = lang;
    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;
  }
  utterance.rate = 0.95; // Slightly slower — this is a learning aid.
  utterance.pitch = 1;

  if (options.onStart) utterance.onstart = () => options.onStart?.();
  if (options.onEnd) utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => options.onError?.();

  // Voices can load asynchronously on first use; if none are ready yet,
  // wait once for them before speaking so the correct voice is picked.
  if (lang && synth.getVoices().length === 0) {
    const speakOnce = () => {
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;
      synth.speak(utterance);
      synth.removeEventListener("voiceschanged", speakOnce);
    };
    synth.addEventListener("voiceschanged", speakOnce);
    // Fallback in case the event never fires.
    setTimeout(() => {
      if (!synth.speaking) {
        synth.removeEventListener("voiceschanged", speakOnce);
        synth.speak(utterance);
      }
    }, 250);
    return;
  }

  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (!isTTSSupported()) return;
  window.speechSynthesis.cancel();
}
