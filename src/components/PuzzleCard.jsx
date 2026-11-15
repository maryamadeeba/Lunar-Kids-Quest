/** A row of battery cells: yellow = free, grey = being used. */
export function BatteryCells({ total, used, size = 26, label }) {
  return (
    <div role="img" aria-label={label || `${total - used} of ${total} cells free`} style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: total }, (_, i) => {
        const isUsed = i >= total - used;
        return (
          <span key={i} style={{ width: size, height: size + 4, borderRadius: 6, background: isUsed ? 'var(--moon)' : 'var(--yellow)', border: `2px solid ${isUsed ? '#8E939E' : 'var(--yellow-dark)'}` }} />
        );
      })}
    </div>
  );
}

/**
 * A small maths puzzle tied to the mission. Wrong answers get a friendly
 * hint and another try. The child can never lose a mission for a maths mistake.
 */
export default function PuzzleCard({ question, cells, options, answer, solved, wrong, onAnswer, onNext, nextLabel = 'Next' }) {
  return (
    <div className="card a-rise" style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="display" style={{ fontSize: 19, lineHeight: '24px' }}>{question}</div>
      {cells && <BatteryCells total={cells.total} used={cells.used} size={24} label={cells.label} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        {options.map((n) => {
          const right = solved && n === answer;
          const bad = wrong === n && !solved;
          return (
            <button
              key={n}
              type="button"
              className={`btn ${bad ? 'a-shake' : ''}`}
              aria-label={`Answer ${n}`}
              onClick={() => onAnswer(n)}
              style={{ height: 70, borderRadius: 20, fontSize: 34, background: right ? '#8BEA7F' : bad ? 'var(--pink)' : '#EEF0FF', boxShadow: `0 6px 0 ${right ? '#3FA834' : bad ? 'var(--pink-dark)' : '#C9CCEB'}` }}
            >
              {n}
            </button>
          );
        })}
      </div>
      {solved && (
        <button type="button" className="btn btn-yellow a-pop" style={{ marginTop: 'auto', height: 60, fontSize: 22 }} onClick={onNext}>{nextLabel}</button>
      )}
    </div>
  );
}

/** Builds three answer tiles around the right answer. */
export function answerOptions(right) {
  return right === 0 ? [0, 1, 2] : [right - 1, right, right + 1];
}
