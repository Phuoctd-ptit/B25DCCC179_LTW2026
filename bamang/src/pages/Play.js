import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOTAL_TIME, MAX_LIVES } from '../data';
import { calcScore, calcStreak } from '../utils';
import QuestionCard from '../components/QuestionCard';
import StatusBar from '../components/StatusBar';
import ProgressBar from '../components/ProgressBar';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0); // câu hiện tại
  const [results, setResults] = useState([]); // ["correct", "wrong", ...]
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);

  const question = questions[index];
  const score = calcScore(results, questions);
  const streak = calcStreak(results, questions);

  // Kết thúc lượt chơi: sang trang kết quả
  const finish = (reason, finalResults, finalLives) => {
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        score: calcScore(finalResults, questions),
        correctCount: finalResults.filter((r) => r === 'correct').length,
        livesLeft: finalLives,
        reason, // 'perfect' | 'done' | 'lives' | 'time'
      },
    });
  };

  // Sang câu tiếp theo hoặc kết thúc
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

  // Đồng hồ chung: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Hết giờ thì kết thúc ngay
  useEffect(() => {
    if (timeLeft === 0) {
      finish('time', results, lives);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Các bước chờ: locked -> (1s) revealed -> (1s) câu tiếp theo
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
        onChoose={handleChoose}
      />
    </div>
  );
};

export default Play;
