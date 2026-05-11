"use client";

export default function ShareCardTab({ cardImg, onRegenerate, onTweet, onDownloadCard, onDownloadTxt, result }) {
  return (
    <div className="grid2">
      <div className="card full">
        <div className="card-head">
          <span>🖼</span>
          <h3 className="ch-sol">TWITTER / X SHARE CARD</h3>
          <button className="gen-btn" style={{ marginLeft: "auto" }} onClick={onRegenerate}>
            ↻ Regenerate
          </button>
        </div>

        {!cardImg && (
          <div className="empty-state">
            <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>🖼</div>
            Generating your 1200×630 Solana-branded Twitter card…
          </div>
        )}

        {cardImg && (
          <>
            <div className="card-preview">
              <img src={cardImg} alt="Share card preview" />
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", textAlign: "center", fontFamily: "monospace", marginTop: "0.45rem" }}>
              1200 × 630px · Twitter/X optimised · Solana branded
            </p>
          </>
        )}

        <div className="action-row">
          <button className="action-btn twitter" onClick={onTweet}>𝕏 Tweet with Text</button>
          {cardImg && (
            <button className="action-btn download" onClick={onDownloadCard}>⬇ Download Card PNG</button>
          )}
          <button className="action-btn" onClick={onDownloadTxt}>📄 Download Report TXT</button>
        </div>

        <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.7rem", fontFamily: "monospace", lineHeight: "1.6" }}>
          TIP: Download the PNG card, then attach it manually when tweeting for maximum visual impact.
        </p>
      </div>
    </div>
  );
}
