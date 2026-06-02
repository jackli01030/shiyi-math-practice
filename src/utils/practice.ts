import { questions } from "../data/questions";
import type { MathQuestion, QuestionType } from "../types/question";

export function shuffleQuestions(items: MathQuestion[]): MathQuestion[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function getQuestionsByType(type: QuestionType, count = 10): MathQuestion[] {
  return shuffleQuestions(questions.filter((question) => question.type === type)).slice(0, count);
}

export function getMixedQuestions(types: QuestionType[], count = 10): MathQuestion[] {
  const firstRound = types
    .map((type) => shuffleQuestions(questions.filter((question) => question.type === type))[0])
    .filter((question): question is MathQuestion => Boolean(question));

  const firstRoundIds = new Set(firstRound.map((question) => question.id));
  const remainingPool = questions.filter(
    (question) => types.includes(question.type) && !firstRoundIds.has(question.id),
  );

  const filler = shuffleQuestions(remainingPool).slice(0, Math.max(0, count - firstRound.length));
  return shuffleQuestions([...firstRound, ...filler]).slice(0, count);
}

export function getQuestionsByIds(ids: string[]): MathQuestion[] {
  const idSet = new Set(ids);
  return questions.filter((question) => idSet.has(question.id));
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} 秒`;
  }

  return `${minutes} 分 ${seconds} 秒`;
}

export function getResultMessage(correctCount: number, total: number): string {
  if (correctCount === total) {
    return `今天完成 ${total} 道题，真棒！`;
  }

  if (correctCount >= Math.ceil(total * 0.7)) {
    return "你已经比刚才更厉害了！";
  }

  return "这几道题值得明天再练一次。";
}
