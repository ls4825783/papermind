export default function BulletList({ items = [], dotClass = "bldot-sol" }) {
  return (
    <ul className="bullet-list">
      {items.map((item, i) => (
        <li key={i}>
          <div className={`bldot ${dotClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
