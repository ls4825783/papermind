"use client";
import { useRef } from "react";

const QUICK_QUESTIONS = [
  "What's the core value prop?",
  "Is the team doxxed?",
  "How does the token accrue value?",
  "Biggest risk here?",
  "Competitor comparison?",
];

export default function ChatTab({ messages, input, loading, onSend, onInputChange }) {
  const endRef = useRef(null);

  return (
    <div className="grid2">
      <div className="card full">
        <div className="card-head"><span>💬</span><h3 className="ch-blue">CHAT WITH THIS PAPER</h3></div>

        {messages.length === 0 && (
          <div className="quick-questions">
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} className="qq" onClick={() => onSend(q)}>{q}</button>
            ))}
          </div>
        )}

        <div className="chat-wrap">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty-state">
                Ask anything about this document.<br />
                The AI has read the full PDF and maintains conversation context.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "user" : "ai"}`}>
                <div className="chat-role">{m.role === "user" ? "YOU" : "PAPERMIND AI"}</div>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-msg ai thinking">
                <div className="chat-role">PAPERMIND AI</div>
                Thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="chat-bar">
            <input
              className="chat-input"
              placeholder="Ask anything about this paper…"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && onSend()}
            />
            <button
              className="chat-send"
              onClick={() => onSend()}
              disabled={loading || !input.trim()}
            >
              Send ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
