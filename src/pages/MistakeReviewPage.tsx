import { useMemo, useState } from "react";
import { PracticeSession } from "../components/PracticeSession";
import { getQuestionsByIds } from "../utils/practice";
import { getActiveWrongQuestionIds, getWrongQuestionRecords } from "../utils/storage";
import type { MathQuestion } from "../types/question";

interface MistakeReviewPageProps {
  onExit: () => void;
}

const optionLabels = ["A", "B", "C", "D"];

function formatPrintDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MistakeReviewPage({ onExit }: MistakeReviewPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [practiceQuestion, setPracticeQuestion] = useState<MathQuestion | null>(null);

  const wrongQuestions = useMemo(
    () => getQuestionsByIds(getActiveWrongQuestionIds()),
    [refreshKey],
  );
  const records = useMemo(() => getWrongQuestionRecords(), [refreshKey]);
  const printDate = useMemo(() => formatPrintDate(new Date()), [refreshKey]);

  function handlePrintWrongQuestions() {
    if (wrongQuestions.length === 0) {
      return;
    }

    const cleanup = () => document.body.classList.remove("is-printing-wrong-questions");
    document.body.classList.add("is-printing-wrong-questions");
    window.addEventListener("afterprint", cleanup, { once: true });

    window.setTimeout(() => window.print(), 50);
    window.setTimeout(cleanup, 60000);
  }

  if (practiceQuestion) {
    return (
      <PracticeSession
        title="错题再练"
        questions={[practiceQuestion]}
        mode="mistake"
        category={practiceQuestion.type}
        onExit={() => {
          setPracticeQuestion(null);
          setRefreshKey((value) => value + 1);
        }}
        onFinished={() => {
          setPracticeQuestion(null);
          setRefreshKey((value) => value + 1);
        }}
        exitLabel="回错题页"
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
          <p className="eyebrow">错题再练</p>
          <h1>把容易混的题再练稳</h1>
        </div>
        {wrongQuestions.length > 0 ? (
          <button className="secondary-button" type="button" onClick={handlePrintWrongQuestions}>
            导出PDF/打印
          </button>
        ) : null}
      </section>

      {wrongQuestions.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            ✓
          </div>
          <h2>现在没有待练错题</h2>
          <p>完成练习后，需要再想一想的题会来到这里。</p>
        </section>
      ) : (
        <section className="mistake-list">
          {wrongQuestions.map((question) => {
            const record = records.find((item) => item.questionId === question.id);

            return (
              <article className="mistake-row" key={question.id}>
                <div>
                  <span className="type-tag">{question.type}</span>
                  <h2>{question.question}</h2>
                  <p>已经记录 {record?.mistakeCount ?? 1} 次，慢慢来。</p>
                </div>
                <button className="primary-button" type="button" onClick={() => setPracticeQuestion(question)}>
                  再练一次
                </button>
              </article>
            );
          })}
        </section>
      )}

      {wrongQuestions.length > 0 ? (
        <section className="wrong-print-sheet" aria-hidden="true">
          <header className="print-sheet-head">
            <p>李安岚的数学练习乐园</p>
            <h1>错题练习纸</h1>
            <div className="print-meta">
              <span>姓名：____________</span>
              <span>日期：{printDate}</span>
              <span>题数：{wrongQuestions.length} 道</span>
            </div>
          </header>

          <ol className="print-question-list">
            {wrongQuestions.map((question, index) => {
              const record = records.find((item) => item.questionId === question.id);

              return (
                <li className="print-question-card" key={question.id}>
                  <div className="print-question-title">
                    <strong>
                      {index + 1}. {question.question}
                    </strong>
                    <span>
                      {question.type} · 记录 {record?.mistakeCount ?? 1} 次
                    </span>
                  </div>

                  {question.visual ? (
                    <div className="print-visual">
                      {question.visual.caption ? <p>{question.visual.caption}</p> : null}
                      {question.visual.rows.map((row, rowIndex) => (
                        <div className="print-visual-row" key={`${question.id}-row-${rowIndex}`}>
                          {row.map((item, itemIndex) => (
                            <span key={`${question.id}-item-${rowIndex}-${itemIndex}`}>{item}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="print-options">
                    {question.options.map((option, optionIndex) => (
                      <span key={`${question.id}-option-${option}`}>
                        {optionLabels[optionIndex]}. {option}
                      </span>
                    ))}
                  </div>
                  <div className="print-answer-blank">我的答案：________________</div>
                </li>
              );
            })}
          </ol>

          <section className="print-answer-key">
            <h2>答案和提示</h2>
            {wrongQuestions.map((question, index) => (
              <p key={`${question.id}-answer`}>
                <strong>
                  {index + 1}. {question.answer}
                </strong>
                ：{question.explanation}
              </p>
            ))}
          </section>
        </section>
      ) : null}
    </main>
  );
}
