import React, { useState } from 'react';

const CLUES = [
  { clues: ['Period 3, Group 1', 'Atomic no. 11', 'Reacts vigorously with water'], answer: 'Na (Sodium)', opts: ['Na (Sodium)', 'K (Potassium)', 'Li (Lithium)', 'Mg (Magnesium)'] },
  { clues: ['Noble gas, Period 2', 'Atomic no. 10', 'Used in neon signs'], answer: 'Ne (Neon)', opts: ['Ne (Neon)', 'Ar (Argon)', 'He (Helium)', 'Kr (Krypton)'] },
  { clues: ['Halogen, Period 3', 'Atomic no. 17', 'Used to disinfect water'], answer: 'Cl (Chlorine)', opts: ['Cl (Chlorine)', 'F (Fluorine)', 'Br (Bromine)', 'I (Iodine)'] },
  { clues: ['Period 4, Group 2', 'Atomic no. 20', 'Found in bones and teeth'], answer: 'Ca (Calcium)', opts: ['Ca (Calcium)', 'Mg (Magnesium)', 'Ba (Barium)', 'Sr (Strontium)'] },
  { clues: ['Transition metal, Period 4', 'Atomic no. 26', 'Most common in Earth\'s core'], answer: 'Fe (Iron)', opts: ['Fe (Iron)', 'Co (Cobalt)', 'Ni (Nickel)', 'Cu (Copper)'] },
  { clues: ['Period 2, Group 14', 'Atomic no. 6', 'Basis of all organic life'], answer: 'C (Carbon)', opts: ['C (Carbon)', 'Si (Silicon)', 'N (Nitrogen)', 'O (Oxygen)'] },
  { clues: ['Period 1, Group 1', 'Atomic no. 1', 'Lightest element'], answer: 'H (Hydrogen)', opts: ['H (Hydrogen)', 'He (Helium)', 'Li (Lithium)', 'Be (Beryllium)'] },
  { clues: ['Period 3, Group 13', 'Atomic no. 13', 'Used in aircraft bodies'], answer: 'Al (Aluminium)', opts: ['Al (Aluminium)', 'Ga (Gallium)', 'B (Boron)', 'In (Indium)'] },
  { clues: ['Period 4, Group 11', 'Atomic no. 29', 'Excellent conductor, red metal'], answer: 'Cu (Copper)', opts: ['Cu (Copper)', 'Au (Gold)', 'Ag (Silver)', 'Zn (Zinc)'] },
  { clues: ['Period 2, Group 16', 'Atomic no. 8', 'Essential for respiration'], answer: 'O (Oxygen)', opts: ['O (Oxygen)', 'S (Sulphur)', 'Se (Selenium)', 'N (Nitrogen)'] },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const PeriodicQuest = () => {
  const [questions] = useState(() => shuffle(CLUES).slice(0, 8));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  const handleReveal = () => {
    if (revealedClues < q.clues.length) setRevealedClues(r => r + 1);
  };

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const ok = opt === q.answer;
    const pts = ok ? Math.max(10, 30 - (revealedClues - 1) * 10) : 0;
    if (ok) setScore(s => s + pts);
    setFeedback({ ok, pts, msg: ok ? `✅ Correct! +${pts} pts (${4 - revealedClues} clues unused)` : `❌ Answer: ${q.answer}` });
    setTimeout(() => {
      setFeedback(null); setSelected(null); setRevealedClues(1);
      if (idx + 1 >= questions.length) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 1800);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>🧪</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>Periodic Quest Complete!</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> / {questions.length * 30}</p>
        <p style={{ color: '#64748b', fontSize: 13 }}>Tip: Fewer clues used = more points!</p>
        <button
          onClick={() => { setIdx(0); setScore(0); setRevealedClues(1); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Element {idx + 1} / {questions.length}</span>
        <span style={{ color: '#fbbf24', fontWeight: 600 }}>Score: {score}</span>
      </div>

      {/* Clues */}
      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#fbbf24', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>🔍 Clues Revealed: {revealedClues} / {q.clues.length}</div>
        {q.clues.slice(0, revealedClues).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fbbf24', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: '#e2e8f0' }}>{c}</span>
          </div>
        ))}
        {revealedClues < q.clues.length && !feedback && (
          <button onClick={handleReveal}
            style={{ marginTop: 6, padding: '5px 14px', borderRadius: 6, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: 12, cursor: 'pointer' }}>
            + Reveal Clue (−10 pts)
          </button>
        )}
      </div>

      {feedback && (
        <div style={{ fontSize: 14, fontWeight: 700, color: feedback.ok ? '#10B981' : '#EF4444', marginBottom: 10, textAlign: 'center' }}>
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
          } else if (feedback && opt === q.answer) {
            bg = 'rgba(16,185,129,0.12)'; border = '1px solid #10B981'; color = '#10B981';
          }
          return (
            <button key={opt} onClick={() => handleSelect(opt)}
              style={{ padding: '12px 8px', borderRadius: 8, background: bg, border, color, fontWeight: 500, fontSize: 12, cursor: 'pointer' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PeriodicQuest;
