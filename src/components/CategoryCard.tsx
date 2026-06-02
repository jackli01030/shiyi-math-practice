import type { QuestionType } from "../types/question";

interface CategoryCardProps {
  title: QuestionType;
  icon: string;
  accent: "blue" | "green" | "pink" | "yellow" | "mint" | "lavender";
  onSelect: (type: QuestionType) => void;
}

export function CategoryCard({ title, icon, accent, onSelect }: CategoryCardProps) {
  return (
    <button className={`category-card accent-${accent}`} type="button" onClick={() => onSelect(title)}>
      <span className="category-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{title}</span>
    </button>
  );
}
