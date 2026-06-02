import type { PracticeRecord, QuestionType, WrongQuestionRecord } from "../types/question";

const WRONG_QUESTIONS_KEY = "shiyi-math-practice-wrong-questions";
const PRACTICE_RECORDS_KEY = "shiyi-math-practice-records";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getWrongQuestionRecords(): WrongQuestionRecord[] {
  return readJson<WrongQuestionRecord[]>(WRONG_QUESTIONS_KEY, []);
}

export function getActiveWrongQuestionIds(): string[] {
  return getWrongQuestionRecords()
    .filter((record) => !record.mastered)
    .map((record) => record.questionId);
}

export function saveWrongQuestion(questionId: string): void {
  const now = new Date().toISOString();
  const records = getWrongQuestionRecords();
  const existingRecord = records.find((record) => record.questionId === questionId);

  if (existingRecord) {
    existingRecord.mistakeCount += 1;
    existingRecord.lastMissedAt = now;
    existingRecord.mastered = false;
    writeJson(WRONG_QUESTIONS_KEY, records);
    return;
  }

  writeJson(WRONG_QUESTIONS_KEY, [
    ...records,
    {
      questionId,
      mistakeCount: 1,
      firstMissedAt: now,
      lastMissedAt: now,
      mastered: false,
    },
  ]);
}

export function markWrongQuestionMastered(questionId: string): void {
  const records = getWrongQuestionRecords().map((record) =>
    record.questionId === questionId ? { ...record, mastered: true } : record,
  );

  writeJson(WRONG_QUESTIONS_KEY, records);
}

export function getPracticeRecords(): PracticeRecord[] {
  return readJson<PracticeRecord[]>(PRACTICE_RECORDS_KEY, []);
}

export function savePracticeRecord(record: {
  mode: PracticeRecord["mode"];
  category?: QuestionType;
  total: number;
  correctCount: number;
  durationSeconds: number;
}): void {
  const records = getPracticeRecords();
  const newRecord: PracticeRecord = {
    id: crypto.randomUUID(),
    finishedAt: new Date().toISOString(),
    ...record,
  };

  writeJson(PRACTICE_RECORDS_KEY, [newRecord, ...records].slice(0, 30));
}
