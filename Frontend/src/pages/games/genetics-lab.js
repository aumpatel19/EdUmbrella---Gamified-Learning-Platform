import React, { useState } from 'react';

const PUZZLES = [
  {
    title: 'Monohybrid Cross',
    desc: 'Tall (TT) × Short (tt). What fraction of F1 offspring are tall?',
    parent1: 'TT', parent2: 'tt', trait: 'Height',
    cross: [['Tt','Tt'],['Tt','Tt']],
    question: 'What fraction of F1 are tall (dominant)?',
    answer: '4/4 (100%)', opts: ['4/4 (100%)', '3/4 (75%)', '2/4 (50%)', '1/4 (25%)'],
    explanation: 'All F1 offspring are Tt — heterozygous tall.',
  },
  {
    title: 'Monohybrid F2 Cross',
    desc: 'Tt × Tt (F1 × F1). Find F2 phenotype ratio.',
    parent1: 'Tt', parent2: 'Tt', trait: 'Height',
    cross: [['TT','Tt'],['Tt','tt']],
    question: 'Phenotype ratio of tall : short in F2?',
    answer: '3:1', opts: ['1:1', '3:1', '2:2', '1:3'],
    explanation: 'TT + 2Tt = tall; tt = short → 3:1',
  },
  {
    title: 'Co-dominance',
    desc: 'RR (red) × WW (white) in snapdragons. F1 phenotype?',
    parent1: 'RR', parent2: 'WW', trait: 'Flower colour',
    cross: [['RW','RW'],['RW','RW']],
    question: 'F1 phenotype in co-dominance?',
    answer: 'Pink (RW)', opts: ['Red', 'White', 'Pink (RW)', 'No flower'],
    explanation: 'Co-dominance → both alleles expressed → pink.',
  },
  {
    title: 'Test Cross',
    desc: 'A tall pea plant (T?) is crossed with short (tt). 50% tall, 50% short offspring.',
    parent1: 'T?', parent2: 'tt', trait: 'Height',
    cross: [['Tt','tt'],['Tt','tt']],
    question: 'The tall parent genotype must be:',
    answer: 'Tt', opts: ['TT', 'Tt', 'tt', 'T?'],
    explanation: 'TT × tt would give 100% tall; Tt × tt gives 50:50.',
  },
  {
    title: 'Sex Determination',
    desc: 'Female (XX) × Male (XY). What fraction of offspring are male?',
    parent1: 'XX', parent2: 'XY', trait: 'Sex',
    cross: [['XX','XY'],['XX','XY']],
    question: 'Probability of male offspring?',
    answer: '50%', opts: ['25%', '50%', '75%', '100%'],
    explanation: 'XX and XY in equal ratio → 50% male.',
  },
  {
    title: 'Incomplete Dominance',
    desc: 'Red (R¹R¹) × White (R²R²) Mirabilis. F1?',
    parent1: 'R¹R¹', parent2: 'R²R²', trait: 'Petal colour',
    cross: [['R¹R²','R¹R²'],['R¹R²','R¹R²']],
    question: 'Incomplete dominance F1 phenotype?',
    answer: 'Pink (R¹R²)', opts: ['Red', 'White', 'Pink (R¹R²)', 'Spotted'],
    explanation: 'Neither allele is fully dominant → intermediate pink.',
  },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const GeneticsLab = () => {
  const [questions] = useState(() => shuffle(PUZZLES).slice(0, 6));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const ok = opt === q.answer;
    if (ok) setScore(s => s + 15);
    setFeedback({ ok, msg: ok ? `✅ Correct! ${q.explanation}` : `❌ Answer: ${q.answer} — ${q.explanation}` });
    setTimeout(() => {
      setFeedback(null); setSelected(null);
      if (idx + 1 >= questions.length) { setFinished(true); return; }
      setIdx(i => i + 1);
    }, 2000);
  };

  if (finished) {
    return (
      <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>🧬</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#10B981' }}>Lab Complete!</h2>
        <p style={{ color: '#94a3b8' }}>Score: <b style={{ color: '#fff' }}>{score}</b> / {questions.length * 15}</p>
        <button
          onClick={() => { setIdx(0); setScore(0); setFinished(false); setSelected(null); setFeedback(null); }}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#10B981,#06B6D4)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Run Again</button>
      </div>
    );
  }

  const [r1c1, r1c2, r2c1, r2c2] = [q.cross[0][0], q.cross[0][1], q.cross[1][0], q.cross[1][1]];
  const cellStyle = { padding: '8px 10px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#e2e8f0', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' };
  const headerStyle = { padding: '6px 10px', textAlign: 'center', fontSize: 12, color: '#67e8f9', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' };

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 13 }}>
        <span style={{ color: '#94a3b8' }}>Cross {idx + 1} / {questions.length}</span>
        <span style={{ color: '#10B981', fontWeight: 600 }}>Score: {score}</span>
      </div>

      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#34d399', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>🧬 {q.title}</div>
        <div style={{ fontSize: 13, color: '#e2e8f0' }}>{q.desc}</div>
      </div>

      {/* Punnett Square */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...headerStyle, background: 'transparent', border: 'none' }}></th>
              <th style={headerStyle}>{q.parent2[0]}</th>
              <th style={headerStyle}>{q.parent2[1]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={headerStyle}>{q.parent1[0]}</td>
              <td style={cellStyle}>{r1c1}</td>
              <td style={cellStyle}>{r1c2}</td>
            </tr>
            <tr>
              <td style={headerStyle}>{q.parent1[1]}</td>
              <td style={cellStyle}>{r2c1}</td>
              <td style={cellStyle}>{r2c2}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14, textAlign: 'center' }}>{q.question}</div>

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
          } else if (feedback && opt === q.answer) {
            bg = 'rgba(16,185,129,0.12)'; border = '1px solid #10B981'; color = '#10B981';
          }
          return (
            <button key={opt} onClick={() => handleSelect(opt)}
              style={{ padding: '12px 8px', borderRadius: 8, background: bg, border, color, fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GeneticsLab;
