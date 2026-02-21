export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  readTime: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "affect-vs-effect",
    title: "Affect vs. Effect: The Rule You'll Never Forget",
    description:
      "One of the most common grammar mistakes explained with a simple mnemonic that sticks.",
    date: "2026-02-15",
    author: "Sarah Chen",
    category: "Grammar Tips",
    readTime: "4 min read",
    content: `
## The Confusion

"Affect" and "effect" are two of the most commonly confused words in the English language. Even experienced writers stumble over them. But once you learn the simple rule, you'll never mix them up again.

## The Rule

**Affect** is usually a **verb**. It means to influence or have an impact on something.

**Effect** is usually a **noun**. It refers to the result or outcome of an action.

## The Mnemonic

Remember **RAVEN**: **R**emember, **A**ffect is a **V**erb, **E**ffect is a **N**oun.

## Examples

- The rain **affected** our plans. (verb — the rain influenced our plans)
- The **effect** of the rain was a canceled picnic. (noun — the result was cancellation)
- How will this policy **affect** small businesses? (verb)
- The policy had a negative **effect** on small businesses. (noun)

## The Exceptions

Like most English rules, there are exceptions. "Effect" can be used as a verb meaning "to bring about" (e.g., "to effect change"). "Affect" can be a noun in psychology referring to emotion. But these uses are rare in everyday writing.

## Practice Makes Perfect

The best way to solidify this rule is to practice. Try writing five sentences using each word correctly. Over time, the correct usage will become second nature.
    `,
  },
  {
    slug: "oxford-comma-debate",
    title: "The Oxford Comma: Why It Matters More Than You Think",
    description:
      "The tiny punctuation mark that has sparked decades of debate among writers and editors.",
    date: "2026-02-10",
    author: "Marcus Rivera",
    category: "Punctuation",
    readTime: "5 min read",
    content: `
## What Is the Oxford Comma?

The Oxford comma (also called the serial comma) is the comma placed before the conjunction in a list of three or more items. For example:

- **With Oxford comma:** I love my parents, Batman, and Wonder Woman.
- **Without Oxford comma:** I love my parents, Batman and Wonder Woman.

## Why It Matters

Without the Oxford comma, the second sentence could be misread as saying your parents *are* Batman and Wonder Woman. While this example is humorous, ambiguity in professional or legal writing can have serious consequences.

## The Famous Court Case

In 2017, a Maine dairy company lost a $5 million lawsuit partly because of a missing Oxford comma in state legislation. The ambiguous wording of overtime exemptions led to a ruling in favor of the truck drivers who filed the suit.

## Style Guide Positions

- **Pro Oxford comma:** The Chicago Manual of Style, Oxford University Press, and most book publishers
- **Against Oxford comma:** The Associated Press Stylebook (used in journalism)

## Our Recommendation

At AI Grammar Mentor, we recommend using the Oxford comma. It almost always improves clarity and never makes a sentence worse. When in doubt, use it.

## The Bottom Line

The Oxford comma is a small mark with a big impact. Using it consistently is one of the easiest ways to make your writing clearer and more professional.
    `,
  },
  {
    slug: "passive-voice-when-to-use",
    title: "Passive Voice Isn't Always Wrong: When to Use It",
    description:
      "Most grammar checkers flag passive voice as an error. Here's why that's an oversimplification.",
    date: "2026-02-05",
    author: "Sarah Chen",
    category: "Writing Style",
    readTime: "6 min read",
    content: `
## The Myth

You've probably been told to "avoid passive voice" countless times. Grammar checkers love to flag it. But the truth is more nuanced: passive voice is a tool, and like any tool, it has its place.

## Active vs. Passive: A Quick Refresher

- **Active:** The dog bit the man.
- **Passive:** The man was bitten by the dog.

In active voice, the subject performs the action. In passive voice, the subject receives the action.

## When Passive Voice Is the Right Choice

### 1. When the Actor Is Unknown
"The window **was broken** overnight." (We don't know who did it.)

### 2. When the Actor Is Irrelevant
"The report **was published** in 2025." (Who published it matters less than when.)

### 3. In Scientific Writing
"The samples **were analyzed** using mass spectrometry." (The focus is on the process, not the researcher.)

### 4. For Diplomatic or Tactful Communication
"Mistakes **were made**." (Sometimes you need to discuss errors without assigning blame.)

## When to Avoid Passive Voice

- When it makes sentences unnecessarily long or confusing
- When you want to create a sense of urgency or directness
- When clarity about who is doing what is important

## The AI Grammar Mentor Approach

Our grammar checker doesn't just flag passive voice. It analyzes context to determine whether passive voice is appropriate and explains why it might or might not work in each specific case.
    `,
  },
  {
    slug: "ai-grammar-checking-future",
    title: "How AI Is Changing Grammar Checking Forever",
    description:
      "From simple spell-check to context-aware writing assistants: the evolution of grammar tools.",
    date: "2026-01-28",
    author: "Marcus Rivera",
    category: "Technology",
    readTime: "7 min read",
    content: `
## The Early Days

The first spell checkers appeared in the 1970s. They could only match words against a dictionary. If a word wasn't in the list, it was flagged as misspelled. Grammar? That was entirely your problem.

## Rule-Based Grammar Checkers

In the 1990s and 2000s, grammar checkers used rule-based systems. They could catch subject-verb agreement errors and some punctuation mistakes, but they were notorious for false positives and missed many contextual errors.

## The Machine Learning Revolution

Modern grammar checkers use machine learning models trained on billions of sentences. They understand context, tone, and intent in ways that rule-based systems never could.

## What Makes AI Grammar Checking Different

### Context Awareness
AI can understand that "their" is wrong in "Their going to the store" because it understands the sentence structure, not just individual words.

### Tone Detection
Modern AI can suggest that "per my last email" might come across as passive-aggressive and offer softer alternatives.

### Style Adaptation
AI grammar checkers can adapt to different writing styles — academic, casual, business, creative — and adjust their suggestions accordingly.

## The Future: Grammar Checkers That Teach

At AI Grammar Mentor, we believe the next frontier is grammar checkers that don't just fix your mistakes but help you understand them. By combining corrections with explanations and tracking your progress over time, we're building tools that make you a better writer, not just a more accurate one.

## What's Next

Expect to see grammar tools that integrate with your entire writing workflow, understand your personal writing style, and provide increasingly sophisticated feedback on structure, argumentation, and clarity.
    `,
  },
  {
    slug: "common-email-mistakes",
    title: "5 Grammar Mistakes That Make Your Emails Look Unprofessional",
    description:
      "Quick fixes for the most common errors that undermine your credibility in professional correspondence.",
    date: "2026-01-20",
    author: "Sarah Chen",
    category: "Professional Writing",
    readTime: "4 min read",
    content: `
## Why Email Grammar Matters

In professional settings, your emails are often the first impression you make. A well-written email signals competence and attention to detail. A sloppy one can undermine your credibility.

## Mistake 1: Your vs. You're

- **Wrong:** "Your welcome to join the meeting."
- **Right:** "You're welcome to join the meeting."

"Your" is possessive. "You're" is a contraction of "you are."

## Mistake 2: Loose vs. Lose

- **Wrong:** "We can't afford to loose this client."
- **Right:** "We can't afford to lose this client."

"Loose" means not tight. "Lose" means to be unable to find or to fail to win.

## Mistake 3: It's vs. Its

- **Wrong:** "The company changed it's policy."
- **Right:** "The company changed its policy."

"It's" always means "it is" or "it has." "Its" is possessive.

## Mistake 4: Then vs. Than

- **Wrong:** "This option is better then the other."
- **Right:** "This option is better than the other."

"Than" is for comparisons. "Then" is for time sequences.

## Mistake 5: Missing Commas After Introductory Phrases

- **Wrong:** "As discussed we'll proceed with the plan."
- **Right:** "As discussed, we'll proceed with the plan."

Always place a comma after introductory phrases to improve readability.

## The Takeaway

These five mistakes are easy to fix once you're aware of them. Bookmark this page and refer back to it before sending your next important email.
    `,
  },
  {
    slug: "writing-in-second-language",
    title: "Writing Confidently in a Second Language",
    description:
      "Practical strategies for non-native speakers to improve their English writing skills.",
    date: "2026-01-12",
    author: "Marcus Rivera",
    category: "Language Learning",
    readTime: "6 min read",
    content: `
## The Challenge

Writing in a second language is one of the most demanding cognitive tasks there is. You're simultaneously translating thoughts, applying grammar rules, choosing vocabulary, and maintaining tone — all while trying to sound natural.

## Strategy 1: Read Before You Write

The single most effective way to improve your writing in any language is to read extensively in that language. Reading exposes you to natural sentence structures, idiomatic expressions, and vocabulary in context.

## Strategy 2: Start Simple

Don't try to write like a native speaker from day one. Start with clear, simple sentences. Clarity always trumps complexity.

- **Instead of:** "It would be greatly appreciated if you could furnish us with the aforementioned documents."
- **Try:** "Could you please send us the documents?"

## Strategy 3: Learn Patterns, Not Just Rules

Instead of memorizing abstract grammar rules, learn common sentence patterns. For example:

- "I would like to..." (polite requests)
- "Could you please..." (asking for help)
- "I'm writing to..." (stating purpose in emails)

## Strategy 4: Use a Grammar Checker as a Learning Tool

A good grammar checker does more than fix mistakes — it teaches you patterns. AI Grammar Mentor's Learning Mode explains each correction so you understand the rule behind it.

## Strategy 5: Embrace Mistakes

Mistakes are data points, not failures. Each error teaches you something about the language. Track your most common mistakes and focus on those patterns.

## Strategy 6: Practice Regularly

Writing is a skill that improves with practice. Try to write something in English every day, even if it's just a short paragraph.

## You're Already Ahead

If you're reading this article in English, you already have strong reading comprehension. Writing skills will follow with practice and patience.
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug)
}
