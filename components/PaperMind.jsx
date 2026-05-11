"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ScoreCard from "@/components/ui/ScoreCard";
import WalletModal from "@/components/ui/WalletModal";
import OverviewTab from "@/components/tabs/OverviewTab";
import TokenomicsTab from "@/components/tabs/TokenomicsTab";
import ThesisTab from "@/components/tabs/ThesisTab";
import ChatTab from "@/components/tabs/ChatTab";
import CommunityTab from "@/components/tabs/CommunityTab";
import ShareCardTab from "@/components/tabs/ShareCardTab";
import { SOLANA_WALLETS, connectSolanaWallet, disconnectSolanaWallet } from "@/lib/solanaWallets";
import { truncAddr, fmtDate, riskClass, riskMb, avgRating } from "@/lib/parse";
import { generateShareCard } from "@/lib/shareCard";

const STEPS = ["READING PDF", "EXTRACTING TEXT", "AI ANALYSIS", "BUILDING REPORT"];
const TABS = [
  ["overview",  "📊 Overview"],
  ["tokenomics","🪙 Tokenomics"],
  ["thesis",    "💼 Thesis"],
  ["chat",      "💬 Chat"],
  ["community", "⭐ Community"],
  ["sharecard", "🖼 Share Card"],
];

function readB64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("File read failed"));
    r.readAsDataURL(file);
  });
}

