import React, { useState } from 'react';

const ELEMENTS = [
  { name: 'Hydrogen', symbol: 'H', protons: 1, neutrons: 0, electrons: 1, period: 1, group: 1 },
  { name: 'Helium', symbol: 'He', protons: 2, neutrons: 2, electrons: 2, period: 1, group: 18 },
  { name: 'Lithium', symbol: 'Li', protons: 3, neutrons: 4, electrons: 3, period: 2, group: 1 },
  { name: 'Carbon', symbol: 'C', protons: 6, neutrons: 6, electrons: 6, period: 2, group: 14 },
  { name: 'Nitrogen', symbol: 'N', protons: 7, neutrons: 7, electrons: 7, period: 2, group: 15 },
  { name: 'Oxygen', symbol: 'O', protons: 8, neutrons: 8, electrons: 8, period: 2, group: 16 },
  { name: 'Sodium', symbol: 'Na', protons: 11, neutrons: 12, electrons: 11, period: 3, group: 1 },
  { name: 'Magnesium', symbol: 'Mg', protons: 12, neutrons: 12, electrons: 12, period: 3, group: 2 },
  { name: 'Aluminium', symbol: 'Al', protons: 13, neutrons: 14, electrons: 13, period: 3, group: 13 },
  { name: 'Chlorine', symbol: 'Cl', protons: 17, neutrons: 18, electrons: 17, period: 3, group: 17 },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const AtomBuilder = () => {
  const [questions] = useState(() => shuffle(ELEMENTS).slice(0, 8));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [inputs, setInputs] = useState({ protons: '', neutrons: '', electrons: '' });
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const el = questions[idx];

  const handleSubmit = () => {
    if (feedback) return;
    const p = parseInt(inputs.protons), n = parseInt(inputs.neutrons), e = parseInt(inputs.electrons);
    const ok = p === el.protons && n === el.neutrons && e === el.electrons;
    const partial = [p === el.protons, n === el.neutrons, e === el.electrons];
    const pts = partial.filter(Boolean).length * 4;
    setScore(s => s + pts);
    setFeedback({ ok, pts, correct: { protons: el.protons, neutrons: el.neutrons, electrons: el.electrons }, given: { protons: p, neutrons: n, electrons: e } });
    setTimeout(() => {
      setFeedback(null);
      setInputs({ protons: '', neutrons: '', electrons: '' });
      if (idx + 1 >= questions.length) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 2000);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>⚛️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>Atom Builder Complete!</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> / {questions.length * 12}</p>
        <button
          onClick={() => { setIdx(0); setScore(0); setFinished(false); setInputs({ protons: '', neutrons: '', electrons: '' }); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Try Again</button>
      </div>
    );
  }

  const fields = [
    { key: 'protons', label: 'Protons (p⁺)', color: '#EF4444' },
    { key: 'neutrons', label: 'Neutrons (n⁰)', color: '#94a3b8' },
    { key: 'electrons', label: 'Electrons (e⁻)', color: '#60a5fa' },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Element {idx + 1} / {questions.length}</span>
        <span style={{ color: '#fbbf24', fontWeight: 600 }}>Score: {score}</span>
      </div>

      {/* Element card */}
      <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))', border: '2px solid rgba(245,158,11,0.35)', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>{el.symbol}</div>
        <div style={{ fontSize: 18, color: '#fff', fontWeight: 600, marginTop: 4 }}>{el.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Period {el.period} · Group {el.group}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Atomic Mass ≈ {el.protons + el.neutrons}</div>
      </div>

      {feedback ? (
        <div style={{ marginBottom: 12 }}>
          {fields.map(f => {
            const ok = feedback.given[f.key] === feedback.correct[f.key];
            return (
              <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                <span style={{ color: '#94a3b8' }}>{f.label}</span>
                <span style={{ color: ok ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                  {ok ? `✓ ${feedback.correct[f.key]}` : `✗ ${feedback.given[f.key]} (ans: ${feedback.correct[f.key]})`}
                </span>
              </div>
            );
          })}
          <div style={{ textAlign: 'center', marginTop: 8, color: feedback.pts >= 12 ? '#10B981' : '#fbbf24', fontWeight: 700 }}>
            +{feedback.pts} pts
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {fields.map(f => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: f.color, fontSize: 13, width: 130, flexShrink: 0 }}>{f.label}</span>
              <input
                type="number"
                value={inputs[f.key]}
                onChange={e => setInputs(p => ({ ...p, [f.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="?"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: `1px solid ${f.color}40`, background: 'rgba(15,22,41,0.8)', color: '#fff', fontSize: 15, outline: 'none' }}
              />
            </div>
          ))}
        </div>
      )}

      {!feedback && (
        <button
          onClick={handleSubmit}
          disabled={!inputs.protons || !inputs.neutrons || !inputs.electrons}
          style={{ width: '100%', padding: '11px 0', borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15, opacity: (!inputs.protons || !inputs.neutrons || !inputs.electrons) ? 0.5 : 1 }}
        >Build Atom ⚛️</button>
      )}
    </div>
  );
};

export default AtomBuilder;
