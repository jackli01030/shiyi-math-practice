import type { QuestionVisual as QuestionVisualType } from "../types/question";
import { PinyinText } from "./PinyinText";

interface QuestionVisualProps {
  visual: QuestionVisualType;
}

export function QuestionVisual({ visual }: QuestionVisualProps) {
  return (
    <div className="question-visual" aria-label={visual.caption ?? "题目图形"}>
      {visual.caption ? (
        <p>
          <PinyinText text={visual.caption} />
        </p>
      ) : null}
      <div className="visual-board">
        {visual.rows.map((row, rowIndex) => (
          <div className="visual-row" key={`${row.join("-")}-${rowIndex}`}>
            {row.map((item, itemIndex) => (
              <span className="visual-item" key={`${item}-${itemIndex}`}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
