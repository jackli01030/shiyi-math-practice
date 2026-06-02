import { useMemo, useState } from "react";
import { CategoryCard } from "../components/CategoryCard";
import { PracticeSession } from "../components/PracticeSession";
import { specialPracticeTypes } from "../data/questions";
import { getQuestionsByType } from "../utils/practice";
import type { QuestionType } from "../types/question";

interface SpecialPracticePageProps {
  onExit: () => void;
}

const categoryMeta: Record<QuestionType, { icon: string; accent: "blue" | "green" | "pink" | "yellow" | "mint" | "lavender" }> = {
  "20以内加法": { icon: "+", accent: "blue" },
  "20以内减法": { icon: "-", accent: "green" },
  "100以内数的认识": { icon: "10", accent: "yellow" },
  "大小比较": { icon: ">", accent: "pink" },
  "100以内简单加减": { icon: "=", accent: "mint" },
  人民币: { icon: "¥", accent: "mint" },
  找规律: { icon: "◇", accent: "lavender" },
  观察物体: { icon: "◉", accent: "blue" },
  有趣的图形: { icon: "▲", accent: "yellow" },
  解决问题: { icon: "?", accent: "pink" },
};

export function SpecialPracticePage({ onExit }: SpecialPracticePageProps) {
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const practiceQuestions = useMemo(
    () => (selectedType ? getQuestionsByType(selectedType, 10) : []),
    [selectedType],
  );

  if (selectedType) {
    return (
      <PracticeSession
        title="专项练习"
        questions={practiceQuestions}
        mode="special"
        category={selectedType}
        onExit={() => setSelectedType(null)}
        exitLabel="选别的题型"
      />
    );
  }

  return (
    <main className="page">
      <section className="section-head">
        <button className="small-button" type="button" onClick={onExit}>
          回首页
        </button>
        <div>
          <p className="eyebrow">专项练习</p>
          <h1>选一个今天想练的题型</h1>
        </div>
      </section>
      <section className="category-grid" aria-label="题型分类">
        {specialPracticeTypes.map((type) => (
          <CategoryCard
            key={type}
            title={type}
            icon={categoryMeta[type].icon}
            accent={categoryMeta[type].accent}
            onSelect={setSelectedType}
          />
        ))}
      </section>
    </main>
  );
}
