import { POINTS, LEVELS, LETTERS, formatScore } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ question, number, total, status, selected, onChoose }) => {
  // Quyết định màu của từng đáp án
  const getState = (i) => {
    if (status === 'locked') {
      return i === selected ? 'chosen' : 'normal';
    }
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return 'normal';
  };

  return (
    <div className="question-card">
      <p className="question-info">
        Câu {number}/{total} · {LEVELS[question.level]} ·{' '}
        {formatScore(POINTS[question.level])}
      </p>
      <h3>{question.question}</h3>

      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={status !== 'answering'}
            onClick={() => onChoose(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
