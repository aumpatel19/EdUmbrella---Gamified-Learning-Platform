import React, { useState } from 'react';

const QUESTIONS = [
  { q: "d/dx (x²)", a: "2x", opts: ["2x", "x", "x²", "2"], hint: "Power rule: d/dx(xⁿ) = nxⁿ⁻¹" },
  { q: "d/dx (x³)", a: "3x²", opts: ["3x²", "x²", "3x", "x³"], hint: "Power rule: 3x³⁻¹ = 3x²" },
  { q: "d/dx (sin x)", a: "cos x", opts: ["cos x", "-sin x", "-cos x", "tan x"], hint: "Standard derivative" },
  { q: "d/dx (cos x)", a: "-sin x", opts: ["-sin x", "sin x", "cos x", "-cos x"], hint: "Standard derivative" },
  { q: "d/dx (eˣ)", a: "eˣ", opts: ["eˣ", "xeˣ", "eˣ⁻¹", "e"], hint: "eˣ is its own derivative" },
  { q: "d/dx (ln x)", a: "1/x", opts: ["1/x", "x", "ln x", "1"], hint: "Standard derivative of natural log" },
  { q: "d/dx (5x³ − 2x + 1)", a: "15x² − 2", opts: ["15x² − 2", "5x² − 2", "15x²", "5x² − 2x"], hint: "Differentiate term by term" },
  { q: "d/dx (x² · sin x)", a: "2x sin x + x² cos x", opts: ["2x sin x + x² cos x", "2x cos x", "x² cos x", "2x sin x"], hint: "Product rule: (uv)' = u'v + uv'" },
  { q: "d/dx (tan x)", a: "sec²x", opts: ["sec²x", "cos x", "-cot x", "cosec²x"], hint: "tan x = sin x / cos x" },
  { q: "d/dx (1/x)", a: "-1/x²", opts: ["-1/x²", "1/x²", "-1/x", "ln x"], hint: "Write as x⁻¹, power rule gives -x⁻²" },
  { q: "If f(x) = x⁴, then f'(x) =", a: "4x³", opts: ["4x³", "3x³", "4x⁴", "x³"], hint: "Power rule: 4x³" },
  { q: "d/dx (√x)", a: "1/(2√x)", opts: ["1/(2√x)", "2√x", "1/√x", "√x/2"], hint: "√x = x^(1/2), power rule" },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const TOTAL_PEAKS = 10;

const CalculusClimber = () => {
  const [questions] = useState(() => shuffle(QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const q = questions[idx % questions.length];
  const TOTAL = Math.min(TOTAL_PEAKS, questions.length);

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const ok = opt === q.a;
    if (ok) { setScore(s => s + 10); setAltitude(a => Math.min(a + 1, TOTAL_PEAKS)); }
    setFeedback({ ok, msg: ok ? `✅ +10 pts! ${q.hint}` : `❌ ${q.a} — ${q.hint}` });
    setTimeout(() => {
      setFeedback(null); setSelected(null);
      if (idx + 1 >= TOTAL) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 1600);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>{altitude >= TOTAL_PEAKS ? '🏔️' : '⛰️'}</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>{altitude >= TOTAL_PEAKS ? 'Summit Reached!' : `Altitude: ${altitude}/${TOTAL_PEAKS}`}</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b></p>
        <button
          onClick={() => { setIdx(0); setScore(0); setAltitude(0); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Climb Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Step {idx + 1} / {TOTAL}</span>
        <span style={{ color: '#a78bfa', fontWeight: 600 }}>Altitude: {altitude} 🏔 Score: {score}</span>
      </div>
      <div style={{ height: 6, background: '#1e293b', borderRadius: 3, marginBottom: 18, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(altitude / TOTAL_PEAKS) * 100}%`, background: 'linear-gradient(90deg,#7C3AED,#EC4899)', transition: 'width 0.4s' }} />
      </div>

      <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 8, textTransform: 'uppercase' }}>Find the derivative:</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{q.q}</div>
      </div>

      {feedback && (
        <div style={{ fontSize: 13, fontWeight: 600, color: feedback.ok ? '#10B981' : '#EF4444', marginBottom: 10, lineHeight: 1.4, textAlign: 'center' }}>
          {feedback.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {q.opts.map(opt => {
          let bg = 'rgba(15,22,41,0.8)', border = '1px solid rgba(99,102,241,0.25)', color = '#e2e8f0';
          if (selected === opt) {
            bg = feedback?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';
            border = `1px solid ${feedback?.ok ? '#10B981' : '#EF4444'}`;
            color = feedback?.ok ? '#10B981' : '#EF4444';
          } else if (feedback && opt === q.a) {
            bg = 'rgba(16,185,129,0.12)'; border = '1px solid #10B981'; color = '#10B981';
          }
          return (
            <button key={opt} onClick={() => handleSelect(opt)}
              style={{ padding: '13px 8px', borderRadius: 8, background: bg, border, color, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'monospace' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalculusClimber;
