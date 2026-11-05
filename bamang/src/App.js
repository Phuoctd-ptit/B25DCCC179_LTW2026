const BUILD_TAG = "tm-6852";
/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const HISTORY_KEY = 'ltw_3mang_history';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  // Lấy lịch sử từ localStorage khi mở trang
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
      return [];
    }
  });

  // Mounting: gọi API lấy câu hỏi
  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Updating: mỗi khi history đổi thì lưu vào localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Thêm một lượt chơi mới vào lịch sử (Play gọi khi kết thúc)
  const handleFinish = ({ name, score, correctCount, livesLeft }) => {
    const record = {
      id: Date.now(),
      name,
      score,
      correctCount,
      livesLeft,
      playedAt: new Date().toLocaleString('vi-VN'),
    };
    setHistory((prev) => [...prev, record]);
  };

  const handleClearHistory = () => setHistory([]);

  // Lượt có điểm cao nhất (bằng điểm thì ưu tiên nhiều mạng hơn)
  const best = history.reduce((top, h) => {
    if (!top) return h;
    if (h.score > top.score) return h;
    if (h.score === top.score && h.livesLeft > top.livesLeft) return h;
    return top;
  }, null);

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout loading={loading} error={error} buildTag={BUILD_TAG} />}
      >
        <Route
          index
          element={
            <Home playerName={playerName} setPlayerName={setPlayerName} best={best} />
          }
        />
        <Route
          path="play"
          element={
            playerName.trim() ? (
              <Play
                questions={questions}
                playerName={playerName.trim()}
                onFinish={handleFinish}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} onClear={handleClearHistory} />}
        />
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
