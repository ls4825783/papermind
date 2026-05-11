import "./globals.css";

export const metadata = {
  title: "PaperMind — AI Solana Research Intelligence",
  description:
    "Bloomberg Terminal for crypto research. Upload any whitepaper, tokenomics PDF, or DeSci document and get instant AI-powered analysis, risk scoring, investment thesis, and more.",
  keywords:
    "Solana, crypto research, whitepaper analysis, tokenomics, DeSci, AI, rug detection, investment thesis",
  openGraph: {
    title: "PaperMind V3 — AI Solana Research Intelligence",
    description:
      "Turn 40-page whitepapers into 2-minute alpha. AI-powered crypto research on Solana.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperMind V3 — AI Solana Research Intelligence",
    description: "Turn 40-page whitepapers into 2-minute alpha.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
