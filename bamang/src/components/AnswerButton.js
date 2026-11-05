// state: 'normal' | 'chosen' (vàng) | 'correct' (xanh) | 'wrong' (đỏ) | 'hidden' (bị 50:50 ẩn)
const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button
    className={`answer-btn ${state}`}
    disabled={disabled || state === 'hidden'}
    onClick={onClick}
  >
    {state === 'hidden' ? '' : `${letter}. ${text}`}
  </button>
);

export default AnswerButton;
