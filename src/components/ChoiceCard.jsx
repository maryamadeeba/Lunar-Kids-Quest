import EmphasizeNumbers from './EmphasizeNumbers.jsx';
import Icon from './Icon.jsx';

/**
 * A choice the commander can make. The gain (green) and cost (red)
 * are always visible BEFORE the child confirms: that is the trade-off.
 */
export default function ChoiceCard({ title, desc, gain, cost, icon, iconBg = '#FFF4C2', selected, onClick, compact = false }) {
  return (
    <button
      type="button"
      className="btn"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        width: '100%', padding: compact ? '6px 10px' : '10px 12px', borderRadius: 22, background: '#fff', textAlign: 'left', justifyContent: 'flex-start',
        border: `4px solid ${selected ? 'var(--yellow)' : '#fff'}`, boxShadow: `0 5px 0 ${selected ? 'var(--yellow-dark)' : '#A9AEE0'}`, gap: 12,
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ flex: 'none', width: compact ? 38 : 50, height: compact ? 38 : 50, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon d={icon} size={28} stroke={2.2} />
      </span>
      <span style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="display" style={{ fontSize: compact ? 16 : 18, lineHeight: compact ? '19px' : '21px' }}>{title}</span>
        {desc && !compact && <span className="muted" style={{ fontWeight: 700, fontSize: 13, lineHeight: '17px' }}>{desc}</span>}
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {gain && <span className="pill chip-info" style={{ height: 26, fontSize: 13 }}><EmphasizeNumbers text={gain} /></span>}
          {cost && <span className="pill chip-info" style={{ height: 26, fontSize: 13 }}><EmphasizeNumbers text={cost} /></span>}
        </span>
      </span>
    </button>
  );
}
