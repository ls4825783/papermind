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

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/ls4825783/papermind.git
cd papermind
npm install
```

### 2. Get your FREE Gemini API key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click **Create API Key** — free, no credit card needed

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=AIzaSy...your-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy Free on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → Import `papermind`
3. Add environment variable:
   - `GEMINI_API_KEY` = your Gemini key
4. Click **Deploy**

Your site is live at `papermind.vercel.app` 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ls4825783/papermind)

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
