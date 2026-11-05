import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatScore } from '../data';

const MESSAGES = {
  perfect: 'Xuất sắc! Bạn đã trả lời đúng cả 15 câu',
  done: 'Bạn đã hoàn thành thử thách',
  lives: 'Bạn đã hết mạng',
  time: 'Hết giờ!',
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Mở /result trực tiếp (không có state) thì về trang chủ
  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="result-box">
      <h2>{MESSAGES[state.reason]}</h2>
      <p>Người chơi: {state.name}</p>
      <p>Số câu trả lời đúng: {state.correctCount}</p>
      <p>Số mạng còn lại: {state.livesLeft}</p>
      <p>Điểm: {formatScore(state.score)}</p>

      <button onClick={() => navigate('/play')}>Chơi lại</button>{' '}
      <button onClick={() => navigate('/')}>Về trang chủ</button>
    </div>
  );
};

export default Result;
