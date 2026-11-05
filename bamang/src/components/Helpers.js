import { MAX_LIVES } from '../data';

const Helpers = ({ status, lives, used, onFifty, onSkip, onLife }) => {
  const canUse = status === 'answering'; // chỉ bấm được khi đang trả lời

  return (
    <div className="helpers">
      <button disabled={!canUse || used.fifty} onClick={onFifty}>
        50:50
      </button>
      <button disabled={!canUse || used.skip} onClick={onSkip}>
        Bỏ qua
      </button>
      <button disabled={!canUse || used.life || lives >= MAX_LIVES} onClick={onLife}>
        Thêm 1 mạng
      </button>
    </div>
  );
};

export default Helpers;
