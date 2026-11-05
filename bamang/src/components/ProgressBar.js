const ProgressBar = ({ results, current, total }) => (
  <div className="progress-bar">
    {Array.from({ length: total }, (_, i) => {
      let cls = 'pending'; // chưa tới: xám
      if (results[i]) cls = results[i]; // correct | wrong | skipped
      if (i === current) cls += ' current'; // câu đang chơi: viền đậm
      return (
        <div key={i} className={`progress-cell ${cls}`}>
          {i + 1}
        </div>
      );
    })}
  </div>
);

export default ProgressBar;
