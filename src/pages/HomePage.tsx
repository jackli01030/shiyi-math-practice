import { useEffect, useState } from "react";
import { formatDuration } from "../utils/practice";
import { getActiveWrongQuestionIds, getPracticeRecords } from "../utils/storage";
import type { PracticeRecord } from "../types/question";

interface HomePageProps {
  onDaily: () => void;
  onSpecial: () => void;
  onMistakes: () => void;
}

export function HomePage({ onDaily, onSpecial, onMistakes }: HomePageProps) {
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    setRecords(getPracticeRecords().slice(0, 3));
    setWrongCount(getActiveWrongQuestionIds().length);
  }, []);

  return (
    <main className="page">
      <section className="welcome-section">
        <p className="eyebrow">一年级下册</p>
        <h1>李安岚的数学练习乐园</h1>
        <p className="welcome-note">每天一点点，数字会越来越熟。</p>
      </section>

      <section className="home-actions" aria-label="练习入口">
        <button className="home-card home-card-blue" type="button" onClick={onDaily}>
          <span aria-hidden="true">☀</span>
          <strong>每日练习</strong>
          <small>10 道小题</small>
        </button>
        <button className="home-card home-card-green" type="button" onClick={onSpecial}>
          <span aria-hidden="true">◇</span>
          <strong>专项练习</strong>
          <small>选一个题型</small>
        </button>
        <button className="home-card home-card-pink" type="button" onClick={onMistakes}>
          <span aria-hidden="true">↻</span>
          <strong>错题再练</strong>
          <small>{wrongCount > 0 ? `${wrongCount} 道待练` : "都掌握啦"}</small>
        </button>
      </section>

      <section className="parent-panel">
        <div>
          <p className="eyebrow">练习小记录</p>
          <h2>最近完成</h2>
        </div>
        {records.length > 0 ? (
          <div className="record-list">
            {records.map((record) => (
              <div className="record-row" key={record.id}>
                <span>{record.category ?? (record.mode === "daily" ? "每日练习" : "错题再练")}</span>
                <strong>
                  {record.correctCount}/{record.total}
                </strong>
                <span>{formatDuration(record.durationSeconds)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="soft-text">完成一次练习后，这里会出现小记录。</p>
        )}
      </section>
    </main>
  );
}
