import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/play');
  };

  return (
    <div>
      <h1>Thử thách 3 mạng</h1>

      <ul>
        <li>Có 15 câu hỏi, 3 mạng và 90 giây cho cả lượt chơi.</li>
        <li>Trả lời đúng được cộng điểm: Dễ 100, Trung bình 200, Khó 300.</li>
        <li>Từ câu đúng thứ 3 liên tiếp, mỗi câu đúng được thưởng thêm 50 điểm.</li>
        <li>Trả lời sai thì mất 1 mạng nhưng vẫn đi tiếp.</li>
        <li>Lượt chơi kết thúc khi hết câu, hết mạng hoặc hết giờ.</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            placeholder="Nhập tên của bạn"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>{' '}
        <button type="submit" disabled={playerName.trim() === ''}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;
