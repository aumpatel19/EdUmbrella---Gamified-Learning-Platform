import React, { useState, useEffect, useCallback } from 'react';

const QUESTIONS = [
  { q: '(-5) + 8', a: 3 }, { q: '(-12) + (-7)', a: -19 }, { q: '15 + (-9)', a: 6 },
  { q: '(-3) × 4', a: -12 }, { q: '(-6) × (-5)', a: 30 }, { q: '18 ÷ (-3)', a: -6 },
  { q: '(-20) ÷ (-4)', a: 5 }, { q: '(-8) − 5', a: -13 }, { q: '7 − (-11)', a: 18 },
  { q: '(-2) × (-3) × 4', a: 24 }, { q: '(-15) + 9', a: -6 }, { q: '(-4)²', a: 16 },
  { q: '(-3)³', a: -27 }, { q: '24 ÷ (-8)', a: -3 }, { q: '(-7) × 0', a: 0 },
  { q: '(-9) + (-11)', a: -20 }, { q: '5 × (-6)', a: -30 }, { q: '(-16) − (-4)', a: -12 },
  { q: '100 + (-45)', a: 55 }, { q: '(-2) × 8 + 5', a: -11 },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const IntegerBattle = () => {
  const [questions] = useState(() => shuffle(QUESTIONS).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(15);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (finished || feedback) return;
    if (timer <= 0) { handleWrong(); return; }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, finished, feedback]);

  const handleWrong = useCallback(() => {
    setCombo(0);
    setFeedback({ ok: false, msg: `Wrong! Answer was ${questions[idx].a}` });
    setHp(h => Math.max(0, h - 20));
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= questions.length || hp - 20 <= 0) { setFinished(true); return; }
      setIdx(i => i + 1);
      setInput('');
      setTimer(15);
    }, 1200);
  }, [idx, questions, hp]);

  const handleSubmit = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    if (val === questions[idx].a) {
      const dmg = 10 + combo * 2;
      setCombo(c => c + 1);
      setScore(s => s + 10 + combo * 5);
      setEnemyHp(h => Math.max(0, h - dmg));
      setFeedback({ ok: true, msg: `⚔️ ${dmg} damage! ${combo > 0 ? `Combo ×${combo + 1}!` : ''}` });
      setTimeout(() => {
        setFeedback(null);
        if (idx + 1 >= questions.length || enemyHp - dmg <= 0) { setFinished(true); return; }
        setIdx(i => i + 1);
        setInput('');
        setTimer(15);
      }, 1000);
    } else {
      handleWrong();
    }
  };

  const pct = (v) => Math.round(v);

  if (finished) {
    const won = enemyHp <= 0 || score >= 80;
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>{won ? '🏆' : '💀'}</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: won ? '#10B981' : '#EF4444' }}>{won ? 'Victory!' : 'Defeated!'}</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> | Enemy HP: <b style={{ color: '#EF4444' }}>{enemyHp}</b></p>
        <button
          onClick={() => { setIdx(0); setScore(0); setHp(100); setEnemyHp(100); setFinished(false); setInput(''); setTimer(15); setCombo(0); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}
        >Play Again</button>
      </div>
    );
  }

  const q = questions[idx];
  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* HP bars */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#10B981' }}>⚔️ You</span><span style={{ color: '#10B981' }}>{hp} HP</span>
          </div>
          <div style={{ height: 10, background: '#1e293b', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct(hp)}%`, background: 'linear-gradient(90deg,#10B981,#06B6D4)', transition: 'width 0.4s' }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#EF4444' }}>👾 Enemy</span><span style={{ color: '#EF4444' }}>{enemyHp} HP</span>
          </div>
          <div style={{ height: 10, background: '#1e293b', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct(enemyHp)}%`, background: 'linear-gradient(90deg,#EF4444,#F97316)', transition: 'width 0.4s' }} />
          </div>
        </div>
      </div>

      {/* Score + combo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
        <span style={{ color: '#a78bfa' }}>Score: {score}</span>
        {combo > 1 && <span style={{ color: '#fbbf24', fontWeight: 700 }}>🔥 Combo ×{combo}</span>}
        <span style={{ color: timer <= 5 ? '#EF4444' : '#94a3b8' }}>⏱ {timer}s</span>
      </div>

      {/* Timer bar */}
      <div style={{ height: 4, background: '#1e293b', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(timer / 15) * 100}%`, background: timer <= 5 ? '#EF4444' : '#7C3AED', transition: 'width 1s linear' }} />
      </div>

      {/* Question */}
      <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Question {idx + 1} of {questions.length}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{q.q} = ?</div>
      </div>

      {/* Feedback overlay */}
      {feedback && (
        <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: feedback.ok ? '#10B981' : '#EF4444', padding: '10px 0' }}>
          {feedback.msg}
        </div>
      )}

      {/* Input */}
      {!feedback && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Your answer"
            autoFocus
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(15,22,41,0.8)', color: '#fff', fontSize: 16, outline: 'none' }}
          />
          <button
            onClick={handleSubmit}
            style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}
          >Attack!</button>
        </div>
      )}
    </div>
  );
};

export default IntegerBattle;
