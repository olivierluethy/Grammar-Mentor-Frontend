"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  createContext,
  useContext,
  useMemo,
  JSX,
} from "react";
import Script from "next/script";
import Head from "next/head";
import {
  Search,
  CheckCheck,
  Trash2,
  ClipboardPaste,
  Copy,
  Loader2,
} from "lucide-react";
import Image from "next/image";

// ========================================
// TYPE DEFINITIONS
// ========================================

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: GtagArgs) => void;
    createLemonSqueezy?: () => void;
    handleGoogleSignIn?: (response: GoogleSignInResponse) => void;
  }
}

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?];

interface GoogleSignInResponse {
  credential: string;
}

interface Correction {
  position: number;
  original: string;
  correction: string;
  explanation: string;
  rule_name?: string;
  type?: string;
  ignored?: boolean;
}

interface User {
  email: string;
  name: string;
}

interface Subscription {
  status: string;
  plan: string;
  validUntil?: string;
}

interface DailyUsage {
  date: string;
  aiExplanations: number;
}

interface SessionData {
  user: User | null;
  subscription: Subscription | null;
}

interface CheckPermissionResult {
  allowed: boolean;
  message?: string;
  remaining?: number;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface LoginResponse {
  success: boolean;
  email?: string;
  name?: string;
  status?: string;
  plan?: string;
  validUntil?: string;
  error?: string;
  message?: string;
}

interface GrammarCheckResponse {
  corrections?: Correction[];
  detected_language?: string;
  error?: string;
}

interface RuleData {
  explanation: string;
  correct_examples?: string[];
  incorrect_examples?: string[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

interface RuleResponse {
  rule?: RuleData;
  error?: string;
}

interface LemonSqueezyConfig {
  apiEndpoint: string;
  checkoutUrls: {
    monthly: string;
    yearly: string;
    lifetime: string;
  };
  checkoutUrl: string;
}

interface SubscriptionState {
  user: User | null;
  subscription: Subscription | null;
  dailyUsage: DailyUsage;
  isPro: boolean;
}

// ========================================
// DEBOUNCE UTILITY
// ========================================

function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number,
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as T & { cancel: () => void };
}

// ========================================
// GTAG HELPER
// ========================================

function gtag(...args: GtagArgs): void {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.fromEntries(args.map((arg, i) => [i, arg])));
    if (window.gtag) {
      window.gtag(...args);
    }
  }
}

// ========================================
// LEMON SQUEEZY CONFIG
// ========================================

const LEMONSQUEEZY_CONFIG: LemonSqueezyConfig = {
  apiEndpoint: "https://api.grammar-mentor.com/lemonsqueezy-api.php",
  checkoutUrls: {
    monthly:
      "https://grammar-mentor.lemonsqueezy.com/checkout/buy/f1ea24e6-4964-46a0-b442-3a659f76ed5a",
    yearly:
      "https://grammar-mentor.lemonsqueezy.com/checkout/buy/4f3f8322-6efa-41d6-b884-8176cbcac195",
    lifetime:
      "https://grammar-mentor.lemonsqueezy.com/checkout/buy/d9b6bd65-57d6-47eb-851e-47278b468439",
  },
  checkoutUrl:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/4f3f8322-6efa-41d6-b884-8176cbcac195",
};

const API_ENDPOINT = "https://api.grammar-mentor.com/subscribe.php";

// ========================================
// SUBSCRIPTION MANAGER CLASS
// ========================================

class SubscriptionManagerClass {
  user: User | null = null;
  subscription: Subscription | null = null;
  dailyUsage: DailyUsage;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.dailyUsage = this.loadDailyUsage();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  init(): void {
    this.loadSession();
    if (typeof window !== "undefined" && window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }
  }

  loadSession(): void {
    if (typeof window === "undefined") return;
    const sessionData = localStorage.getItem("grammar_mentor_session");
    if (sessionData) {
      try {
        const session: SessionData = JSON.parse(sessionData);
        this.user = session.user;
        this.subscription = session.subscription;
        this.notifyListeners();
      } catch (e) {
        console.error("Failed to parse session data:", e);
      }
    }
  }

  saveSession(): void {
    if (typeof window === "undefined") return;
    const sessionData: SessionData = {
      user: this.user,
      subscription: this.subscription,
    };
    localStorage.setItem("grammar_mentor_session", JSON.stringify(sessionData));
  }

  loadDailyUsage(): DailyUsage {
    if (typeof window === "undefined") {
      return { date: new Date().toDateString(), aiExplanations: 0 };
    }
    const today = new Date().toDateString();
    const usageData = localStorage.getItem("grammar_mentor_daily_usage");

    if (usageData) {
      try {
        const usage: DailyUsage = JSON.parse(usageData);
        if (usage.date !== today) return { date: today, aiExplanations: 0 };
        return usage;
      } catch (e) {
        console.error("Failed to parse usage data:", e);
      }
    }
    return { date: today, aiExplanations: 0 };
  }

