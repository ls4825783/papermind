"use client";
import { useState } from "react";

export default function Stars({ value = 0, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star${(hover || value) >= n ? " lit" : ""}`}
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
