import React, { useState } from 'react';

const PROBLEMS = [
  { given: 'Two sides and the included angle are equal', correct: 'SAS', options: ['SAS','SSS','ASA','RHS'], hint: 'Side-Angle-Side' },
  { given: 'All three sides are equal', correct: 'SSS', options: ['SSS','SAS','AAS','RHS'], hint: 'Side-Side-Side' },
  { given: 'Two angles and the included side are equal', correct: 'ASA', options: ['ASA','AAS','SAS','SSS'], hint: 'Angle-Side-Angle' },
  { given: 'Right angle, hypotenuse and one side are equal', correct: 'RHS', options: ['RHS','SAS','SSS','ASA'], hint: 'Right angle-Hypotenuse-Side' },
  { given: 'Two angles and a non-included side are equal', correct: 'AAS', options: ['AAS','ASA','SAS','SSS'], hint: 'Angle-Angle-Side' },
  { given: 'AB = PQ, BC = QR, CA = RP', correct: 'SSS', options: ['SSS','SAS','ASA','AAS'], hint: 'Three equal sides' },
  { given: '∠A = ∠P, AB = PQ, ∠B = ∠Q', correct: 'ASA', options: ['ASA','AAS','SAS','RHS'], hint: 'Two angles with the side between them' },
  { given: '∠A = ∠P, ∠B = ∠Q, BC = QR', correct: 'AAS', options: ['AAS','ASA','SAS','SSS'], hint: 'Two angles and a side not between them' },
  { given: 'AB = PQ, BC = QR, ∠B = ∠Q (included)', correct: 'SAS', options: ['SAS','SSS','ASA','AAS'], hint: 'Two sides with the angle between them' },
  { given: '∠C = ∠R = 90°, AB = PQ (hyp), AC = PR', correct: 'RHS', options: ['RHS','SAS','ASA','SSS'], hint: 'Right-angle triangles with hypotenuse equal' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const TriangleTheorem = () => {
  const [questions] = useState(() => shuffle(PROBLEMS).slice(0, 8));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = questions[idx];

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const ok = opt === current.correct;
    if (ok) setScore(s => s + 12);
    setFeedback({ ok, msg: ok ? `✅ Correct! ${current.hint}` : `❌ Answer: ${current.correct} — ${current.hint}` });
    setTimeout(() => {
      setFeedback(null); setSelected(null);
      if (idx + 1 >= questions.length) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 1600);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>📐</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>Theorem Master!</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> / {questions.length * 12}</p>
        <button
          onClick={() => { setIdx(0); setScore(0); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#a78bfa)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 540, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Question {idx + 1} / {questions.length}</span>
        <span style={{ color: '#a78bfa', fontWeight: 600 }}>Score: {score}</span>
      </div>

      {/* SVG triangle illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width={180} height={100} viewBox="0 0 180 100">
          <polygon points="90,10 170,90 10,90" fill="rgba(124,58,237,0.12)" stroke="#7C3AED" strokeWidth={2} />
          <text x={84} y={8} fill="#a78bfa" fontSize={11}>A</text>
          <text x={172} y={95} fill="#a78bfa" fontSize={11}>B</text>
          <text x={2} y={95} fill="#a78bfa" fontSize={11}>C</text>
        </svg>
        <svg width={180} height={100} viewBox="0 0 180 100">
          <polygon points="90,10 170,90 10,90" fill="rgba(6,182,212,0.08)" stroke="#06B6D4" strokeWidth={2} strokeDasharray="6,3" />
          <text x={84} y={8} fill="#67e8f9" fontSize={11}>P</text>
          <text x={172} y={95} fill="#67e8f9" fontSize={11}>Q</text>
          <text x={2} y={95} fill="#67e8f9" fontSize={11}>R</text>
        </svg>
      </div>

      {/* Question */}
      <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Which congruence criterion applies?</div>
        <div style={{ fontSize: 15, color: '#e2e8f0', lineHeight: 1.5 }}>{current.given}</div>
      </div>

      {feedback && (
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: feedback.ok ? '#10B981' : '#EF4444', marginBottom: 10, lineHeight: 1.4 }}>
          {feedback.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {current.options.map(opt => {
          let bg = 'rgba(15,22,41,0.8)', border = '1px solid rgba(99,102,241,0.25)', color = '#e2e8f0';
          if (selected === opt) {
            bg = feedback?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';
            border = `1px solid ${feedback?.ok ? '#10B981' : '#EF4444'}`;
            color = feedback?.ok ? '#10B981' : '#EF4444';
          } else if (feedback && opt === current.correct) {
            bg = 'rgba(16,185,129,0.15)'; border = '1px solid #10B981'; color = '#10B981';
          }
          return (
            <button key={opt} onClick={() => handleSelect(opt)}
              style={{ padding: '14px 8px', borderRadius: 8, background: bg, border, color, fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TriangleTheorem;
