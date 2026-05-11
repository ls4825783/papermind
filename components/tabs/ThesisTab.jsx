"use client";
import BulletList from "@/components/ui/BulletList";

export default function ThesisTab({ result, thesis, loading, onGenerate }) {
  return (
    <div className="grid2">
      <div className="card full">
        <div className="card-head">
          <span>💼</span>
          <h3 className="ch-blue">VC-STYLE INVESTMENT THESIS</h3>
          <button
            className="gen-btn"
            style={{ marginLeft: "auto" }}
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Generating…" : thesis ? "↻ Regenerate" : "✦ Generate Thesis"}
          </button>
        </div>
        {!thesis && !loading && (
          <div className="empty-state">
            <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>💼</div>
            Click "Generate Thesis" to get a VC-style Solana investment analysis based on the full document.
          </div>
        )}
        {loading && (
          <div className="thesis-box" style={{ opacity: 0.5 }}>
            <p>Generating investment thesis…</p>
          </div>
        )}
        {thesis && !loading && (
          <div className="thesis-box">
            <p>{thesis}</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head"><span>📈</span><h3 className="ch-green">BULL CASE</h3></div>
        <BulletList items={result.bullish} dotClass="bldot-green" />
      </div>

      <div className="card">
        <div className="card-head"><span>📉</span><h3 className="ch-red">BEAR CASE</h3></div>
        <BulletList items={result.bearish} dotClass="bldot-red" />
      </div>
    </div>
  );
}
