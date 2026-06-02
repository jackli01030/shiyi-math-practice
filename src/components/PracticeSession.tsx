import { useMemo, useState } from "react";
import { AnswerEffect } from "./AnswerEffect";
import { PinyinText } from "./PinyinText";
import { QuestionVisual } from "./QuestionVisual";
import { formatDuration, getResultMessage } from "../utils/practice";
import { markWrongQuestionMastered, savePracticeRecord, saveWrongQuestion } from "../utils/storage";
import type { MathQuestion, PracticeMode, QuestionType } from "../types/question";

interface PracticeSessionProps {
  title: string;
  questions: MathQuestion[];
  mode: PracticeMode;
  category?: QuestionType;
  onExit: () => void;
  onFinished?: () => void;
  exitLabel?: string;
}

interface PracticeResult {
  correctCount: number;
  durationSeconds: number;
}

const correctMessages = ["答对啦，继续保持！", "很好，这一步想清楚了！", "漂亮，再来一题！"];

export function PracticeSession({
  title,
  questions,
  mode,
  category,
  onExit,
  onFinished,
  exitLabel = "回首页",
}: PracticeSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "happy" | "thinking"; text: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [startedAt] = useState(() => Date.now());

  const currentQuestion = questions[currentIndex];
  const progressText = `${Math.min(currentIndex + 1, questions.length)} / ${questions.length}`;

  const correctMessage = useMemo(
    () => correctMessages[currentIndex % correctMessages.length],
    [currentIndex],
  );

  if (questions.length === 0) {
    return (
      <main className="page narrow-page">
        <section className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            ☆
          </div>
          <h1>这里暂时没有题目</h1>
          <p>先回首页看看别的练习吧。</p>
          <button className="primary-button" type="button" onClick={onExit}>
            {exitLabel}
          </button>
        </section>
      </main>
    );
  }

  if (result) {
    return (
      <main className="page narrow-page">
        <section className="result-panel">
          <div className="result-badge" aria-hidden="true">
            ★
          </div>
          <p className="eyebrow">完成啦</p>
          <h1>{getResultMessage(result.correctCount, questions.length)}</h1>
          <div className="result-grid">
            <div>
              <span>答对</span>
              <strong>
                {result.correctCount} / {questions.length}
              </strong>
            </div>
            <div>
              <span>用时</span>
              <strong>{formatDuration(result.durationSeconds)}</strong>
            </div>
          </div>
          <div className="result-actions">
            <button className="secondary-button" type="button" onClick={onExit}>
              {exitLabel}
            </button>
            {onFinished ? (
              <button className="primary-button" type="button" onClick={onFinished}>
                看看错题
              </button>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  function handleOptionClick(option: string) {
    if (!currentQuestion || isAnswered) {
      return;
    }

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setCorrectCount((value) => value + 1);

      if (mode === "mistake") {
        markWrongQuestionMastered(currentQuestion.id);
      }

      setFeedback({ kind: "happy", text: correctMessage });
      return;
    }

    saveWrongQuestion(currentQuestion.id);

    setFeedback({
      kind: "thinking",
      text: `我们再想一想。正确答案是 ${currentQuestion.answer}。${currentQuestion.explanation}`,
    });
  }

  function finishPractice() {
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

    savePracticeRecord({
      mode,
      category,
      total: questions.length,
      correctCount,
      durationSeconds,
    });

    setResult({ correctCount, durationSeconds });
  }

  function goNext() {
    if (currentIndex === questions.length - 1) {
      finishPractice();
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
    setFeedback(null);
    setIsAnswered(false);
  }

  return (
    <main className="page narrow-page">
      {feedback ? <AnswerEffect kind={feedback.kind} key={`${currentQuestion.id}-${selectedOption}`} /> : null}
      <section className="practice-head">
        <button className="small-button" type="button" onClick={onExit}>
          {exitLabel}
        </button>
        <div>
          <p className="eyebrow">{title}</p>
          <h1>{currentQuestion.type}</h1>
        </div>
        <span className="progress-pill">{progressText}</span>
      </section>

      <section className="question-panel">
        {currentQuestion.visual ? <QuestionVisual visual={currentQuestion.visual} /> : null}
        <p className="question-text">
          <PinyinText text={currentQuestion.question} />
        </p>
        <div className="option-grid">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.answer;
            const buttonClass = [
              "option-button",
              isSelected && !isCorrect ? "is-thinking" : "",
              isAnswered && isCorrect ? "is-correct" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                className={buttonClass}
                disabled={isAnswered}
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
              >
                <PinyinText text={option} />
              </button>
            );
          })}
        </div>

        {feedback ? (
          <div className={`feedback feedback-${feedback.kind}`}>
            <span aria-hidden="true">{feedback.kind === "happy" ? "✓" : "?"}</span>
            <p>
              <PinyinText text={feedback.text} />
            </p>
          </div>
        ) : null}

        {isAnswered ? (
          <button className="primary-button next-button" type="button" onClick={goNext}>
            {currentIndex === questions.length - 1 ? "完成练习" : "下一题"}
          </button>
        ) : null}
      </section>
    </main>
  );
}
