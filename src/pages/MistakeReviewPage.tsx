import { useMemo, useState } from "react";
import { PracticeSession } from "../components/PracticeSession";
import { getQuestionsByIds } from "../utils/practice";
import { getActiveWrongQuestionIds, getWrongQuestionRecords } from "../utils/storage";
import type { MathQuestion } from "../types/question";

interface MistakeReviewPageProps {
  onExit: () => void;
}

export function MistakeReviewPage({ onExit }: MistakeReviewPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [practiceQuestion, setPracticeQuestion] = useState<MathQuestion | null>(null);

  const wrongQuestions = useMemo(
    () => getQuestionsByIds(getActiveWrongQuestionIds()),
    [refreshKey],
  );
  const records = useMemo(() => getWrongQuestionRecords(), [refreshKey]);

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
    </main>
  );
}
