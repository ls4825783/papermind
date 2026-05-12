# PaperMind V3 — AI Solana Research Intelligence

> Bloomberg Terminal for crypto research. Turn 40-page whitepapers into 2-minute alpha.

![PaperMind](https://img.shields.io/badge/Solana-V3-9945FF?style=flat)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat)
![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue?style=flat)

---

## Features

- **📄 PDF Analysis** — Upload any whitepaper, tokenomics doc, or DeSci paper
- **🤖 AI Summary** — Plain-English summary, highlights, bullish & bearish points
- **💼 Investment Thesis** — VC-style thesis generated on demand
- **💬 Chat with Paper** — Ask follow-up questions about the document
- **🚨 Risk & Rug Detection** — Scam flags, risk score, LOW/MEDIUM/HIGH rating
- **🪙 Tokenomics Analysis** — Token model, supply, vesting, utility breakdown
- **◎ Solana Wallet Connect** — Phantom, Solflare, Backpack support
- **📚 Scan History** — Per-wallet persistent scan history
- **🏆 Community Leaderboard** — Shared across all users
- **⭐ Community Ratings** — 5-star rating system
- **🖼 Twitter Share Card** — 1200×630 Solana-branded PNG card

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), React 18 |
| AI | Google Gemini 1.5 Flash (FREE) |
| Blockchain | Solana (Phantom / Solflare / Backpack) |
| Styling | Pure CSS with Solana design system |
| Deployment | Vercel (free hobby plan) |

---


## Project Structure

```
papermind/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── api/
│       ├── analyze/route.js   ← PDF analysis (Gemini)
│       ├── thesis/route.js    ← Investment thesis (Gemini)
│       └── chat/route.js      ← Document chat (Gemini)
├── components/
│   ├── PaperMind.jsx          ← Main app
│   ├── ui/                    ← ScoreCard, Stars, BulletList, WalletModal
│   └── tabs/                  ← Overview, Tokenomics, Thesis, Chat, Community, ShareCard
├── lib/
│   ├── parse.js               ← XML parsing utilities
│   ├── solanaWallets.js       ← Wallet connect
│   └── shareCard.js           ← Canvas card generator
├── .env.example
├── next.config.js
└── package.json
```

---

Built with ❤️ on Solana · Powered by Google Gemini AI (Free)
