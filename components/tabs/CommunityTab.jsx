"use client";
import Stars from "@/components/ui/Stars";
import { avgRating, riskMb, truncAddr, fmtDate } from "@/lib/parse";

export default function CommunityTab({ result, myRating, onRate, communityScans, onLoadScan }) {
  const avg = avgRating(result.ratings);

  return (
    <div className="grid2">
      {/* Rating box */}
      <div className="card full">
        <div className="card-head"><span>⭐</span><h3 className="ch-amber">COMMUNITY RATINGS</h3></div>
        <div className="community-box">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="rating-big">{avg ?? "—"}</div>
            <div>
              <Stars value={Math.round(parseFloat(avg) || 0)} />
              <div className="rating-count">
                {result.ratings?.length || 0} RATING{result.ratings?.length === 1 ? "" : "S"}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="your-rating-label">YOUR RATING</div>
            <Stars value={myRating} onChange={onRate} />
          </div>
        </div>
        <p style={{ fontSize: "0.79rem", color: "var(--text-muted)", textAlign: "center" }}>
          {myRating
            ? `You rated this ${myRating}/5 — saved to community leaderboard.`
            : "Tap stars to rate. Ratings are shared across all users."}
        </p>
      </div>

      {/* Scorecard */}
      <div className="card full">
        <div className="card-head"><span>📊</span><h3 className="ch-sol">DOCUMENT SCORECARD</h3></div>
        <div className="scorecard-grid">
          {[
            ["🔥 Hype", result.hypeScore + "/100"],
            ["📈 Bull", result.bullScore + "/100"],
            ["⚠️ Risk", result.riskScore + "/100"],
            ["🔗 Chain", result.chain],
            ["🪙 Utility", result.tokenUtility],
            ["🚨 Level", result.scamLevel],
          ].map(([k, v]) => (
            <div className="scorecard-item" key={k}>
              <div className="scorecard-key">{k}</div>
              <div className="scorecard-val">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card full">
        <div className="card-head"><span>🏆</span><h3 className="ch-amber">COMMUNITY LEADERBOARD</h3></div>
        {communityScans.length === 0 ? (
          <div className="empty-state">No community scans yet.</div>
        ) : (
          communityScans.map((s, i) => (
            <div className="lb-item" key={i} style={{ marginBottom: "0.4rem" }} onClick={() => onLoadScan(s)}>
              <div className={`lb-rank${i < 3 ? " gold" : ""}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>
              <div className="lb-info">
                <div className="lb-title">{s.title}</div>
                <div className="lb-meta">
                  {fmtDate(s.scannedAt)}
                  {s.walletAddr ? ` · ◎${truncAddr(s.walletAddr)}` : ""}
                </div>
              </div>
              <div className="lb-scores">
                <span className="mb mb-g">↑{s.bullScore}</span>
                <span className={`mb ${riskMb(s.scamLevel)}`}>{s.scamLevel}</span>
                {s.ratings?.length > 0 && (
                  <span style={{ fontSize: "0.58rem", color: "var(--amber)", fontFamily: "monospace" }}>
                    ★{(s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
