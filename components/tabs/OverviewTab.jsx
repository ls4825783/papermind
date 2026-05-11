import BulletList from "@/components/ui/BulletList";
import { riskClass } from "@/lib/parse";

export default function OverviewTab({ result }) {
  return (
    <div className="grid2">
      <div className="card full">
        <div className="card-head"><span>📝</span><h3 className="ch-blue">SUMMARY</h3></div>
        <p>{result.summary}</p>
      </div>

      <div className="card full">
        <div className="card-head"><span>⚡</span><h3 className="ch-sol">KEY HIGHLIGHTS</h3></div>
        <BulletList items={result.highlights} dotClass="bldot-sol" />
      </div>

      <div className="card">
        <div className="card-head"><span>📈</span><h3 className="ch-green">BULLISH POINTS</h3></div>
        <BulletList items={result.bullish} dotClass="bldot-green" />
      </div>

      <div className="card">
        <div className="card-head"><span>📉</span><h3 className="ch-red">RED FLAGS</h3></div>
        <BulletList items={result.bearish} dotClass="bldot-red" />
      </div>

      <div className="card full">
        <div className="card-head">
          <span>🚨</span>
          <h3 className="ch-amber">SCAM / RUG INDICATORS</h3>
          <span className={`risk-pill ${riskClass(result.scamLevel)}`} style={{ marginLeft: "auto", fontSize: "0.6rem" }}>
            {result.scamLevel} RISK
          </span>
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {result.scamFlags.map((f, i) => (
            <li key={i} style={{ display: "flex", gap: "0.46rem", padding: "0.38rem 0", borderBottom: "1px solid rgba(232,234,240,0.04)", fontSize: "0.82rem", color: "rgba(232,234,240,0.74)" }}>
              <span style={{ color: "var(--amber)", flexShrink: 0 }}>→</span>{f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
