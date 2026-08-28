import React, { useState } from "react";
import { Heart, Check, X, RotateCcw } from "lucide-react";

const QUESTIONS = [
  { prompt: "casa", options: ["house", "cat", "road", "bread"], answer: "house" },
  { prompt: "el perro", options: ["the cat", "the dog", "the bird", "the fish"], answer: "the dog" },
  { prompt: "comer", options: ["to sleep", "to run", "to eat", "to sing"], answer: "to eat" },
  { prompt: "agua", options: ["fire", "water", "earth", "air"], answer: "water" },
  { prompt: "buenos días", options: ["good night", "good afternoon", "good morning", "goodbye"], answer: "good morning" },
  { prompt: "el libro", options: ["the pen", "the book", "the table", "the door"], answer: "the book" },
];

const MAX_LIVES = 3;

export default function LessonApp() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | correct | wrong
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  const q = QUESTIONS[index];
  const progress = Math.round((index / QUESTIONS.length) * 100);

  function choose(opt) {
    if (status !== "idle") return;
    setSelected(opt);
    if (opt === q.answer) {
      setStatus("correct");
      setScore((s) => s + 1);
    } else {
      setStatus("wrong");
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setFailed(true);
        return next;
      });
    }
  }

  function next() {
    if (failed) return;
    if (index + 1 >= QUESTIONS.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setStatus("idle");
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setStatus("idle");
    setScore(0);
    setLives(MAX_LIVES);
    setDone(false);
    setFailed(false);
  }

  const ink = "#16302E";
  const teal = "#1B4B4A";
  const cream = "#FBF6EC";
  const mustard = "#E8A33D";
  const coral = "#E0574B";
  const green = "#4C9A6A";

  if (done || failed) {
    return (
      <div style={{ background: teal, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex items-center justify-center p-6">
        <div style={{ background: cream, borderRadius: 24 }} className="w-full max-w-sm p-8 text-center shadow-xl">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: failed ? coral : mustard,
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {failed ? <X color="white" size={36} /> : <Check color="white" size={36} />}
          </div>
          <h1 style={{ color: ink, fontWeight: 800 }} className="text-2xl mb-1">
            {failed ? "Out of hearts" : "Lesson complete"}
          </h1>
          <p style={{ color: teal }} className="mb-6 opacity-80">
            {failed
              ? `You got ${score} of ${QUESTIONS.length} before running out.`
              : `You scored ${score} out of ${QUESTIONS.length}.`}
          </p>
          <button
            onClick={restart}
            style={{ background: teal, color: cream }}
            className="w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RotateCcw size={18} /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: teal, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex flex-col items-center p-5">
      <div className="w-full max-w-sm">
        {/* Top bar: progress + lives */}
        <div className="flex items-center gap-3 mt-2 mb-8">
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 999, height: 10 }} className="flex-1 overflow-hidden">
            <div
              style={{
                width: `${progress}%`,
                background: mustard,
                height: "100%",
                borderRadius: 999,
                transition: "width 300ms ease",
              }}
            />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                fill={i < lives ? coral : "none"}
                color={i < lives ? coral : "rgba(255,255,255,0.3)"}
              />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div style={{ background: cream, borderRadius: 24 }} className="p-6 shadow-xl">
          <p style={{ color: teal, letterSpacing: 1 }} className="text-xs font-bold uppercase mb-2 opacity-70">
            Translate this word
          </p>
          <h1 style={{ color: ink }} className="text-3xl font-extrabold mb-6">
            {q.prompt}
          </h1>

          <div className="flex flex-col gap-3">
            {q.options.map((opt) => {
              const isSelected = selected === opt;
              const isAnswer = opt === q.answer;
              let bg = "white";
              let border = "#E5DFD2";
              let textColor = ink;

              if (status !== "idle") {
                if (isAnswer) {
                  bg = "#E6F2EA";
                  border = green;
                  textColor = green;
                } else if (isSelected) {
                  bg = "#FBEAE8";
                  border = coral;
                  textColor = coral;
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  disabled={status !== "idle"}
                  style={{
                    background: bg,
                    border: `2px solid ${border}`,
                    color: textColor,
                    borderRadius: 14,
                  }}
                  className="text-left px-4 py-3 font-semibold transition-colors active:scale-[0.98]"
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback bar */}
        {status !== "idle" && (
          <div
            style={{
              background: status === "correct" ? green : coral,
              borderRadius: 18,
            }}
            className="mt-4 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-white font-bold">
              {status === "correct" ? <Check size={20} /> : <X size={20} />}
              {status === "correct" ? "Nice!" : `Correct answer: ${q.answer}`}
            </div>
            <button
              onClick={next}
              style={{ background: "white", color: status === "correct" ? green : coral }}
              className="px-4 py-2 rounded-xl font-bold active:scale-95 transition-transform"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
