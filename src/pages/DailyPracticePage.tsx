import { useMemo } from "react";
import { PracticeSession } from "../components/PracticeSession";
import { dailyPracticeTypes } from "../data/questions";
import { getMixedQuestions } from "../utils/practice";

interface DailyPracticePageProps {
  onExit: () => void;
}

export function DailyPracticePage({ onExit }: DailyPracticePageProps) {
  const dailyQuestions = useMemo(() => getMixedQuestions(dailyPracticeTypes, 10), []);

  return (
    <PracticeSession title="每日练习" questions={dailyQuestions} mode="daily" onExit={onExit} />
  );
}