export default function PaperMind() {
  // ── Wallet
  const [wallet,      setWallet]     = useState(null);
  const [walletModal, setWalletModal]= useState(false);
  // ── Upload
  const [file,        setFile]       = useState(null);
  const [drag,        setDrag]       = useState(false);
  const [loading,     setLoading]    = useState(false);
  const [step,        setStep]       = useState(0);
  const [error,       setError]      = useState("");
  // ── Result
  const [result,      setResult]     = useState(null);
  const [docB64,      setDocB64]     = useState(null);
  // ── Tabs
  const [activeTab,   setActiveTab]  = useState("overview");
  // ── Thesis
  const [thesis,      setThesis]     = useState("");
  const [thesisLoad,  setThesisLoad] = useState(false);
  // ── Chat
  const [chatMsgs,    setChatMsgs]   = useState([]);
  const [chatInput,   setChatInput]  = useState("");
  const [chatLoad,    setChatLoad]   = useState(false);
  // ── Community / Leaderboard
  const [myScans,     setMyScans]    = useState([]);
  const [commScans,   setCommScans]  = useState([]);
  const [lbTab,       setLbTab]      = useState("community");
  const [myRating,    setMyRating]   = useState(0);
  // ── Share card
  const [cardImg,     setCardImg]    = useState(null);

  const fileRef = useRef();

  // ── Persist: load community scans
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage?.get("pm3-community", true);
        if (r) setCommScans(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  // ── Persist: load wallet scans when wallet connects
  useEffect(() => {
    if (!wallet) { setMyScans([]); return; }
    (async () => {
      try {
        const r = await window.storage?.get(`pm3-wallet:${wallet.addr}`);
        if (r) setMyScans(JSON.parse(r.value));
      } catch { setMyScans([]); }
    })();
  }, [wallet]);

  // ── Save helpers
  const saveMyScans = async (scans) => {
    if (!wallet) return;
    try { await window.storage?.set(`pm3-wallet:${wallet.addr}`, JSON.stringify(scans)); } catch {}
    setMyScans(scans);
  };

  const saveCommScans = async (scans) => {
    try { await window.storage?.set("pm3-community", JSON.stringify(scans), true); } catch {}
    setCommScans(scans);
  };

  // ── Auto-generate share card when tab selected
  useEffect(() => {
    if (activeTab === "sharecard" && result && !cardImg) {
      setTimeout(() => setCardImg(generateShareCard(result, wallet?.addr || null)), 80);
    }
  }, [activeTab]);

  // ── Wallet connect / disconnect
  const handleConnect = async (walletDef) => {
    try {
      const addr = await connectSolanaWallet(walletDef);
      setWallet({ addr, name: walletDef.name, icon: walletDef.icon });
      setWalletModal(false);
    } catch (e) {
      if (!e.message?.includes("not installed")) alert("Connection failed: " + e.message);
    }
  };

  const handleDisconnect = async () => {
    const def = SOLANA_WALLETS.find((w) => w.name === wallet?.name);
    if (def) await disconnectSolanaWallet(def);
    setWallet(null);
    setWalletModal(false);
  };

  // ── File handling
  const handleFile = useCallback((f) => {
    if (f?.type === "application/pdf") { setFile(f); setError(""); }
    else setError("Please upload a PDF file.");
  }, []);

  // ── Analyse
  const analyze = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError(""); setStep(0);
    setThesis(""); setChatMsgs([]); setMyRating(0); setCardImg(null);
    try {
      const b64 = await readB64(file);
      setDocB64(b64);
      setStep(1); await new Promise((r) => setTimeout(r, 500));
      setStep(2);

      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: b64, fileName: file.name }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Analysis failed.");

      setStep(3);
      const parsed = {
        ...data.result,
        fileName: file.name,
        scannedAt: Date.now(),
        walletAddr: wallet?.addr || null,
        walletName: wallet?.name || null,
        ratings: [],
      };
      await new Promise((r) => setTimeout(r, 350));
      setResult(parsed);
      setActiveTab("overview");

      // Persist
      if (wallet) {
        const up = [parsed, ...myScans.filter((s) => s.fileName !== file.name)].slice(0, 30);
        saveMyScans(up);
      }
      const cu = [parsed, ...commScans.filter((s) => s.fileName !== file.name)].slice(0, 50);
      saveCommScans(cu);
    } catch (e) {
      setError(e.message || "Analysis failed.");
    } finally {
      setLoading(false); setStep(0);
    }
  };

  // ── Thesis
  const generateThesis = async () => {
    if (!result || !docB64) return;
    setThesisLoad(true);
    try {
      const resp = await fetch("/api/thesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: docB64, title: result.title, summary: result.summary }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      setThesis(data.thesis);
    } catch (e) {
      setThesis("Failed to generate thesis. Please try again.");
    } finally {
      setThesisLoad(false);
    }
  };

  // ── Chat
  const sendChat = async (q) => {
    const question = (q || chatInput).trim();
    if (!question || !docB64) return;
    setChatInput("");
    const newMsgs = [...chatMsgs, { role: "user", content: question }];
    setChatMsgs(newMsgs);
    setChatLoad(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64: docB64,
          messages: newMsgs,
          docTitle: result?.title,
          docSummary: result?.summary,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      setChatMsgs((h) => [...h, { role: "assistant", content: data.reply }]);
    } catch {
      setChatMsgs((h) => [...h, { role: "assistant", content: "Hit an error — please try again." }]);
    } finally {
      setChatLoad(false);
    }
  };

  // ── Rate
  const rateDoc = (stars) => {
    setMyRating(stars);
    if (!result) return;
    const up = [...commScans];
    const idx = up.findIndex((s) => s.fileName === result.fileName);
    if (idx >= 0) {
      up[idx] = { ...up[idx], ratings: [...(up[idx].ratings || []), stars] };
      saveCommScans(up);
    }
    setResult((r) => ({ ...r, ratings: [...(r.ratings || []), stars] }));
  };

  // ── Share actions
  const tweet = () => {
    if (!result) return;
    const txt = `🧠 Analyzed "${result.title}" on PaperMind\n\n📈 Bull: ${result.bullScore}/100  ⚠️ Risk: ${result.scamLevel}  🔥 Hype: ${result.hypeScore}/100\n\n◎ Solana AI Research Intelligence — V3`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}`, "_blank");
  };

  const downloadCard = () => {
    const img = cardImg || generateShareCard(result, wallet?.addr || null);
    const a = document.createElement("a");
    a.href = img;
    a.download = `PaperMind_${result.title.replace(/\s+/g, "_")}.png`;
    a.click();
  };

  const downloadTxt = () => {
    if (!result) return;
    const lines = [
      "PAPERMIND V3 — SOLANA RESEARCH REPORT", "=".repeat(48), "",
      `Title: ${result.title}`, `File: ${result.fileName}`,
      `Date: ${fmtDate(result.scannedAt)}`,
      wallet ? `Wallet: ◎ ${truncAddr(result.walletAddr)} · ${result.walletName}` : "", "",
      `Hype: ${result.hypeScore}/100`, `Bull: ${result.bullScore}/100`,
      `Risk: ${result.riskScore}/100  [${result.scamLevel}]`, "",
      "SUMMARY", result.summary, "",
      "BULLISH", ...result.bullish.map((b) => `• ${b}`), "",
      "RED FLAGS", ...result.bearish.map((b) => `• ${b}`), "",
      "TOKENOMICS", result.tokenomics,
      `Supply: ${result.tokenSupply}`, `Utility: ${result.tokenUtility}`,
      `Vesting: ${result.vesting}`, `Chain: ${result.chain}`, "",
      "SCAM FLAGS", ...result.scamFlags.map((f) => `• ${f}`), "",
      ...(thesis ? ["INVESTMENT THESIS", thesis, ""] : []),
      "Generated by PaperMind V3 — Solana AI Research Intelligence",
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines], { type: "text/plain" }));
    a.download = `PaperMind_${result.title.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  const loadScan = (s) => {
    setResult(s); setActiveTab("overview");
    setThesis(""); setChatMsgs([]); setCardImg(null); setMyRating(0);
  };

  const reset = () => {
    setResult(null); setFile(null); setError("");
    setThesis(""); setChatMsgs([]); setCardImg(null);
  };

  const displayed = lbTab === "mine" ? myScans : commScans;

  return (
    <>
      <div className="bg-noise" />
      <div className="bg-grid" />
      <div className="page-content">

        {/* ── NAV ── */}
        <nav className="nav">
          <div className="logo" onClick={reset}>Paper<span style={{ WebkitTextFillColor: "var(--green)" }}>Mind</span></div>
          <div className="nav-pills">
            <div className="npill npill-v">V3 · SOLANA</div>
            {commScans.length > 0 && (
              <div className="npill npill-c">
                {commScans.length} SCANS
                {wallet && myScans.length > 0 ? ` · ${myScans.length} MINE` : ""}
              </div>
            )}
          </div>
          <button
            className={`wallet-btn${wallet ? " connected" : ""}`}
            onClick={() => setWalletModal(true)}
          >
            <div className={`wdot ${wallet ? "wdot-on" : "wdot-off"}`} />
            {wallet ? `${wallet.icon} ${truncAddr(wallet.addr)}` : "Connect Wallet"}
          </button>
        </nav>

        {/* ── WALLET MODAL ── */}
        {walletModal && (
          <WalletModal
            wallet={wallet}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onClose={() => setWalletModal(false)}
            myScansCount={myScans.length}
          />
        )}

        {/* ══════════════ UPLOAD VIEW ══════════════ */}
        {!result && (
          <>
            <div className="hero">
              <div className="hero-tag">⚡ SOLANA · V3 · AI POWERED</div>
              <h1>Bloomberg Terminal for<br /><em>Solana research</em></h1>
              <p>Upload any whitepaper, DeSci doc, or tokenomics PDF. Instant AI analysis, investment thesis, risk scoring, and full document chat.</p>
              <div className="pills">
                <span className="pill pill-sol">◎ Solana Native</span>
                <span className="pill pill-green">AI Summary</span>
                <span className="pill pill-blue">Chat with Paper</span>
                <span className="pill pill-sol">Investment Thesis</span>
                <span className="pill pill-amber">Community Ratings</span>
                <span className="pill pill-green">Wallet Scan History</span>
                <span className="pill pill-red">Rug Detection</span>
              </div>
            </div>

            <div className="upload-section">
              {!wallet && (
                <div className="wallet-cta">
                  <span style={{ fontSize: "1.15rem" }}>◎</span>
                  <div className="wallet-cta-text">
                    <strong>Connect your Solana wallet</strong> to save scan history and build your personal research library.
                  </div>
                  <button className="wallet-cta-btn" onClick={() => setWalletModal(true)}>Connect</button>
                </div>
              )}

              <div
                className={`drop-zone${drag ? " drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => !loading && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  disabled={loading}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div className="drop-zone-icon">📄</div>
                <h3>Drop your PDF here</h3>
                <p>Whitepapers · Research Papers · Tokenomics · DeSci · Audits</p>
              </div>

              {file && !loading && (
                <div className="file-selected">
                  <span style={{ fontSize: "1.3rem" }}>📑</span>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <span style={{ color: "var(--green)" }}>✓</span>
                </div>
              )}

              {error && <div className="error-box">⚠️ {error}</div>}

              {file && (
                <button className="analyze-btn" onClick={analyze} disabled={loading}>
                  {loading ? "Analyzing…" : "◎ Analyze Document"}
                </button>
              )}

              {loading && (
                <div className="progress-steps">
                  {STEPS.map((s, i) => (
                    <div key={i} className={`step ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                      {i < step ? "✓ " : ""}{s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LEADERBOARD */}
            {(commScans.length > 0 || myScans.length > 0) && (
              <div className="lb-section">
                <div className="lb-tabs">
                  <button className={`lb-tab${lbTab === "community" ? " active" : ""}`} onClick={() => setLbTab("community")}>
                    🌐 Community ({commScans.length})
                  </button>
                  {wallet && (
                    <button className={`lb-tab${lbTab === "mine" ? " active" : ""}`} onClick={() => setLbTab("mine")}>
                      ◎ My Scans ({myScans.length})
                    </button>
                  )}
                </div>

                {!wallet && lbTab === "mine" && (
                  <div className="lb-hint">🔒 Connect Solana wallet to see your personal scan history</div>
                )}

                {displayed.length === 0 ? (
                  <div className="lb-empty">
                    {lbTab === "mine" ? "No scans saved to this wallet yet." : "No community scans yet — be the first!"}
                  </div>
                ) : displayed.map((s, i) => (
                  <div className="lb-item" key={i} onClick={() => loadScan(s)}>
                    <div className={`lb-rank${i < 3 ? " gold" : ""}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </div>
                    <div className="lb-info">
                      <div className="lb-title">{s.title}</div>
                      <div className="lb-meta">
                        {s.chain !== "Not specified" ? s.chain + " · " : ""}
                        {fmtDate(s.scannedAt)}
                        {s.walletAddr ? ` · ◎${truncAddr(s.walletAddr)}` : ""}
                      </div>
                    </div>
                    <div className="lb-scores">
                      <span className="mb mb-g">↑{s.bullScore}</span>
                      <span className={`mb ${riskMb(s.scamLevel)}`}>{s.scamLevel}</span>
                      <span className="mb mb-y">🔥{s.hypeScore}</span>
                      {s.ratings?.length > 0 && (
                        <span style={{ fontSize: "0.58rem", color: "var(--amber)", fontFamily: "monospace" }}>
                          ★{(s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════ DASHBOARD ══════════════ */}
        {result && (
          <div className="dashboard">
            {/* Doc header */}
            <div className="doc-header">
              <div className="doc-badge">📋</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="doc-title">{result.title}</div>
                <div className="doc-meta">
                  {result.fileName} · {result.chain !== "Not specified" ? result.chain : "Chain N/A"} · {fmtDate(result.scannedAt)}
                </div>
                {result.walletAddr && (
                  <div className="doc-wallet">◎ {truncAddr(result.walletAddr)} · {result.walletName}</div>
                )}
              </div>
              <span className={`risk-pill ${riskClass(result.scamLevel)}`}>RISK: {result.scamLevel}</span>
            </div>

            {/* Scores */}
            <div className="scores-row">
              <ScoreCard variant="hype" label="HYPE SCORE" value={result.hypeScore} color="var(--sol)" />
              <ScoreCard variant="bull" label="BULL SCORE" value={result.bullScore} color="var(--green)" />
              <ScoreCard variant="risk" label="RISK SCORE" value={result.riskScore} color="var(--red)" />
            </div>

            {/* Tabs */}
            <div className="tabs">
              {TABS.map(([id, label]) => (
                <button
                  key={id}
                  className={`tab-btn${activeTab === id ? " active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "overview"   && <OverviewTab result={result} />}
            {activeTab === "tokenomics" && <TokenomicsTab result={result} />}
            {activeTab === "thesis"     && <ThesisTab result={result} thesis={thesis} loading={thesisLoad} onGenerate={generateThesis} />}
            {activeTab === "chat"       && <ChatTab messages={chatMsgs} input={chatInput} loading={chatLoad} onSend={sendChat} onInputChange={setChatInput} />}
            {activeTab === "community"  && <CommunityTab result={result} myRating={myRating} onRate={rateDoc} communityScans={commScans} onLoadScan={loadScan} />}
            {activeTab === "sharecard"  && <ShareCardTab cardImg={cardImg} onRegenerate={() => setCardImg(generateShareCard(result, wallet?.addr || null))} onTweet={tweet} onDownloadCard={downloadCard} onDownloadTxt={downloadTxt} result={result} />}

            {/* Bottom action row */}
            <div className="action-row">
              <button className="action-btn twitter" onClick={tweet}>𝕏 Share on Twitter</button>
              <button className="action-btn download" onClick={downloadCard}>⬇ Download Card</button>
              <button className="action-btn" onClick={downloadTxt}>📄 Download Report</button>
            </div>
            <button className="back-btn" onClick={reset}>← Analyze Another Paper</button>
          </div>
        )}

      </div>
    </>
  );
}
