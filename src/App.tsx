import React, { useState, useEffect } from "react";
import ChipList from "./ChipList/ChipList";
import './App.css';

const sample = [
  { label: "ReactJS" },
  { label: "TypeScript" },
  { label: "PerformanceOptimization" },
  { label: "Memoization" },
  { label: "HooksMastery" },
];

export default function App() {
  const [counter, setCounter] = useState(0);

  // Force parent re-render every 3s (simulate live updates or context changes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((c) => c + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>Parent re-renders: {counter}</h2>

      <ChipList chips={sample} maxChips={3} maxTextLength={10} />
    </div>
  );
}