import type { CSSProperties } from "react";

type AnswerEffectKind = "happy" | "thinking";

interface AnswerEffectProps {
  kind: AnswerEffectKind;
}

type EffectStyle = CSSProperties & Record<`--${string}`, string>;

const fireworkBursts = [
  { left: "12%", top: "18%", size: "1.05" },
  { left: "25%", top: "30%", size: "1.22" },
  { left: "34%", top: "13%", size: "1.18" },
  { left: "46%", top: "26%", size: "1.4" },
  { left: "56%", top: "14%", size: "1.28" },
  { left: "66%", top: "34%", size: "1.16" },
  { left: "75%", top: "18%", size: "1.3" },
  { left: "84%", top: "29%", size: "1.08" },
  { left: "18%", top: "46%", size: "1.12" },
  { left: "88%", top: "48%", size: "1.2" },
];

const sparkDirections = [
  ["0px", "-128px", "#ff5c8a"],
  ["74px", "-104px", "#ffbd2e"],
  ["122px", "-34px", "#52c7f8"],
  ["108px", "74px", "#7fd66b"],
  ["26px", "124px", "#f7833f"],
  ["-56px", "112px", "#b18cff"],
  ["-116px", "44px", "#ff7eb3"],
  ["-112px", "-58px", "#3dd6c6"],
  ["-40px", "-118px", "#ffd166"],
  ["42px", "42px", "#ff69d2"],
];

const leaves = [
  { left: "10%", top: "8vh", delay: "0s", duration: "1.7s", drift: "34px", rotate: "-44deg" },
  { left: "20%", top: "15vh", delay: "0.1s", duration: "2.1s", drift: "-40px", rotate: "28deg" },
  { left: "32%", top: "5vh", delay: "0.05s", duration: "1.9s", drift: "48px", rotate: "-20deg" },
  { left: "44%", top: "18vh", delay: "0.2s", duration: "2.25s", drift: "-30px", rotate: "42deg" },
  { left: "56%", top: "10vh", delay: "0.08s", duration: "1.85s", drift: "40px", rotate: "-36deg" },
  { left: "66%", top: "20vh", delay: "0.18s", duration: "2.15s", drift: "-46px", rotate: "24deg" },
  { left: "76%", top: "7vh", delay: "0s", duration: "1.95s", drift: "34px", rotate: "-18deg" },
  { left: "86%", top: "14vh", delay: "0.16s", duration: "2.2s", drift: "-38px", rotate: "34deg" },
  { left: "92%", top: "26vh", delay: "0.24s", duration: "2.3s", drift: "-52px", rotate: "-30deg" },
];

export function AnswerEffect({ kind }: AnswerEffectProps) {
  if (kind === "happy") {
    return (
      <div className="answer-effect answer-effect-fireworks" aria-hidden="true">
        {fireworkBursts.map((burst, burstIndex) => (
          <div
            className="firework-burst"
            key={`${burst.left}-${burst.top}`}
            style={
              {
                left: burst.left,
                top: burst.top,
                "--burst-size": burst.size,
                animationDelay: `${burstIndex * 0.12}s`,
              } as EffectStyle
            }
          >
            {sparkDirections.map(([x, y, color], sparkIndex) => (
              <span
                className="firework-spark"
                key={`${x}-${y}`}
                style={
                  {
                    "--spark-x": x,
                    "--spark-y": y,
                    "--spark-color": color,
                    animationDelay: `${burstIndex * 0.12 + sparkIndex * 0.018}s`,
                  } as EffectStyle
                }
              />
            ))}
          </div>
        ))}
        <span className="celebration-rabbit">🐰</span>
      </div>
    );
  }

  return (
    <div className="answer-effect answer-effect-leaves" aria-hidden="true">
      <div className="leaf-haze" />
      {leaves.map((leaf) => (
        <span
          className="falling-leaf"
          key={`${leaf.left}-${leaf.delay}`}
          style={
            {
              "--leaf-left": leaf.left,
              "--leaf-top": leaf.top,
              "--leaf-delay": leaf.delay,
              "--leaf-duration": leaf.duration,
              "--leaf-drift": leaf.drift,
              "--leaf-rotate": leaf.rotate,
            } as EffectStyle
          }
        />
      ))}
    </div>
  );
}
