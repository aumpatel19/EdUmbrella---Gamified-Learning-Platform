import React, { useState } from 'react';

const QUESTIONS = [
  { q: 'Two vectors of magnitudes 3 N and 4 N act at right angles. Find the resultant.', a: '5 N', opts: ['5 N', '7 N', '1 N', '12 N'], hint: '√(3²+4²) = √25 = 5' },
  { q: 'Vectors A = 5î and B = 12ĵ. What is |A + B|?', a: '13', opts: ['17', '13', '7', '60'], hint: '√(5²+12²) = √169 = 13' },
  { q: 'Equal vectors of magnitude 10 N act at 180° to each other. Resultant?', a: '0 N', opts: ['20 N', '10 N', '0 N', '14 N'], hint: 'Opposite directions cancel' },
  { q: 'A⃗ = 3î + 4ĵ. What is the magnitude of A⃗?', a: '5', opts: ['7', '5', '12', '√7'], hint: '√(3²+4²)' },
  { q: 'If |A⃗| = |B⃗| = |A⃗+B⃗|, the angle between them is:', a: '120°', opts: ['60°', '90°', '120°', '180°'], hint: 'Use the law of cosines: R² = A² + B² + 2AB cosθ' },
  { q: 'Two equal forces of 5 N each at 60° to each other. Resultant magnitude?', a: '5√3 N', opts: ['10 N', '5 N', '5√3 N', '5√2 N'], hint: 'R = √(25+25+2×25×cos60°) = 5√3' },
  { q: 'A⃗ = î + 2ĵ + 2k̂. Find |A⃗|.', a: '3', opts: ['5', '3', '√5', '6'], hint: '√(1+4+4)=√9=3' },
  { q: 'Unit vector of A⃗ = 3î + 4ĵ is:', a: '0.6î + 0.8ĵ', opts: ['3î + 4ĵ', '4î + 3ĵ', '0.6î + 0.8ĵ', '0.8î + 0.6ĵ'], hint: 'Divide by |A⃗|=5' },
  { q: 'A⃗ · B⃗ when A⃗ ⊥ B⃗ equals:', a: '0', opts: ['|A||B|', '0', '1', 'AB cosθ'], hint: 'Dot product is zero for perpendicular vectors' },
  { q: 'Cross product A⃗ × A⃗ equals:', a: '0⃗', opts: ['|A|²', '1', '0⃗', 'A²k̂'], hint: 'Any vector crossed with itself is zero' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const VectorVoyage = () => {
  const [questions] = useState(() => shuffle(QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];
  const TOTAL = Math.min(questions.length, 10);

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const ok = opt === q.a;
    if (ok) { setScore(s => s + 10); setProgress(p => p + 1); }
    setFeedback({ ok, msg: ok ? `✅ Correct! ${q.hint}` : `❌ Answer: ${q.a} — ${q.hint}` });
    setTimeout(() => {
      setFeedback(null); setSelected(null);
      if (idx + 1 >= TOTAL) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 1800);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>🚢</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#06B6D4' }}>Voyage Complete!</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> / {TOTAL * 10}</p>
        <button
          onClick={() => { setIdx(0); setScore(0); setProgress(0); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#06B6D4,#7C3AED)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Sail Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 540, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Q {idx + 1} / {TOTAL}</span>
        <span style={{ color: '#06B6D4', fontWeight: 600 }}>Score: {score}</span>
      </div>
      <div style={{ height: 6, background: '#1e293b', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(progress / TOTAL) * 100}%`, background: 'linear-gradient(90deg,#06B6D4,#7C3AED)', transition: 'width 0.4s' }} />
      </div>

      <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: 18, marginBottom: 16, minHeight: 80 }}>
        <div style={{ fontSize: 12, color: '#67e8f9', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>⚓ Vector Problem</div>
        <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6 }}>{q.q}</div>
      </div>

      {feedback && (
        <div style={{ fontSize: 13, fontWeight: 600, color: feedback.ok ? '#10B981' : '#EF4444', marginBottom: 10, lineHeight: 1.4 }}>
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
              style={{ padding: '12px 6px', borderRadius: 8, background: bg, border, color, fontWeight: 500, fontSize: 13, cursor: 'pointer', wordBreak: 'break-word' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VectorVoyage;
