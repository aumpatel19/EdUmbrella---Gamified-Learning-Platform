import React, { useState } from 'react';

const QUESTIONS = [
  { q: 'sin 30°', a: '1/2', opts: ['1/2', '√3/2', '1/√2', '1'] },
  { q: 'cos 60°', a: '1/2', opts: ['√3/2', '1/2', '0', '1/√2'] },
  { q: 'tan 45°', a: '1', opts: ['0', '1/√3', '1', '√3'] },
  { q: 'sin 0°', a: '0', opts: ['0', '1', '1/2', '√3/2'] },
  { q: 'cos 90°', a: '0', opts: ['1', '0', '1/2', '√3/2'] },
  { q: 'tan 30°', a: '1/√3', opts: ['√3', '1', '1/√3', '1/2'] },
  { q: 'sin 90°', a: '1', opts: ['0', '1/2', '√3/2', '1'] },
  { q: 'cos 0°', a: '1', opts: ['0', '1/2', '1', '√3/2'] },
  { q: 'tan 60°', a: '√3', opts: ['1', '1/√3', '√3', '√3/2'] },
  { q: 'sin 60°', a: '√3/2', opts: ['1/2', '√3/2', '1/√2', '√3'] },
  { q: 'cos 30°', a: '√3/2', opts: ['1/2', '1/√2', '√3/2', '1'] },
  { q: 'sin²30° + cos²30°', a: '1', opts: ['0', '1/2', '3/4', '1'] },
  { q: 'tan 0°', a: '0', opts: ['0', '1', '∞', '1/√3'] },
  { q: '2sin 30° × cos 30°', a: '√3/2', opts: ['1/2', '√3/2', '1', '√3'] },
  { q: 'cos²45° − sin²45°', a: '0', opts: ['1', '1/2', '0', '−1'] },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const TOTAL_FLOORS = 10;

const TrigTower = () => {
  const [questions] = useState(() => shuffle(QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [floor, setFloor] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[idx % questions.length];

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const ok = opt === q.a;
    if (ok) { setFloor(f => Math.min(f + 1, TOTAL_FLOORS)); setScore(s => s + 10); }
    setFeedback({ ok, msg: ok ? `✅ Correct! Climbed to floor ${floor + 1}!` : `❌ Answer: ${q.a}` });
    setTimeout(() => {
      setFeedback(null); setSelected(null);
      if (ok && floor + 1 >= TOTAL_FLOORS) { setFinished(true); return; }
      if (idx + 1 >= TOTAL_FLOORS + 5) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 1400);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>{floor >= TOTAL_FLOORS ? '🏆' : '⛰️'}</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>{floor >= TOTAL_FLOORS ? 'Summit Reached!' : `Reached Floor ${floor}`}</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b></p>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {Array.from({ length: TOTAL_FLOORS }).map((_, i) => (
            <div key={i} style={{ width: 20, height: 28, borderRadius: 4, background: i < floor ? 'linear-gradient(180deg,#7C3AED,#06B6D4)' : 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)' }} />
          ))}
        </div>
        <button
          onClick={() => { setIdx(0); setFloor(0); setScore(0); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Climb Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Tower progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Floor {floor} / {TOTAL_FLOORS}</span>
        <span style={{ color: '#a78bfa', fontWeight: 600 }}>Score: {score}</span>
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 18, justifyContent: 'center' }}>
        {Array.from({ length: TOTAL_FLOORS }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 16, borderRadius: 3,
            background: i < floor ? 'linear-gradient(90deg,#7C3AED,#06B6D4)' : 'rgba(30,41,59,0.8)',
            border: `1px solid ${i === floor ? 'rgba(124,58,237,0.6)' : 'rgba(99,102,241,0.15)'}`,
            transition: 'background 0.4s'
          }} />
        ))}
      </div>

      {/* Question */}
      <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Find the value of:</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{q.q}</div>
      </div>

      {feedback && (
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: feedback.ok ? '#10B981' : '#EF4444', marginBottom: 10 }}>
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
              style={{ padding: '13px 8px', borderRadius: 8, background: bg, border, color, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrigTower;
