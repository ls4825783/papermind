# PaperMind V3 — AI Solana Research Intelligence

> Bloomberg Terminal for crypto research. Turn 40-page whitepapers into 2-minute alpha.

![PaperMind](https://img.shields.io/badge/Solana-V3-9945FF?style=flat&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange?style=flat)

---

## Features

- **📄 PDF Analysis** — Upload any whitepaper, tokenomics doc, or DeSci paper
- **🤖 AI Summary** — Plain-English summary, highlights, bullish & bearish points
- **💼 Investment Thesis** — VC-style thesis generated on demand
- **💬 Chat with Paper** — Ask follow-up questions, AI has read the full PDF
- **🚨 Risk & Rug Detection** — Scam flags, risk score, LOW/MEDIUM/HIGH rating
- **🪙 Tokenomics Analysis** — Token model, supply, vesting, utility breakdown
- **◎ Solana Wallet Connect** — Phantom, Solflare, Backpack support
- **📚 Scan History** — Per-wallet persistent scan history
- **🏆 Community Leaderboard** — Shared across all users
- **⭐ Community Ratings** — 5-star rating system, persisted globally
- **🖼 Twitter Share Card** — 1200×630 Solana-branded PNG card generator

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), React 18 |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Blockchain | Solana (Phantom / Solflare / Backpack) |
| Styling | Pure CSS (no Tailwind, no component library) |
| Storage | Claude Artifacts persistent storage API |
| Deployment | Vercel (recommended) |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/ls4825783/papermind.git
cd papermind
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Set `ANTHROPIC_API_KEY` in your Vercel project environment variables.

Or click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ls4825783/papermind)

---

## Project Structure

```
papermind/
├── app/
│   ├── layout.js          # Root layout + metadata
│   ├── page.js            # Entry point
│   ├── globals.css        # All styles (CSS variables)
│   └── api/
│       ├── analyze/       # PDF → AI analysis (server-side)
│       ├── thesis/        # Investment thesis generation
│       └── chat/          # Document Q&A chat
├── components/
│   ├── PaperMind.jsx      # Main app component
│   ├── ui/
│   │   ├── ScoreCard.jsx
│   │   ├── BulletList.jsx
│   │   ├── Stars.jsx
│   │   └── WalletModal.jsx
│   └── tabs/
│       ├── OverviewTab.jsx
│       ├── TokenomicsTab.jsx
│       ├── ThesisTab.jsx
│       ├── ChatTab.jsx
│       ├── CommunityTab.jsx
│       └── ShareCardTab.jsx
├── lib/
│   ├── parse.js           # XML parsing + utilities
│   ├── solanaWallets.js   # Wallet detection + connect
│   ├── shareCard.js       # Canvas card generator
│   ├── prompts.js         # AI system prompts
│   └── anthropic.js       # SDK client
├── .env.example
├── next.config.js
└── package.json
```

---

## API Routes

All AI calls are **server-side only** — your `ANTHROPIC_API_KEY` is never exposed to the browser.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Analyse a PDF, returns structured JSON |
| `/api/thesis` | POST | Generate VC-style investment thesis |
| `/api/chat` | POST | Multi-turn chat with the PDF |

---

## Security

- API key is server-side only (Next.js API routes)
- PDF processing happens server-side
- No user data stored on any external server
- Wallet connection is read-only (public key only, no signing)

---

## Roadmap

- [ ] Compare two papers side-by-side
- [ ] Token-gated premium features
- [ ] Email report delivery
- [ ] Telegram bot integration
- [ ] On-chain scan attestations (Solana)

---

## License

MIT — build freely, ship fast.

---

Built with ❤️ on Solana · Powered by Claude AI
