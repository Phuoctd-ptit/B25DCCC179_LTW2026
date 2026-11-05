import { POINTS, STREAK_BONUS } from './data';

// results = ["correct", "wrong", "skipped", ...] (mỗi phần tử ứng với một câu đã qua)
// Dùng reduce với giá trị khởi tạo { score, streak } để vừa cộng điểm vừa đếm chuỗi đúng
const reduceResults = (results, questions) =>
  results.reduce(
    (acc, r, i) => {
      if (r === 'correct') {
        const streak = acc.streak + 1;
        let add = POINTS[questions[i].level];
        if (streak >= 3) add += STREAK_BONUS; // từ câu đúng thứ 3 liên tiếp
        return { score: acc.score + add, streak };
      }
      if (r === 'wrong') {
        return { score: acc.score, streak: 0 }; // sai thì chuỗi về 0
      }
      return acc; // câu bỏ qua: giữ nguyên
    },
    { score: 0, streak: 0 }
  );

export const calcScore = (results, questions) => reduceResults(results, questions).score;

export const calcStreak = (results, questions) => reduceResults(results, questions).streak;
