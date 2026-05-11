export default function ScoreCard({ variant, label, value, color }) {
  return (
    <div className={`score-card ${variant}`}>
      <div className="score-label">{label}</div>
      <div className="score-num">
        {value}
        <span>/100</span>
      </div>
      <div className="meter">
        <div
          className="meter-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
