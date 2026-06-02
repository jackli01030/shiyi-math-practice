export type QuestionType =
  | "20以内加法"
  | "20以内减法"
  | "100以内数的认识"
  | "大小比较"
  | "100以内简单加减"
  | "人民币"
  | "找规律"
  | "观察物体"
  | "有趣的图形"
  | "解决问题";

export type PracticeMode = "daily" | "special" | "mistake";

export interface QuestionVisual {
  caption?: string;
  rows: string[][];
}

export interface MathQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  visual?: QuestionVisual;
}

export interface WrongQuestionRecord {
  questionId: string;
  mistakeCount: number;
  firstMissedAt: string;
  lastMissedAt: string;
  mastered: boolean;
}

export interface PracticeRecord {
  id: string;
  mode: PracticeMode;
  category?: QuestionType;
  total: number;
  correctCount: number;
  durationSeconds: number;
  finishedAt: string;
}
