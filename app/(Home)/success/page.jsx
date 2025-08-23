"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    animateConfetti(5);
  }, []);

  const animateConfetti = (dur = 2) => {
    const duration = +dur * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h1>🎉🎉تمت عملية الدفع بنجاح🎉🎉</h1>
    </div>
  );
}
