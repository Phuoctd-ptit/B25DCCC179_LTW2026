import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOTAL_TIME, MAX_LIVES, LETTERS } from '../data';
import { calcScore, calcStreak } from '../utils';
import QuestionCard from '../components/QuestionCard';
import StatusBar from '../components/StatusBar';
import ProgressBar from '../components/ProgressBar';
import Helpers from '../components/Helpers';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]); // "correct" | "wrong" | "skipped"
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [status, setStatus] = useState('answering');
  const [selected, setSelected] = useState(null);
  const [hidden, setHidden] = useState([]); // đáp án bị 50:50 ẩn
  const [used, setUsed] = useState({ fifty: false, skip: false, life: false });

  const question = questions[index];
  const score = calcScore(results, questions);
  const streak = calcStreak(results, questions);

  // Kết thúc lượt chơi: lưu lịch sử rồi sang trang kết quả
  const finish = (reason, finalResults, finalLives) => {
    const data = {
      name: playerName,
      score: calcScore(finalResults, questions),
      correctCount: finalResults.filter((r) => r === 'correct').length,
      livesLeft: finalLives,
    };
    onFinish(data);
    navigate('/result', { replace: true, state: { ...data, reason } });
  };

  const moveNext = (newResults, newLives) => {
    if (newLives === 0) {
      finish('lives', newResults, newLives);
    } else if (index === questions.length - 1) {
      const perfect = newResults.every((r) => r === 'correct');
      finish(perfect ? 'perfect' : 'done', newResults, newLives);
    } else {
      setResults(newResults);
      setLives(newLives);
      setIndex(index + 1);
      setSelected(null);
      setHidden([]);
      setStatus('answering');
    }
  };

  const goNext = () => {
    const isCorrect = selected === question.answer;
    const newResults = [...results, isCorrect ? 'correct' : 'wrong'];
    const newLives = isCorrect ? lives : lives - 1;
    moveNext(newResults, newLives);
  };

  const handleChoose = (i) => {
    setSelected(i);
    setStatus('locked');
  };

  // ===== Quyền trợ giúp =====
  const handleFifty = () => {
    const wrongOnes = [0, 1, 2, 3].filter((i) => i !== question.answer);
    const two = [...wrongOnes].sort(() => Math.random() - 0.5).slice(0, 2);
    setHidden(two);
    setUsed({ ...used, fifty: true });
  };

  const handleSkip = () => {
    setUsed({ ...used, skip: true });
    moveNext([...results, 'skipped'], lives); // không điểm, không mất mạng
  };

  const handleLife = () => {
    setLives(lives + 1);
    setUsed({ ...used, life: true });
  };

  // ===== Đồng hồ chung =====
  useEffect(() => {
    if (status !== 'answering') return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (timeLeft === 0) {
      finish('time', results, lives);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ===== Các bước chờ =====
  useEffect(() => {
    if (status === 'locked') {
      const t = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(t);
    }
    if (status === 'revealed') {
      const t = setTimeout(() => goNext(), 1000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // ===== Phím tắt A, B, C, D =====
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i === -1 || hidden.includes(i)) return; // phím lạ hoặc đáp án đã ẩn
      handleChoose(i);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, hidden]);

  // ===== Tiêu đề tab =====
  useEffect(() => {
    document.title = `Câu ${index + 1}/${questions.length} – còn ${lives} mạng`;
    return () => {
      document.title = 'Thử thách 3 mạng';
    };
  }, [index, lives, questions.length]);

  return (
    <div className="play">
      <StatusBar timeLeft={timeLeft} lives={lives} score={score} streak={streak} />
      <ProgressBar results={results} current={index} total={questions.length} />
      <QuestionCard
        question={question}
        number={index + 1}
        total={questions.length}
        status={status}
        selected={selected}
        hidden={hidden}
        onChoose={handleChoose}
      />
      <Helpers
        status={status}
        lives={lives}
        used={used}
        onFifty={handleFifty}
        onSkip={handleSkip}
        onLife={handleLife}
      />
    </div>
  );
};

export default Play;
