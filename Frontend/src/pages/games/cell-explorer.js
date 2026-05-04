import React, { useState } from 'react';

const ORGANELLES = [
  { id: 'nucleus', label: 'Nucleus', description: 'Controls cell activities; contains DNA', emoji: '🔵' },
  { id: 'mitochondria', label: 'Mitochondria', description: 'Powerhouse of the cell; produces ATP', emoji: '🔴' },
  { id: 'ribosome', label: 'Ribosome', description: 'Site of protein synthesis', emoji: '🟡' },
  { id: 'er_rough', label: 'Rough ER', description: 'Has ribosomes; involved in protein processing', emoji: '🟤' },
  { id: 'er_smooth', label: 'Smooth ER', description: 'Lipid synthesis; no ribosomes', emoji: '🟠' },
  { id: 'golgi', label: 'Golgi Apparatus', description: 'Packages and ships proteins', emoji: '🟢' },
  { id: 'vacuole', label: 'Vacuole', description: 'Stores water and nutrients', emoji: '🔷' },
  { id: 'chloroplast', label: 'Chloroplast', description: 'Photosynthesis in plant cells', emoji: '🌿' },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ROUNDS = 8;

const CellExplorer = () => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [questions] = useState(() => shuffle(ORGANELLES).slice(0, ROUNDS));
  const [choices, setChoices] = useState(() => shuffle(ORGANELLES.map(o => o.label)));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = questions[round];

  const handleSelect = (choice) => {
    if (feedback) return;
    setSelected(choice);
    const correct = choice === current.label;
    if (correct) setScore(s => s + 10);
    setFeedback({ ok: correct, msg: correct ? '✅ Correct!' : `❌ It was: ${current.label}` });
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setChoices(shuffle(ORGANELLES.map(o => o.label)));
      if (round + 1 >= ROUNDS) { setFinished(true); return; }
      setRound(r => r + 1);
    }, 1400);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🔬</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#10B981' }}>Exploration Complete!</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> / {ROUNDS * 10}</p>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>{score >= 70 ? 'Outstanding biologist! 🎉' : score >= 50 ? 'Good work! Keep learning.' : 'Review cell organelles and try again.'}</p>
        <button
          onClick={() => { setRound(0); setScore(0); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#10B981,#06B6D4)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 540, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Round {round + 1} / {ROUNDS}</span>
        <span style={{ color: '#10B981', fontWeight: 600 }}>Score: {score}</span>
      </div>

      {/* Cell illustration + question */}
      <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 14, padding: 20, marginBottom: 18, textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{current.emoji}</div>
        <div style={{ fontSize: 13, color: '#67e8f9', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Identify this organelle</div>
        <div style={{ fontSize: 15, color: '#e2e8f0', fontStyle: 'italic' }}>"{current.description}"</div>
      </div>

      {feedback && (
        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: feedback.ok ? '#10B981' : '#EF4444', marginBottom: 10 }}>
          {feedback.msg}
        </div>
      )}

      {/* Choices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {choices.slice(0, 4).map(choice => {
          let bg = 'rgba(15,22,41,0.8)';
          let border = '1px solid rgba(99,102,241,0.25)';
          let color = '#e2e8f0';
          if (selected === choice) {
            bg = feedback?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';
            border = `1px solid ${feedback?.ok ? '#10B981' : '#EF4444'}`;
            color = feedback?.ok ? '#10B981' : '#EF4444';
          } else if (feedback && choice === current.label) {
            bg = 'rgba(16,185,129,0.15)';
            border = '1px solid #10B981';
            color = '#10B981';
          }
          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              style={{ padding: '12px 8px', borderRadius: 8, background: bg, border, color, fontWeight: 500, fontSize: 13, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CellExplorer;