  saveDailyUsage(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "grammar_mentor_daily_usage",
      JSON.stringify(this.dailyUsage),
    );
  }

  incrementAIExplanationUsage(): void {
    const today = new Date().toDateString();
    if (this.dailyUsage.date !== today) {
      this.dailyUsage = { date: today, aiExplanations: 0 };
    }
    this.dailyUsage.aiExplanations++;
    this.saveDailyUsage();
    this.notifyListeners();
  }

  hasProAccess(): boolean {
    return !!(
      this.subscription &&
      this.subscription.status === "active" &&
      (this.subscription.plan === "pro" ||
        this.subscription.plan === "lifetime")
    );
  }

  canUseAIExplanation(): CheckPermissionResult {
    if (this.hasProAccess()) return { allowed: true };

    const limit = 1;
    const used = this.dailyUsage.aiExplanations;

    if (used >= limit) {
      gtag("event", "limit_reached", {
        event_category: "Upgrade",
        event_label: "Daily AI Explanation Limit Hit",
        value: used,
        remaining: 0,
      });
      return {
        allowed: false,
        message: `You've reached your daily limit of ${limit} AI explanations. Upgrade to Pro for unlimited access.`,
        remaining: 0,
      };
    }
    return { allowed: true, remaining: limit - used };
  }

  canAddSnippet(currentCount: number): CheckPermissionResult {
    if (this.hasProAccess()) return { allowed: true };

    const limit = 10;
    if (currentCount >= limit) {
      gtag("event", "snippet_limit_hit", {
        event_category: "Upgrade",
        event_label: "Snippet Storage Limit Hit",
        value: currentCount,
      });
      return {
        allowed: false,
        message: `Free plan is limited to ${limit} snippets. Upgrade to Pro for unlimited storage.`,
      };
    }
    return { allowed: true, remaining: limit - currentCount };
  }

  checkDocumentLength(wordCount: number): CheckPermissionResult {
    if (this.hasProAccess()) return { allowed: true };

    const limit = 10000;
    if (wordCount > limit) {
      return {
        allowed: false,
        message: `Document exceeds the ${limit.toLocaleString()} word limit for free accounts. Upgrade to Pro for unlimited document length.`,
      };
    }
    return { allowed: true };
  }

  async login(email: string): Promise<LoginResult> {
    try {
      const response = await this.loginWithEmail(email);

      if (response.success) {
        this.user = {
          email: response.email || email,
          name: response.name || email.split("@")[0],
        };

        this.subscription = {
          status: response.status || "free",
          plan: response.plan || "free",
          validUntil: response.validUntil,
        };

        this.saveSession();
        this.notifyListeners();

        gtag("event", "login_success", {
          event_category: "Auth",
          event_label: "Successful Login",
          method: "email_prompt",
          user_plan: this.subscription?.plan || "unknown",
          user_email_domain: this.user.email.split("@")[1] || "unknown",
          value: 1,
        });

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  }

  async loginWithEmail(email: string): Promise<LoginResponse> {
    try {
      const res = await fetch(
        LEMONSQUEEZY_CONFIG.apiEndpoint + "?action=login_with_email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data: LoginResponse = await res.json();

      if (!data.success) {
        return { success: false, error: data.error || "Login failed" };
      }

      return data;
    } catch (err) {
      console.error("Email login fetch error:", err);
      return { success: false, error: "connection error" };
    }
  }

  logout(): void {
    this.user = null;
    this.subscription = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("grammar_mentor_session");
    }
    this.notifyListeners();

    gtag("event", "logout", {
      event_category: "Auth",
      event_label: "User Logged Out",
      value: 1,
    });
  }

  getState(): SubscriptionState {
    return {
      user: this.user,
      subscription: this.subscription,
      dailyUsage: this.dailyUsage,
      isPro: this.hasProAccess(),
    };
  }

  updateSnippetCount(count: number): string {
    return this.hasProAccess() ? `(${count}/∞)` : `(${count}/10)`;
  }
}

// Create singleton instance
const subscriptionManager = new SubscriptionManagerClass();

// ========================================
// SUBSCRIPTION CONTEXT
// ========================================

const SubscriptionContext =
  createContext<SubscriptionManagerClass>(subscriptionManager);

function useSubscription(): SubscriptionState {
  const manager = useContext(SubscriptionContext);
  const [state, setState] = useState<SubscriptionState>(manager.getState());

  useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setState(manager.getState());
    });
    return unsubscribe;
  }, [manager]);

  return state;
}

// ========================================
// RULE MODAL CONTENT COMPONENT
// ========================================

interface RuleModalContentProps {
  rule: RuleData | null;
  correction: Correction;
  isLoading: boolean;
  error: string | null;
}

