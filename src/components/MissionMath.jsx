import { useState } from 'react';
import PuzzleCard, { answerOptions } from './PuzzleCard.jsx';
import Sheet from './Sheet.jsx';
import ChanduMascot from './ChanduMascot.jsx';
import SpeakButton from './SpeakButton.jsx';
import { mathPuzzle } from '../lib/visualLearning.js';

export default function MissionMath({ round, on, total, onDone, optional = false }) {
  const puzzle = mathPuzzle(round, on, total);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(null);
  const hint = round.math === 'lamps' ? 'Count the yellow cells used by your plant lamps.' : 'Yellow cells are free. Grey cells are already used.';
  const choices = answerOptions(puzzle.answer);
  const offset = puzzle.answer % choices.length;
  const options = [...choices.slice(offset), ...choices.slice(0, offset)];
  return <Sheet label="Mission math flashcard" fixed><div className="learning-eyebrow">MISSION MATH · CLOCK PAUSED</div><div className="math-coach"><ChanduMascot size={60} mood={solved ? 'cheer' : 'think'} /><strong>Count with me!</strong><SpeakButton text={puzzle.question} /></div><div className="math-expression" aria-label={puzzle.expression}>{puzzle.expression}</div>
    <PuzzleCard question={puzzle.question} cells={puzzle.cells} options={options} answer={puzzle.answer} solved={solved} wrong={wrong} onAnswer={n => { if (solved) return; if (n === puzzle.answer) { setSolved(true); setWrong(null); } else setWrong(n); }} onNext={onDone} nextLabel={optional ? 'Back to my machines' : 'Run my plan!'} />
    <p className="math-feedback" role="status">{solved ? puzzle.explanation : wrong !== null ? `Good try. ${hint} You can try again!` : hint}</p><small>Math practice never takes supplies or stars.</small>{optional && <button className="btn btn-soft" onClick={onDone}>Skip, back to my machines</button>}
  </Sheet>;
}
