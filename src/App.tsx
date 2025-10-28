import React, { useState, useEffect } from "react";
import ChipList from "./ChipList/ChipList";
import './App.scss';
import ChipListMemo from "./ChipListMemo/ChipListMemo";
import ChipListCusto from "./ChipListCusto/ChipListCusto";

const initialSample = [
  { label: "ReactJS" },
  { label: "TypeScript" },
  { label: "PerformanceOptimization" },
  { label: "Memoization" },
  { label: "HooksMastery" },
];

export default function App() {
  const [counter, setCounter] = useState(0);
  const [chips, setChips] = useState(initialSample);
  const [inputValue, setInputValue] = useState('');

  // Force parent re-render every 3s (simulate live updates or context changes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((c) => c + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleAddChip = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !chips.some(chip => chip.label === trimmed)) {
      setChips([...chips, { label: trimmed }]);
      setInputValue('');
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Parent re-renders: {counter}</h2>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a new chip label"
          className="chip-input"
        />
        <button onClick={handleAddChip}>Add Chip</button>
      </div>
      <h2>Children components: </h2>
      <ChipList chips={chips} maxChips={3} maxTextLength={10} />
      <ChipListMemo chips={chips} maxChips={3} maxTextLength={10} />
      <ChipListCusto chips={chips} maxChips={3} maxTextLength={10} theme="dark" />
    </div>
  );
}