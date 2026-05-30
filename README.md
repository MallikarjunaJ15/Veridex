![Next.js](https://img.shields.io/badge/Next.js-16-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-blue)
![Tavily](https://img.shields.io/badge/Search-Tavily-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

# Veridex

AI-powered claim verification using live evidence, source ranking, and claim-level reasoning.

## Live Demo

🚀 Try Veridex:
[Live URL Here]

📂 Source Code:
https://github.com/MallikarjunaJ15/Veridex

Veridex is a consumer-facing truth verification platform that evaluates news articles, headlines, social media posts, and WhatsApp forwards using a claim-level Retrieval-Augmented Generation (RAG) pipeline.

Unlike traditional fact-checkers that classify an entire article and return a single score, Veridex breaks content into individual factual claims, verifies each claim independently using live web evidence, and generates a transparent verdict backed by sources.

---

## Screenshots

### Landing Page

![Landing](./public/screenshots/landing.png)

### Analyze Page

![Analyze](./public/screenshots/analyze.png)

### Analysis Report

![Report](./public/screenshots/output.png)

### Dashboard

![Dashboard](./public/screenshots/dashboard.png)

---

## Highlights

✅ Claim-Level Verification

✅ Live Evidence Retrieval

✅ Deterministic Verdict Aggregation

✅ Prompt Injection Defense

✅ Source Authority Ranking

✅ Structured Outputs with Zod

✅ Analysis History

✅ JWT Authentication

---

## Why Veridex Is Different

### Traditional Fact Checkers

Article
↓
Single Classification Score
↓
"72% likely fake"

Users cannot understand:

- Which claim is incorrect
- Which source contradicts it
- Why the verdict was generated

### Veridex

Article
↓
Claim Extraction
↓
Evidence Retrieval
↓
Per-Claim Verification
↓
Claim Verdicts
↓
Overall Verdict

Every verdict can be traced back to:

- The extracted claim
- Supporting evidence
- Source credibility tier
- AI explanation

No black-box scoring.

Transparent reasoning.

Evidence-backed verification.

---

## Example

Input:

"COVID vaccines reduced hospitalization rates. However, they cause infertility in most women."

Output:

Claim 1:
TRUE

Claim 2:
FALSE

Overall Verdict:
MISLEADING

This allows Veridex to identify mixed-truth misinformation that traditional article-level classifiers often miss.

Architecture Overview

```text
┌─────────────────────────────────────────────────────┐
│ User Input │
│ (Article / Headline / Social post) │
└─────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────┐
│ Claim Extraction │
│ Gemini 2.5 Flash + Zod Schema │
│ Returns: string[] of verifiable assertions │
│ Prompt-injection defense via XML isolation │
└─────────────────────┬───────────────────────────────┘
│
▼ (Promise.all — runs in parallel)
┌─────────────────────────────────────────────────────┐
│ Per-Claim Verification │
│ │
│ For each claim: │
│ 1. Tavily Search (maxResults: 5) │
│ 2. Source Tier Scoring (tierEngine.js) │
│ 3. High-quality source check (tier < 3) │
│ 4. Gemini evaluates claim vs evidence │
│ 5. Returns: verdict, confidence, explanation │
└─────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────┐
│ Deterministic Verdict Aggregation │
│ │
│ hasFalse && !hasTrue → FALSE │
│ hasMisleading || (hasTrue && hasFalse) → MISLEADING│
│ hasUnverifiable && !hasFalse → UNVERIFIABLE │
│ else → VERIFIED │
│ │
│ (No AI involvement — pure logic) │
└─────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────┐
│ MongoDB Persistence │
│ │
│ userId, article, overallVerdict, summary, │
│ claims[]: { claimText, verdict, confidence, │
│ explanation, evidence[]: { title, url, │
│ content, tier, sourceName } } │
│ totalSourcesProcessed │
└─────────────────────────────────────────────────────┘
```

Claim-Level Verification Example
Input:

COVID vaccines significantly reduced hospitalization rates during the Delta wave.
However, studies have confirmed they cause permanent infertility in most women.
Extraction output:

{
"claims": [
"COVID vaccines significantly reduced hospitalization rates during the Delta wave.",
"Studies have confirmed COVID vaccines cause permanent infertility in most women."
]
}
Per-claim verification:

Claim 1:
Sources: CDC, WHO, NEJM, Reuters
Tier 1 sources: 3
Verdict: TRUE
Confidence: HIGH
Explanation: Multiple peer-reviewed studies and government health agencies
confirm significant reduction in hospitalization during Delta wave.

Claim 2:
Sources: WHO, CDC, Mayo Clinic
Tier 1 sources: 3
Verdict: FALSE
Confidence: HIGH
Explanation: WHO and CDC have explicitly stated no credible evidence
supports this claim. Peer-reviewed literature contradicts it.
Deterministic overall verdict:

hasFalse = true
hasTrue = true
→ MISLEADING
Result: The article mixes a true statement with a false one — a common misinformation pattern. The overall verdict is MISLEADING, and the user can see exactly which claim is false and why.

Source Trust & Evidence Ranking
The tierEngine.js module automatically categorizes every retrieved URL before passing evidence to the AI model:

Tier Criteria Examples
Tier 1 .gov, .edu, .int TLDs; major international agencies CDC, WHO, NIH, Reuters, AP, BBC
Tier 2 Established news organizations not in Tier 1 Most national newspapers, news agencies
Tier 3 Blogs, forums, social media, unverified sources Reddit, Medium, Twitter/X, WordPress blogs
Why this matters for verdict accuracy:

If Tavily returns 5 results and 4 are Reddit threads and 1 is a CDC bulletin, the AI should weight the CDC source almost entirely. Without explicit tier scoring passed alongside the evidence, the model may treat all sources equally.

The prompt instructs the model: "Tier 1 sources heavily override Tier 2 and Tier 3 sources. If Tier 1 sources contradict Tier 3 sources, classify the claim based purely on the Tier 1 consensus."

This is not a perfect system — a malicious Tier 1 source would still score highly — but it meaningfully reduces the influence of low-quality sources on verdict accuracy.

If all retrieved sources are Tier 3, the claim is automatically returned as UNVERIFIABLE before the AI is even called. This prevents the model from being asked to evaluate a claim supported only by Reddit posts.

Tech Stack

```text
| Layer | Technology | Purpose |
|---------|---------|---------|
| Framework | Next.js 16 | App Router, Server Components |
| AI | Gemini 2.5 Flash | Claim extraction & verification |
| Retrieval | Tavily | Live web evidence |
| Database | MongoDB | Analysis persistence |
| Validation | Zod | Structured outputs |
| Deployment | Vercel | Hosting |
```

```text
Project Structure
veridex/
├── app/
│ ├── actions/
│ │ ├── auth.actions.js # register, login, logout, getUserFromToken
│ │ └── analysis.actions.js # createAnalysis, getUserHistory, getAnalysisById
│ │
│ ├── lib/
│ │ ├── db.js # MongoDB connection (singleton pattern)
│ │ ├── generateToken.js # JWT signing utility
│ │ └── pipeline/
│ │ ├── extract.js # Claim extraction via Gemini
│ │ ├── verify.js # Per-claim search + AI evaluation
│ │ └── tierEngine.js # Source authority ranking
│ │
│ ├── models/
│ │ ├── user.model.js # User schema
│ │ └── analysis.model.js # Nested claim-evidence schema
│ │
│ ├── (pages)/
│ │ ├── page.jsx # Landing page
│ │ ├── analyze/page.jsx # Main verification flow
│ │ ├── login/page.jsx
│ │ ├── register/page.jsx
│ │ └── dashboard/
│ │ ├── page.jsx # Analysis history
│ │ └── analysis/[id]/page.jsx # Per-analysis detail view
│ │
│ └── middleware.js # JWT verification + route protection
│
├── .env.local
└── package.json
```

Installation & Setup
Prerequisites: Node.js 18+, MongoDB Atlas account (free tier works), Gemini API key, Tavily API key.

## Why I Built This

Veridex started as an attempt to move beyond Next.js tutorial projects and understand how modern AI systems are actually built.

While developing this project, I explored:

- Next.js
- Server Components & Server Actions
- JWT Authentication
- Retrieval-Augmented Generation (RAG)
- Structured LLM Outputs
- Prompt Injection Defense
- Source Credibility Ranking
- AI Chaining & Workflow Design

The goal wasn't simply to build another AI application.

The goal was to understand how AI systems can make decisions transparently and how users can trust those decisions through evidence rather than black-box scoring.

---

## Skills Demonstrated

- Full Stack Development
- Next.js App Router
- Server Actions
- MongoDB Data Modeling
- JWT Authentication
- Retrieval-Augmented Generation (RAG)
- Prompt Engineering
- Structured AI Outputs
- Source Credibility Ranking
- Production UI Design

# 1. Clone the repository

git clone https://github.com/MallikarjunaJ15/Veridex.git
cd Veridex

# 2. Install dependencies

npm install

# 3. Create environment file

cp .env.example .env.local

# Fill in your API keys (see section below)

# 4. Run the development server

npm run dev
Open http://localhost:3000.

Environment Variables

# Refer

.env.example

Service Free Tier Link
Google Gemini Yes — Gemini 2.5 Flash aistudio.google.com
Tavily Search 1,000 searches/month tavily.com
MongoDB Atlas 512MB shared cluster mongodb.com/atlas

Future Improvements
Expanded Tier 1 source list
The current tier engine covers major international agencies. Adding region-specific authoritative sources (PIB for India, Ofcom for UK) would improve accuracy for non-English-language or regional claims.

Claim deduplication
The extraction step can produce semantically similar claims from a long article. Adding embedding-based deduplication before verification would reduce redundant Tavily API calls and improve response time.

Confidence calibration
The AI returns HIGH, MEDIUM, or LOW confidence, but these labels are not calibrated against ground truth. A future version could evaluate verdicts against a benchmark dataset and expose calibrated reliability scores.

Lessons Learned
Deterministic verdict aggregation matters more than it sounds.
The first version asked Gemini to produce the overall verdict by reading all claims together. It hallucinated. The model would sometimes return VERIFIED even when one claim was clearly FALSE. Replacing AI-generated overall verdicts with explicit if/else logic over individual claim verdicts eliminated this failure mode entirely. The rule is simple: if the AI has to synthesize multiple things into one judgment, find a way to make that synthesis deterministic.

Prompt injection is a real consideration for fact-checking tools.
A fact-checking product is an unusually attractive target for prompt injection — users might intentionally paste a message that instructs the AI to return a specific verdict. Isolating user input inside a labeled XML block and explicitly instructing the model to treat that block as passive data is not a complete defense, but it meaningfully raises the cost of a successful attack.

Structured output schemas catch problems early.
Using Zod to validate AI responses before they reach the database meant that schema mismatches surfaced as clear errors during development rather than silently corrupting stored records. The discipline of defining the output schema before writing the prompt forced clearer thinking about what the pipeline actually needed to return.

Source quality affects verdict quality more than prompt quality.
Time spent improving the Tier ranking logic produced more accurate verdicts than time spent refining the evaluation prompt. If the evidence passed to the model is low quality, the verdict will be low quality regardless of how well the prompt is written.

Next.js Server Actions simplify full-stack architecture significantly.
Replacing Express route handlers with server actions removed an entire layer of the stack — no separate API server, no CORS configuration, no API route versioning. The tradeoff is that server action logic is harder to test in isolation than a standalone Express handler, which becomes relevant as the codebase grows.

Screen Description
Landing page Input area + trust indicators
Analysis loading Step-by-step pipeline progress
Result — Claim breakdown Per-claim verdict with expandable evidence
Dashboard Analysis history with verdict indicators
Analysis detail Full report with source tier attribution
License
MIT — free to use, fork, and learn from.

If this project helped you understand RAG pipeline architecture, claim-level verification design, or Next.js server action patterns, a star on the repository is appreciated.

Built by Mallikarjuna J · Information Science Engineering · Cambridge Institute of Technology, Bengaluru