function RuleModalContent({
  rule,
  correction,
  isLoading,
  error,
}: RuleModalContentProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="text-center p-4 sm:p-8 text-gray-500">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-[3px] border-gray-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
        <p className="text-sm sm:text-base">Loading detailed explanation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
          📖 Rule Explanation
        </h3>
        <p className="text-white leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
          {correction.explanation}
        </p>
        <p className="mt-3 sm:mt-4 text-red-500 text-xs sm:text-sm">
          Could not load detailed examples. {error}
        </p>
      </div>
    );
  }

  const explanation = rule?.explanation || correction.explanation;
  const correctExamples = rule?.correct_examples || [];
  const incorrectExamples = rule?.incorrect_examples || [];
  const hasCorrectExamples = correctExamples.length > 0;
  const hasIncorrectExamples = incorrectExamples.length > 0;

  return (
    <>
      <div className="mb-4 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
          📖 Rule Explanation
        </h3>
        <p className="text-white leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
          {explanation}
        </p>
      </div>

      {hasCorrectExamples && (
        <div className="mb-4 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            ✅ Correct Examples
          </h3>
          <div className="grid gap-2 sm:gap-3 mt-3 sm:mt-4">
            {correctExamples.map((ex, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 rounded-lg border-l-4 bg-emerald-100 border-emerald-500"
              >
                <div className="text-[10px] sm:text-xs font-semibold uppercase mb-1 sm:mb-2 text-emerald-800">
                  ✓ Correct
                </div>
                <div className="text-black text-sm sm:text-base">{ex}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasIncorrectExamples && (
        <div className="mb-4 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            ❌ Incorrect Examples
          </h3>
          <div className="grid gap-2 sm:gap-3 mt-3 sm:mt-4">
            {incorrectExamples.map((ex, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 rounded-lg border-l-4 bg-red-100 border-red-500"
              >
                <div className="text-[10px] sm:text-xs font-semibold uppercase mb-1 sm:mb-2 text-red-800">
                  ✗ Incorrect
                </div>
                <div className="text-black text-sm sm:text-base">{ex}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rule?.quiz && (
        <div className="mb-4 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            🎯 Quick Quiz
          </h3>
          <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base">
            <strong>Question:</strong> {rule.quiz.question}
          </p>
          <div className="grid gap-2">
            {rule.quiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index === rule.quiz!.correct) {
                    alert("✅ Correct! Well done!");
                  } else {
                    alert(
                      `❌ Not quite. The correct answer is option ${String.fromCharCode(
                        65 + rule.quiz!.correct,
                      )}.`,
                    );
                  }
                }}
                className="w-full text-left p-2.5 sm:p-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function GrammarMentor(): JSX.Element {
  // Use subscription context instead of forceUpdate
  const subscriptionState = useSubscription();
  const { user, subscription, isPro } = subscriptionState;

  // State
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [fixedCount, setFixedCount] = useState<number>(0);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [snippetsLoading, setSnippetsLoading] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("--");
  const [language, setLanguage] = useState<string>("auto");
  const [style, setStyle] = useState<string>("neutral");
  const [tone, setTone] = useState<string>("preserve");
  const [snippetInput, setSnippetInput] = useState<string>("");
  const [showSnippets, setShowSnippets] = useState<boolean>(false);
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [ruleData, setRuleData] = useState<RuleData | null>(null);
  const [ruleLoading, setRuleLoading] = useState<boolean>(false);
  const [ruleError, setRuleError] = useState<string | null>(null);
  const [activeCorrection, setActiveCorrection] = useState<Correction | null>(
    null,
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showStylePaywall, setShowStylePaywall] = useState<boolean>(false);
  const [showSnippetPaywall, setShowSnippetPaywall] = useState<boolean>(false);
  const [usageLimitWarning, setUsageLimitWarning] = useState<string>("");
  const [showUsageLimitWarning, setShowUsageLimitWarning] =
    useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: string;
    show: boolean;
  }>({ message: "", type: "success", show: false });

  // Debounced word count state
  const [wordCountValue, setWordCountValue] = useState<number>(0);

  // ── NEW: quiz interest overlay state ──────────────────────────────────────
  const [showQuizOverlay, setShowQuizOverlay] = useState<boolean>(false);
  // ─────────────────────────────────────────────────────────────────────────

  // Refs
  const textEditorRef = useRef<HTMLTextAreaElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  const pageStartRef = useRef<number>(Date.now());

  // ========================================
  // INITIALIZATION
  // ========================================

  useEffect(() => {
    // Load snippets from localStorage with error handling
    if (typeof window !== "undefined") {
      setSnippetsLoading(true);
      try {
        const savedSnippets = localStorage.getItem("grammarSnippets");
        if (savedSnippets) {
          setSnippets(JSON.parse(savedSnippets));
        }
      } catch (e) {
        console.error("Failed to parse snippets:", e);
        localStorage.removeItem("grammarSnippets");
      } finally {
        setSnippetsLoading(false);
      }

      // Load persisted text
      try {
        const savedText = localStorage.getItem("grammar_mentor_text");
        if (savedText) {
          setText(savedText);
        }
      } catch (e) {
        console.error("Failed to load saved text:", e);
      }
    }

    // Initialize subscription manager
    subscriptionManager.init();

    // Initialize Lemon Squeezy
    if (typeof window !== "undefined" && window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }

    // Track time on page
    const handleBeforeUnload = (): void => {
      const seconds = Math.round((Date.now() - pageStartRef.current) / 1000);
      if (seconds > 30) {
        gtag("event", "time_on_tool", {
          event_category: "Engagement",
          event_label: "Seconds on Tool",
          value: seconds,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ========================================
  // GOOGLE SIGN-IN CALLBACK
  // ========================================

  useEffect(() => {
    window.handleGoogleSignIn = async (response: GoogleSignInResponse) => {
      const idToken = response.credential;

      gtag("event", "login_attempt", {
        event_category: "Auth",
        event_label: "Google Sign-In Attempt",
        method: "google_gsi",
        value: 1,
      });

      try {
        const res = await fetch(
          LEMONSQUEEZY_CONFIG.apiEndpoint + "?action=google_login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: idToken }),
          },
        );

        const data = await res.json();

        if (data.success) {
          const result = await subscriptionManager.login(data.email);
          if (result.success) {
            setShowLoginModal(false);

            gtag("event", "login_success", {
              event_category: "Auth",
              event_label: "Google Sign-In Success",
              method: "google_gsi",
              user_plan: data.plan || "unknown",
              value: 1,
            });

            if (data.plan === "free" || data.status !== "active") {
              showToastMessage(
                "Welcome! You are on the Free plan. Upgrade for unlimited features?",
                "warning",
              );
              setTimeout(() => setShowUpgradeModal(true), 1200);
            } else {
              showToastMessage("Welcome! Pro features activated.", "success");
            }
          }
        } else {
          alert(data.error || "Google login failed");
          gtag("event", "login_error", {
            event_category: "Auth",
            event_label: "Google Sign-In Failed",
            error: data.error || "unknown",
          });
        }
      } catch (err) {
        console.error(err);
        alert("Connection error");
        gtag("event", "login_error", {
          event_category: "Auth",
          event_label: "Google Sign-In Connection Error",
        });
      }
    };

    return () => {
      delete window.handleGoogleSignIn;
    };
  }, []);

  // ========================================
  // HIGHLIGHT LAYER SCROLL SYNC
  // ========================================

  useLayoutEffect(() => {
    if (highlightLayerRef.current && textEditorRef.current) {
      highlightLayerRef.current.scrollTop = textEditorRef.current.scrollTop;
      highlightLayerRef.current.scrollLeft = textEditorRef.current.scrollLeft;
    }
  }, [text]);

  // ========================================
  // DEBOUNCED UPDATES
  // ========================================

  const debouncedUpdateWordCount = useMemo(
    () =>
      debounce(() => {
        const trimmedText = text.trim();
        const count = trimmedText ? trimmedText.split(/\s+/).length : 0;
        setWordCountValue(count);
      }, 150),
    [text],
  );

  useEffect(() => {
    debouncedUpdateWordCount();
    return () => debouncedUpdateWordCount.cancel();
  }, [text, debouncedUpdateWordCount]);

  // Persist text to localStorage
  const debouncedPersistText = useMemo(
    () =>
      debounce(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("grammar_mentor_text", text);
        }
      }, 500),
    [text],
  );

  useEffect(() => {
    debouncedPersistText();
    return () => debouncedPersistText.cancel();
  }, [text, debouncedPersistText]);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const showToastMessage = useCallback(
    (message: string, type: "success" | "warning" = "success"): void => {
      setToast({ message, type, show: true });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
    },
    [],
  );

  // ========================================
  // GRAMMAR CHECKING
  // ========================================

  const checkGrammar = async (): Promise<void> => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      alert("Please enter some text to check.");
      return;
    }

    const characterCount = trimmedText.length;
    gtag("event", "grammar_check_submit", {
      event_category: "Tool",
      event_label: `Submitted with ${characterCount} characters`,
      value: characterCount,
      character_count: characterCount,
    });

    gtag("event", "grammar_check", {
      event_category: "Tool",
      event_label: "Check Grammar Clicked",
      value: 1,
    });

    setIsChecking(true);
    // Reset the quiz overlay whenever a new check begins
    setShowQuizOverlay(false);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedText,
          language: language,
          style: style,
          tone: tone,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: GrammarCheckResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const newCorrections = data.corrections || [];
      setCorrections(newCorrections);
      setFixedCount(0);

      if (data.detected_language) {
        setDetectedLanguage(data.detected_language.toUpperCase());
      }

      setShowStats(true);

      const words = trimmedText.split(/\s+/).filter(Boolean).length;
      const issues = newCorrections.filter((c) => !c.ignored).length;

      gtag("event", "text_checked", {
        event_category: "Tool",
        event_label: "Grammar Check Completed",
        value: words,
        issues_found: issues,
        language: language || "auto",
      });

      // ── NEW: show the quiz interest overlay after check completes ─────────
      setShowQuizOverlay(true);
      // ──────────────────────────────────────────────────────────────────────
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setCorrections([]);
      showToastMessage(`Error: ${errorMessage}`, "warning");
    } finally {
      setIsChecking(false);
    }
  };

  // ========================================
  // CORRECTION HANDLING
  // ========================================

  const acceptCorrection = (index: number): void => {
    const correction = corrections[index];
    if (!correction || correction.ignored) return;

    const start = correction.position;
    const end = start + correction.original.length;

    const newText =
      text.substring(0, start) + correction.correction + text.substring(end);
    setText(newText);

    const lengthDiff =
      correction.correction.length - correction.original.length;

    const updatedCorrections = corrections.map((c, i) => {
      if (i === index) {
        return { ...c, ignored: true };
      }
      if (c.position > start && !c.ignored) {
        return { ...c, position: c.position + lengthDiff };
      }
      return c;
    });

    setCorrections(updatedCorrections);
    setFixedCount((prev) => prev + 1);

    gtag("event", "suggestion_accepted", {
      event_category: "Tool",
      event_label: "Single Suggestion Accepted",
      value: 1,
      issue_type: correction.type || "unknown",
      rule_name: correction.rule_name || "unknown",
    });
  };

  const acceptAllCorrections = (): void => {
    if (corrections.length === 0) return;

    const activeCorrections = corrections
      .map((c, index) => ({ ...c, originalIndex: index }))
      .filter((c) => !c.ignored)
      .sort((a, b) => b.position - a.position);

    if (activeCorrections.length === 0) return;

    let newText = text;
    let newFixedCount = fixedCount;

    activeCorrections.forEach((correction) => {
      const start = correction.position;
      const end = start + correction.original.length;
      newText =
        newText.substring(0, start) +
        correction.correction +
        newText.substring(end);
      newFixedCount++;
    });

    setText(newText);
    setFixedCount(newFixedCount);

    const updatedCorrections = corrections.map((c, index) => {
      const activeCorrection = activeCorrections.find(
        (ac) => ac.originalIndex === index,
      );
      if (activeCorrection) {
        return { ...c, ignored: true };
      }
      return c;
    });

    setCorrections(updatedCorrections);

    gtag("event", "accept_all", {
      event_category: "Tool",
      event_label: "Accept All Suggestions",
      value: activeCorrections.length,
      issues_fixed: activeCorrections.length,
    });
  };

  const ignoreCorrection = (index: number): void => {
    const correction = corrections[index];
    const updatedCorrections = corrections.map((c, i) => {
      if (i === index) {
        return { ...c, ignored: true };
      }
      return c;
    });
    setCorrections(updatedCorrections);

    gtag("event", "suggestion_ignored", {
      event_category: "Tool",
      event_label: "Suggestion Ignored",
      value: 1,
      issue_type: correction?.type || "unknown",
      rule_name: correction?.rule_name || "unknown",
    });
  };

  // ========================================
  // GRAMMAR RULE MODAL
  // ========================================

  const showGrammarRule = async (index: number): Promise<void> => {
    const correction = corrections[index];
    if (!correction) return;

    const canUse = subscriptionManager.canUseAIExplanation();

    if (!canUse.allowed) {
      setUsageLimitWarning("⚠️ " + (canUse.message || ""));
      setShowUsageLimitWarning(true);

      setTimeout(() => {
        setShowUpgradeModal(true);
        gtag("event", "upgrade_nudge", {
          event_category: "Limit",
          event_label: "Learn More Blocked → Upgrade Modal",
          value: subscriptionManager.dailyUsage.aiExplanations || 0,
        });
      }, 800);

      return;
    }

    if (!subscriptionManager.hasProAccess()) {
      subscriptionManager.incrementAIExplanationUsage();

      const remaining = 5 - subscriptionManager.dailyUsage.aiExplanations;
      if (remaining <= 2 && remaining > 0) {
        setUsageLimitWarning(
          `ℹ️ Only ${remaining} detailed explanations left today.`,
        );
        setShowUsageLimitWarning(true);
      }
    }

    setModalTitle("Grammar Rule: " + (correction.rule_name || "Grammar Error"));
    setActiveCorrection(correction);
    setRuleData(null);
    setRuleLoading(true);
    setRuleError(null);
    setShowRuleModal(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_rule",
          correction: correction,
        }),
      });

      const data: RuleResponse = await response.json();
      if (data.error) throw new Error(data.error);

      setRuleData(data.rule || null);

      gtag("event", "ai_explanation_view", {
        event_category: "Tool",
        event_label: correction.rule_name || correction.type || "Unknown Rule",
        value: 1,
        has_examples:
          data.rule?.correct_examples || data.rule?.incorrect_examples
            ? "yes"
            : "no",
        has_quiz: data.rule?.quiz ? "yes" : "no",
      });
    } catch (error) {
      console.error("Error loading rule:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setRuleError(errorMessage);
    } finally {
      setRuleLoading(false);
    }
  };

  // ========================================
  // SNIPPET MANAGEMENT
  // ========================================

  const saveSnippet = (): void => {
    const trimmedInput = snippetInput.trim();
    if (!trimmedInput) return;

    const currentCount = snippets.length;
    const permission = subscriptionManager.canAddSnippet(currentCount);

    if (!permission.allowed) {
      setShowSnippetPaywall(true);
      showToastMessage(
        "Free plan limited to 10 snippets. Upgrade to Pro for unlimited storage.",
        "warning",
      );
      return;
    }

    const newSnippets = [...snippets, trimmedInput];
    setSnippets(newSnippets);
    localStorage.setItem("grammarSnippets", JSON.stringify(newSnippets));
    setSnippetInput("");

    showToastMessage("Snippet saved!", "success");

    gtag("event", "snippet_saved", {
      event_category: "Engagement",
      event_label: isPro ? "Pro" : "Free",
      value: currentCount + 1,
      snippet_length: trimmedInput.length,
    });
  };

  const insertSnippet = (index: number): void => {
    const snippet = snippets[index];
    if (!textEditorRef.current) return;

    const cursorPos = textEditorRef.current.selectionStart;
    const textBefore = text.substring(0, cursorPos);
    const textAfter = text.substring(cursorPos);

    const newText = textBefore + snippet + textAfter;
    setText(newText);

    setTimeout(() => {
      if (textEditorRef.current) {
        textEditorRef.current.selectionStart =
          textEditorRef.current.selectionEnd = cursorPos + snippet.length;
        textEditorRef.current.focus();
      }
    }, 0);

    gtag("event", "snippet_inserted", {
      event_category: "Tool",
      event_label: "Snippet Inserted",
      value: 1,
    });
  };

  const deleteSnippet = (index: number): void => {
    if (confirm("Delete this snippet?")) {
      const newSnippets = snippets.filter((_, i) => i !== index);
      setSnippets(newSnippets);
      localStorage.setItem("grammarSnippets", JSON.stringify(newSnippets));

      gtag("event", "snippet_deleted", {
        event_category: "Tool",
        event_label: "Snippet Deleted",
        value: 1,
      });
    }
  };

  // ========================================
  // STYLE SELECT HANDLING
  // ========================================

  const handleStyleChange = (newStyle: string): void => {
    const proStyles = [
      "formal",
      "casual",
      "academic",
      "creative",
      "professional",
      "conversational",
    ];

    if (proStyles.includes(newStyle) && !isPro) {
      setShowStylePaywall(true);
      gtag("event", "paywall_view", {
        event_category: "Upgrade",
        event_label: "Advanced Style Paywall Shown",
        attempted_style: newStyle,
      });
      setStyle("neutral");
      return;
    }

    setStyle(newStyle);

    gtag("event", "style_changed", {
      event_category: "Tool",
      event_label: "Writing Style Changed",
      new_style: newStyle,
    });
  };

  // ========================================
  // LOGIN / AUTH
  // ========================================

  const handleEmailLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!loginEmail || !loginEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    gtag("event", "login_attempt", {
      event_category: "Auth",
      event_label: "Email Login Attempt",
      method: "email_form",
      value: 1,
    });

    const result = await subscriptionManager.login(loginEmail);
    if (result.success) {
      setShowLoginModal(false);

      if (subscription?.plan === "pro" && subscription?.status === "active") {
        showToastMessage(
          "Welcome back! All Pro features are unlocked.",
          "success",
        );
      } else {
        showToastMessage(
          "Welcome! You are on the Free plan. Upgrade for unlimited features?",
          "warning",
        );
        setTimeout(() => setShowUpgradeModal(true), 1200);
      }
    } else {
      alert(result.error || "Login failed. Please try again.");
    }
  };

  // ========================================
  // MODAL FUNCTIONS
  // ========================================

  const openUpgradeModal = (): void => {
    setShowUpgradeModal(true);
    gtag("event", "upgrade_modal_open", {
      event_category: "Modal",
      event_label: "Upgrade Modal Opened",
      value: 1,
    });
  };

  const closeUpgradeModal = (): void => {
    setShowUpgradeModal(false);
    gtag("event", "upgrade_modal_close", {
      event_category: "Modal",
      event_label: "Upgrade Modal Closed",
      value: 1,
    });
  };

  const openLoginModal = (): void => {
    setShowLoginModal(true);
    gtag("event", "login_modal_open", {
      event_category: "Modal",
      event_label: "Login Modal Opened",
      value: 1,
    });
  };

  const closeLoginModal = (): void => {
    setShowLoginModal(false);
  };

  const closeRuleModal = (): void => {
    setShowRuleModal(false);
    setActiveCorrection(null);
    setRuleData(null);
    setRuleError(null);
    gtag("event", "rule_modal_close", {
      event_category: "Modal",
      event_label: "Grammar Rule Modal Closed",
      value: 1,
    });
  };

  // ========================================
  // CLIPBOARD FUNCTIONS
  // ========================================

  const handlePaste = async (): Promise<void> => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText((prev) => prev + clipboardText);
      gtag("event", "button_click", {
        button: "paste",
        page: "home",
        action: "paste_text",
      });
    } catch (err) {
      console.error("Error reading clipboard:", err);
    }
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      gtag("event", "button_click", {
        button: "copy",
        page: "home",
        action: "copy_text",
      });
      showToastMessage("Copied to clipboard!", "success");
    } catch (err) {
      console.error("Error copying:", err);
    }
  };

  const handleClear = (): void => {
    setText("");
    setCorrections([]);
    setFixedCount(0);
    setShowStats(false);
    // ── NEW: also reset the quiz overlay on clear ─────────────────────────
    setShowQuizOverlay(false);
    // ──────────────────────────────────────────────────────────────────────
    localStorage.removeItem("grammar_mentor_text");

    gtag("event", "button_click", {
      button: "clear",
      page: "home",
      action: "clear_text",
    });
  };

  // ========================================
  // SCROLL SYNC
  // ========================================

  const handleEditorScroll = (): void => {
    if (textEditorRef.current && highlightLayerRef.current) {
      highlightLayerRef.current.scrollTop = textEditorRef.current.scrollTop;
      highlightLayerRef.current.scrollLeft = textEditorRef.current.scrollLeft;
    }
  };

  // ========================================
  // HIGHLIGHT RENDERING
  // ========================================

  const renderHighlights = (): JSX.Element | null => {
    if (corrections.length === 0) {
      return null;
    }

    const sortedCorrections = [...corrections]
      .filter((c) => !c.ignored)
      .sort((a, b) => a.position - b.position);

    const parts: JSX.Element[] = [];
    let currentPos = 0;

    sortedCorrections.forEach((correction) => {
      const start = correction.position;
      const end = start + correction.original.length;
      const actualIndex = corrections.indexOf(correction);

      if (currentPos < start) {
        parts.push(
          <span key={`text-${currentPos}`}>
            {text.substring(currentPos, start)}
          </span>,
        );
      }

      parts.push(
        <span
          key={`highlight-${actualIndex}`}
          className="bg-red-500/20 border-b-2 border-red-500 border-dashed rounded cursor-pointer pointer-events-auto transition-all duration-200 hover:bg-red-500/35 hover:scale-[1.02]"
          data-index={actualIndex}
        >
          {correction.original}
        </span>,
      );

      currentPos = end;
    });

    if (currentPos < text.length) {
      parts.push(
        <span key={`text-end-${currentPos}`}>
          {text.substring(currentPos)}
        </span>,
      );
    }

    return <>{parts}</>;
  };

  // ========================================
  // COMPUTED VALUES
  // ========================================

  const activeCorrections = corrections.filter((c) => !c.ignored);
  const issueCountValue = activeCorrections.length;
  const snippetCountText = subscriptionManager.updateSnippetCount(
    snippets.length,
  );

  // ========================================
  // RENDER
  // ========================================

  return (
    <SubscriptionContext.Provider value={subscriptionManager}>
      <Head>
        <title>Grammar Checker - Enhanced</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="assets/logo426x426.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PRESJVG5VB"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PRESJVG5VB', {
            send_page_view: true,
            debug_mode: true
          });
          window.gtag = gtag;
        `}
      </Script>

      {/* Google Sign-In */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />

      {/* Lemon Squeezy */}
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.createLemonSqueezy) {
            window.createLemonSqueezy();
          }
        }}
      />

      {/* Main Container - Mobile optimized padding */}
      <div className="-mb-16 sm:-mb-24 max-w-[1400px] mx-auto bg-gray-900 rounded-xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Usage Limit Warning - Compact on mobile */}
        {showUsageLimitWarning && (
          <div className="bg-amber-100 border border-amber-400 text-amber-800 py-2 sm:py-3 px-3 sm:px-4 rounded-lg my-2 sm:my-4 mx-2 sm:mx-4 text-xs sm:text-sm">
            <strong>{usageLimitWarning}</strong>{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openUpgradeModal();
              }}
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Upgrade to Pro
            </a>{" "}
            for unlimited explanations.
          </div>
        )}

        {/* Controls Bar - Compact mobile layout */}
        <div className="bg-slate-900 py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
            {/* Language */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="py-1.5 sm:py-2 pl-1.5 sm:pl-3 pr-4 sm:pr-8 border-2 border-gray-800 rounded-md bg-white text-black text-[11px] sm:text-sm cursor-pointer transition-colors hover:border-indigo-500 focus:outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10"
              >
                <option value="auto">Auto</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="it">IT</option>
                <option value="pt">PT</option>
                <option value="nl">NL</option>
                <option value="pl">PL</option>
                <option value="ru">RU</option>
                <option value="zh">ZH</option>
                <option value="ja">JA</option>
                <option value="ko">KO</option>
                <option value="ar">AR</option>
              </select>
            </div>

            {/* Writing Style */}
            <div className="flex flex-col gap-0.5 relative">
              <label className="text-[9px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="hidden sm:inline">Writing </span>Style
                {!isPro && (
                  <span className="inline-flex items-center py-0.5 px-1 sm:px-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[7px] sm:text-[9px] font-semibold rounded-full">
                    PRO
                  </span>
                )}
              </label>
              <select
                value={style}
                onChange={(e) => handleStyleChange(e.target.value)}
                className="py-1.5 sm:py-2 pl-1.5 sm:pl-3 pr-4 sm:pr-8 border-2 border-gray-800 rounded-md bg-white text-black text-[11px] sm:text-sm cursor-pointer transition-colors hover:border-indigo-500 focus:outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10"
              >
                <option value="neutral">Neutral</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
                <option value="creative">Creative</option>
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
              </select>
            </div>

            {/* Tone */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="py-1.5 sm:py-2 pl-1.5 sm:pl-3 pr-4 sm:pr-8 border-2 border-gray-800 rounded-md bg-white text-black text-[11px] sm:text-sm cursor-pointer transition-colors hover:border-indigo-500 focus:outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10"
              >
                <option value="preserve">Preserve</option>
                <option value="natural">Natural</option>
                <option value="confident">Confident</option>
                <option value="friendly">Friendly</option>
                <option value="concise">Concise</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 min-h-[400px] sm:min-h-[600px]">
          {/* Editor Section - Compact padding on mobile */}
          <div className="p-3 sm:p-8 text-white border-r border-gray-800 lg:border-b-0 border-b border-gray-200">
            {/* ── MODIFIED: textarea wrapper is now relative for overlay positioning ── */}
            <div className="relative w-full min-h-[200px] sm:min-h-[400px] border-2 border-gray-200 rounded-lg sm:rounded-xl bg-slate-950 transition-colors focus-within:border-indigo-500 focus-within:ring-[3px] focus-within:ring-indigo-500/10">
              <div
                ref={highlightLayerRef}
                className="absolute top-0 left-0 w-full min-h-[200px] sm:min-h-[400px] p-3 sm:p-6 text-sm sm:text-lg leading-[1.6] sm:leading-[1.8] font-['Crimson_Pro',serif] pointer-events-none whitespace-pre-wrap break-words text-transparent overflow-hidden z-[1]"
              >
                {renderHighlights()}
              </div>
              <textarea
                ref={textEditorRef}
                placeholder="Type or paste your text here..."
                spellCheck={false}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onScroll={handleEditorScroll}
                className={`w-full min-h-[200px] sm:min-h-[400px] p-3 sm:p-6 text-sm sm:text-lg leading-[1.6] sm:leading-[1.8] font-['Crimson_Pro',serif] border-none outline-none resize-y bg-transparent relative z-[2] text-white placeholder:text-gray-500 transition-all duration-300${
                  showQuizOverlay ? " blur-sm select-none pointer-events-none" : ""
                }`}
              />

              {/* ── NEW: Quiz interest overlay ───────────────────────────────────── */}
              {showQuizOverlay && (
  <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center rounded-lg sm:rounded-xl bg-slate-950/75 backdrop-blur-[3px] p-6 text-center">
    
    <button
      onClick={() => {
        gtag("event", "quiz_start_clicked", {
          event_category: "engagement",
          event_label: "grammar_quiz_interest",
        });
      }}
      className="flex items-center gap-3 py-4 px-8 rounded-2xl font-bold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 border-none"
    >
      <span className="text-2xl">🎯</span>
      <span>Start Learning</span>
    </button>

    {/* Der motivierende Counter direkt unter dem Button */}
    <div className="mt-5 flex flex-col items-center">
      <p className="text-white text-base sm:text-lg font-semibold tracking-tight">
        Learn from your <span className="text-red-400 underline decoration-red-500/50 underline-offset-4">{5} mistakes</span> now
      </p>
      <p className="mt-1 text-slate-400 text-xs sm:text-sm font-medium">
        Fix them today so you won't make them again.
      </p>
    </div>
    
  </div>
)}

              {/* ─────────────────────────────────────────────────────────────────── */}
            </div>

            {/* Action buttons - Mobile optimized */}
            <div className="mt-3 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 items-center">
              {/* Check Grammar Button - Full width on mobile */}
              <button
                disabled={isChecking}
                onClick={checkGrammar}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-4 sm:px-8 rounded-lg font-semibold cursor-pointer transition-all duration-300 border-none text-sm sm:text-base bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_12px_rgba(102,126,234,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.5)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Check Grammar</span>
                  </>
                )}
              </button>

              {activeCorrections.length > 0 && (
                <>
                  <div className="relative inline-block">
                    {/* Sparkles */}
                    <span className="pointer-events-none absolute -top-1 left-3 text-yellow-300 text-[8px] animate-[ping_1.8s_infinite]">
                      ✦
                    </span>
                    <span className="pointer-events-none absolute -top-2 right-4 text-yellow-200 text-[7px] animate-[ping_2.2s_infinite]">
                      ✧
                    </span>
                    <span className="pointer-events-none absolute -bottom-1 left-5 text-yellow-300 text-[8px] animate-[ping_2s_infinite]">
                      ✦
                    </span>
                    <span className="pointer-events-none absolute -bottom-2 right-3 text-yellow-200 text-[7px] animate-[ping_1.6s_infinite]">
                      ✧
                    </span>

                    <button
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2
        py-2 sm:py-3.5 px-3 sm:px-8 rounded-lg font-semibold cursor-pointer
        transition-all duration-300 text-xs sm:text-base
        bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)]
        hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]"
                      onClick={() => {
                        window.gtag?.("event", "overall_quiz");
                      }}
                    >
                      <span className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                        🎲
                      </span>
                      <span className="hidden sm:inline">Start Quiz</span>
                      <span className="sm:hidden">Quiz</span>
                    </button>
                  </div>
                </>
              )}

              {/* Utility buttons row */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleClear}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 border-none text-xs sm:text-sm bg-gray-500 text-white hover:bg-gray-600"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  title="Paste from clipboard"
                  onClick={handlePaste}
                  className="flex-1 sm:flex-none group flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-slate-700/70 hover:bg-slate-600 border border-slate-600/70 hover:border-slate-500 rounded-lg sm:rounded-xl text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
                >
                  <ClipboardPaste className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Paste</span>
                </button>

                <button
                  type="button"
                  title="Copy to clipboard"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none group flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-slate-700/70 hover:bg-slate-600 border border-slate-600/70 hover:border-slate-500 rounded-lg sm:rounded-xl text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Stats - Compact mobile layout */}
            {showStats && (
              <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-8 mt-3 sm:mt-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Words
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-gray-800">
                    {wordCountValue}
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Issues
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-gray-800">
                    {issueCountValue}
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Fixed
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-gray-800">
                    {fixedCount}
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Lang
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    {detectedLanguage}
                  </span>
                </div>
              </div>
            )}

            {/* Snippet Manager - Compact mobile layout */}
            <div className="mt-3 sm:mt-6 p-2 sm:p-4 bg-gray-50 text-black rounded-lg border-2 border-dashed border-gray-300 relative">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <span className="font-semibold text-gray-800 text-xs sm:text-base flex items-center gap-1 sm:gap-2">
                  📎 <span className="hidden sm:inline">Saved </span>Snippets
                  <span className="text-[10px] sm:text-sm">
                    {snippetCountText}
                  </span>
                  {!isPro && (
                    <span className="inline-flex items-center gap-0.5 py-0.5 px-1 sm:px-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[8px] sm:text-[10px] font-semibold rounded-full">
                      <svg
                        width="8"
                        height="8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="hidden sm:block"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      PRO
                    </span>
                  )}
                </span>
                <button
                  className="bg-purple-500 text-white py-1 px-2 text-[10px] sm:text-xs rounded hover:bg-purple-600 transition-colors"
                  onClick={() => setShowSnippets(!showSnippets)}
                >
                  {showSnippets ? "Hide" : "Show"}
                </button>
              </div>

              {showSnippets && (
                <div>
                  <div className="flex flex-col gap-1.5 sm:gap-2 max-h-[180px] sm:max-h-[280px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {snippets.length === 0 ? (
                      <p className="text-center text-gray-400 p-2 sm:p-4 text-xs sm:text-base">
                        No snippets saved yet.
                      </p>
                    ) : (
                      snippets.map((snippet, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 sm:p-3 rounded-md border border-gray-200 flex justify-between items-center transition-all hover:border-purple-500 hover:shadow-[0_2px_8px_rgba(139,92,246,0.1)]"
                        >
                          <div
                            className="flex-1 text-[11px] sm:text-sm text-gray-600 cursor-pointer truncate mr-2"
                            onClick={() => insertSnippet(index)}
                          >
                            {snippet.substring(0, 40)}
                            {snippet.length > 40 ? "..." : ""}
                          </div>
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                            <button
                              className="py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs border-none rounded cursor-pointer transition-colors bg-purple-500 text-white hover:bg-purple-600"
                              onClick={() => insertSnippet(index)}
                            >
                              Insert
                            </button>
                            <button
                              className="py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs border-none rounded cursor-pointer transition-colors bg-red-500 text-white hover:bg-red-600"
                              onClick={() => deleteSnippet(index)}
                            >
                              Del
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                    <input
                      type="text"
                      className="flex-1 p-1.5 sm:p-2 border-2 border-gray-200 rounded-md text-[11px] sm:text-sm focus:outline-none focus:border-purple-500"
                      placeholder="Enter snippet text..."
                      value={snippetInput}
                      onChange={(e) => setSnippetInput(e.target.value)}
                    />
                    <button
                      className="py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-semibold cursor-pointer transition-all border-none text-[11px] sm:text-sm bg-purple-500 text-white hover:bg-purple-600"
                      onClick={saveSnippet}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advice Section - Compact mobile layout */}
          <div className="bg-slate-900 p-3 sm:p-8 overflow-y-auto max-h-[400px] sm:max-h-[800px]">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
              <h2 className="font-['Crimson_Pro',serif] text-lg sm:text-2xl text-white">
                Suggestions
              </h2>
            </div>
            <div>
              {isChecking ? (
                <div className="text-center p-4 sm:p-8 text-gray-500">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-[3px] border-gray-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-sm sm:text-base">Analyzing your text...</p>
                </div>
              ) : showQuizOverlay ? (
                /* ── NEW: hide suggestions while quiz overlay is shown ───────── */
                <div className="text-center py-6 sm:py-12 px-4 sm:px-8 text-gray-400">
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Complete the quiz to unlock your suggestions.
                  </p>
                </div>
              ) : corrections.length === 0 ? (
                /* ───────────────────────────────────────────────────────────── */
                <div className="text-center py-6 sm:py-12 px-4 sm:px-8 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto mb-3 sm:mb-4 opacity-50 w-12 h-12 sm:w-20 sm:h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-xs sm:text-base">
                    Enter text and click &quot;Check Grammar&quot; to see
                    suggestions
                  </p>
                </div>
              ) : activeCorrections.length === 0 ? (
                <div className="text-center py-6 sm:py-12 px-4 sm:px-8 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto mb-3 sm:mb-4 opacity-50 w-12 h-12 sm:w-20 sm:h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-emerald-500 font-semibold text-sm sm:text-base">
                    All suggestions handled!
                  </p>
                </div>
              ) : (
                activeCorrections.map((correction) => {
                  const actualIndex = corrections.indexOf(correction);
                  return (
                    <div
                      key={actualIndex}
                      id={`advice-${actualIndex}`}
                      data-index={actualIndex}
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 mb-2 sm:mb-4 border-2 border-gray-200 transition-all duration-300 cursor-pointer hover:border-indigo-500 hover:shadow-[0_4px_12px_rgba(102,126,234,0.15)] hover:translate-x-1"
                    >
                      <div className="text-red-500 font-semibold mb-1 sm:mb-2 text-xs sm:text-[15px]">
                        <strong>Issue:</strong> &quot;{correction.original}
                        &quot;
                      </div>
                      <div className="text-emerald-500 font-semibold mb-1 sm:mb-2 text-xs sm:text-[15px]">
                        <strong>Fix:</strong> &quot;{correction.correction}
                        &quot;
                      </div>
                      <div className="text-gray-500 text-[11px] sm:text-sm mb-2 sm:mb-4 leading-relaxed">
                        <strong>Why:</strong> {correction.explanation}
                      </div>
                      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                        <div className="relative inline-block">
                          {/* Sparkles */}
                          <span className="pointer-events-none absolute -top-1 left-3 text-yellow-300 text-[8px] animate-[ping_1.8s_infinite]">
                            ✦
                          </span>
                          <span className="pointer-events-none absolute -top-2 right-4 text-yellow-200 text-[7px] animate-[ping_2.2s_infinite]">
                            ✧
                          </span>
                          <span className="pointer-events-none absolute -bottom-1 left-5 text-yellow-300 text-[8px] animate-[ping_2s_infinite]">
                            ✦
                          </span>
                          <span className="pointer-events-none absolute -bottom-2 right-3 text-yellow-200 text-[7px] animate-[ping_1.6s_infinite]">
                            ✧
                          </span>

                          <button
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2
    bg-blue-500 text-white py-1.5 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-sm
    rounded-lg font-semibold cursor-pointer
    transition-all duration-300 hover:bg-blue-600
    shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                            onClick={() => showGrammarRule(actualIndex)}
                          >
                            <span className="text-sm sm:text-base">🎲</span>
                            <span>Start Quiz</span>
                          </button>
                        </div>
                        <button
                          className="flex-1 sm:flex-none bg-emerald-500 text-white py-1.5 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-sm rounded-lg font-semibold cursor-pointer transition-colors hover:bg-emerald-600"
                          onClick={() => acceptCorrection(actualIndex)}
                        >
                          Accept
                        </button>
                        <button
                          className="flex-1 sm:flex-none bg-gray-500 text-white py-1.5 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-sm rounded-lg font-semibold cursor-pointer transition-colors hover:bg-gray-600"
                          onClick={() => ignoreCorrection(actualIndex)}
                        >
                          Ignore
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rule Modal - Mobile optimized */}
      {showRuleModal && activeCorrection && (
        <div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-8 backdrop-blur-sm"
          onClick={() => closeRuleModal()}
        >
          <div
            className="bg-black rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[700px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-[modalSlideIn_0.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-8 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-black z-10">
              <h2 className="font-['Crimson_Pro',serif] text-lg sm:text-3xl font-bold text-white pr-4 line-clamp-2">
                {modalTitle}
              </h2>
              <button
                className="bg-transparent border-none text-2xl sm:text-3xl text-white cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-gray-100 hover:text-gray-800 flex-shrink-0"
                onClick={closeRuleModal}
              >
                &times;
              </button>
            </div>
            <div className="p-4 sm:p-8">
              <RuleModalContent
                rule={ruleData}
                correction={activeCorrection}
                isLoading={ruleLoading}
                error={ruleError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal - Mobile optimized */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-8 backdrop-blur-sm"
          onClick={closeUpgradeModal}
        >
          <div
            className="bg-black rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[600px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-[modalSlideIn_0.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-8 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-['Crimson_Pro',serif] text-xl sm:text-3xl font-bold text-white">
                Upgrade to Pro
              </h2>
              <button
                className="bg-transparent border-none text-2xl sm:text-3xl text-white cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-gray-100 hover:text-gray-800"
                onClick={closeUpgradeModal}
              >
                &times;
              </button>
            </div>
            <div className="p-4 sm:p-8">
              <div className="text-center mb-4 sm:mb-8">
                <div className="text-3xl sm:text-5xl mb-2 sm:mb-4">🚀</div>
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  Unlock All Premium Features
                </h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Get unlimited AI explanations, advanced style checking, and
                  more
                </p>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-baseline gap-2 mb-1 sm:mb-2">
                  <span className="text-2xl sm:text-4xl font-bold text-white">
                    $6
                  </span>
                  <span className="text-slate-400 text-sm sm:text-base">
                    /month
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-400">
                  Billed yearly at $72 (save $48)
                </p>
              </div>

              <ul className="list-none p-0 mb-4 sm:mb-8 space-y-2 sm:space-y-3">
                {[
                  "Unlimited AI explanations",
                  "Advanced style checking",
                  "Unlimited document length",
                  "Unlimited snippet storage",
                  "Multilingual context awareness",
                  "Priority support",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 text-slate-200 text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={LEMONSQUEEZY_CONFIG.checkoutUrl}
                className="block w-full p-3 sm:p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center font-semibold rounded-lg no-underline transition-all hover:shadow-lg text-sm sm:text-base"
                onClick={() => {
                  gtag("event", "begin_checkout", {
                    event_category: "Checkout",
                    event_label: "LemonSqueezy Checkout Started",
                    value: 72,
                    items: [{ item_name: "Pro Yearly", price: 72 }],
                  });
                }}
              >
                Upgrade Now
              </a>
              <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-3 sm:mt-4">
                Cancel anytime, no questions asked
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal - Mobile optimized */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeLoginModal}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-4 sm:p-8 relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-400 hover:text-white text-xl sm:text-2xl"
              onClick={closeLoginModal}
            >
              ×
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 text-center">
              Welcome back
            </h2>
            <p className="text-slate-400 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Sign in to access your snippets and Pro features
            </p>

            {/* Google Sign-In Container */}
            <div
              id="g_id_onload"
              data-client_id="321621097003-j12qbjotes9glvohuqbepb2pouol7b7j.apps.googleusercontent.com"
              data-auto_prompt="false"
              data-callback="handleGoogleSignIn"
              data-use_fedcm_for_prompt="true"
            ></div>

            <div
              className="g_id_signin mb-4 sm:mb-6"
              data-type="standard"
              data-size="large"
              data-theme="outline"
              data-text="signin_with"
              data-shape="rectangular"
              data-logo_alignment="left"
            ></div>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-slate-900 text-slate-500">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form
              onSubmit={handleEmailLogin}
              className="space-y-3 sm:space-y-5"
            >
              <div>
                <label
                  htmlFor="loginEmail"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm sm:text-base"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                Sign up with email
              </button>
            </form>

            <p className="text-center text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6">
              Don&apos;t have an account yet?{" "}
              <a
                href="#"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  openUpgradeModal();
                  closeLoginModal();
                }}
              >
                Upgrade to Pro now
              </a>
            </p>

            <p className="text-center text-[10px] sm:text-xs text-slate-600 mt-3 sm:mt-4">
              Your data is secure – we only store what is necessary (GDPR
              compliant).
            </p>
          </div>
        </div>
      )}

      {/* Style Paywall - Mobile optimized */}
      {showStylePaywall && (
        <div
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-6"
          onClick={() => setShowStylePaywall(false)}
        >
          <div
            className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 sm:p-10 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStylePaywall(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg sm:text-xl font-bold"
            >
              &times;
            </button>

            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            <div className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
              Advanced Style Checking
            </div>

            <div className="text-gray-600 text-xs sm:text-sm mb-5 sm:mb-7 leading-relaxed">
              Unlock advanced writing styles to preserve your voice while
              catching tone inconsistencies
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowStylePaywall(false);
                openUpgradeModal();
              }}
              className="inline-block w-full sm:w-auto bg-indigo-600 text-white font-medium rounded-full px-6 py-2.5 sm:py-3 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-sm sm:text-base"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      )}

      {/* Snippet Paywall - Mobile optimized */}
      {showSnippetPaywall && (
        <div
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-6"
          onClick={() => setShowSnippetPaywall(false)}
        >
          <div
            className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 sm:p-10 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSnippetPaywall(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg sm:text-xl font-bold"
            >
              &times;
            </button>

            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            <div className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
              Unlimited Snippet Storage
            </div>

            <div className="text-gray-600 text-xs sm:text-sm mb-5 sm:mb-7 leading-relaxed">
              Build your personal library of templates, sign-offs, and repeated
              phrases
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSnippetPaywall(false);
                openUpgradeModal();
              }}
              className="inline-block w-full sm:w-auto bg-indigo-600 text-white font-medium rounded-full px-6 py-2.5 sm:py-3 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-sm sm:text-base"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      )}

      {/* Toast Notification - Mobile optimized */}
      {toast.show && (
        <div
          className={`fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 transform z-50 text-sm sm:text-base ${
            toast.type === "success" ? "bg-green-600" : "bg-amber-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </SubscriptionContext.Provider>
  );
}