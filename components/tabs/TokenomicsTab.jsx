import BulletList from "@/components/ui/BulletList";

export default function TokenomicsTab({ result }) {
  const fields = [
    ["SUPPLY", result.tokenSupply],
    ["UTILITY", result.tokenUtility],
    ["VESTING", result.vesting],
    ["CHAIN", result.chain],
  ];

  return (
    <div className="grid2">
      <div className="card full">
        <div className="card-head"><span>🪙</span><h3 className="ch-sol">TOKENOMICS ANALYSIS</h3></div>
        <p style={{ marginBottom: "1rem" }}>{result.tokenomics}</p>
        <div className="token-grid">
          {fields.map(([k, v]) => (
            <div className="token-item" key={k}>
              <div className="token-key">{k}</div>
              <div className="token-val">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span>📈</span><h3 className="ch-green">BULL SIGNALS</h3></div>
        <BulletList items={result.bullish} dotClass="bldot-green" />
      </div>

      <div className="card">
        <div className="card-head"><span>⚠️</span><h3 className="ch-red">RISK SIGNALS</h3></div>
        <BulletList items={result.bearish} dotClass="bldot-red" />
      </div>
    </div>
  );
}
