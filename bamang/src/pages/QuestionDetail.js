import { Link, useParams, useNavigate } from 'react-router-dom';
import { POINTS, LEVELS, LETTERS, formatScore } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const qid = Number(id);
  const question = questions.find((q) => q.id === qid);

  if (!question) {
    return (
      <div>
        <h2>Không tìm thấy câu hỏi</h2>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const prev = questions.find((q) => q.id === qid - 1);
  const next = questions.find((q) => q.id === qid + 1);

  return (
    <div>
      <h2>
        Câu hỏi số {question.id} ({LEVELS[question.level]} ·{' '}
        {formatScore(POINTS[question.level])})
      </h2>
      <p>{question.question}</p>

      {question.options.map((option, index) => (
        <div
          key={index}
          className={index === question.answer ? 'option correct' : 'option'}
        >
          {LETTERS[index]}. {option}
          {index === question.answer && ' (Đáp án đúng)'}
        </div>
      ))}

      <div className="pager">
        <span>{prev && <Link to={`/questions/${prev.id}`}>← Câu trước</Link>}</span>
        <span>{next && <Link to={`/questions/${next.id}`}>Câu sau →</Link>}</span>
      </div>

      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;
