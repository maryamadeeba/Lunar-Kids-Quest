import ChanduMascot from './ChanduMascot.jsx';
import Icon from './Icon.jsx';
import SpeakButton from './SpeakButton.jsx';
import GlossText from './GlossText.jsx';

/**
 * Chandu talking to the commander, with a hint button (?) and the
 * one-time "Call Mission Control" lifeline (headset).
 */
export default function MissionDialogue({ mood, message, onHint, onHouston, houstonUsed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <ChanduMascot mood={mood} size={42} />
      <div className="speech" aria-live="polite" style={{ flex: '1 1 0', minWidth: 0 }}><GlossText text={message?.replace(/Shield/g, 'radiation safety')} /></div>
      <SpeakButton text={message?.replace(/Shield/g, 'radiation safety')} size={42} label="Read Chandu’s message aloud" />
      {onHint && (
        <button type="button" className="btn btn-round" aria-label="Ask Chandu for a hint" onClick={onHint}
          style={{ width: 42, height: 42, background: 'var(--purple)', color: '#fff', boxShadow: '0 4px 0 var(--purple-dark)', fontSize: 23 }}>?</button>
      )}
      {onHouston && (
        <button type="button" className="btn btn-round" onClick={onHouston}
          aria-label={houstonUsed ? 'Mission Control call already used' : 'Call Mission Control for the best plan. You can use this once.'}
          style={{ width: 42, height: 42, background: houstonUsed ? 'var(--moon)' : 'var(--sky)', boxShadow: `0 4px 0 ${houstonUsed ? '#8E939E' : 'var(--sky-dark)'}` }}>
          <Icon name="headset" size={24} stroke={2.3} />
        </button>
      )}
    </div>
  );
}
