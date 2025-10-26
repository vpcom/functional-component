/**
 * STATE-OF-THE-ART FUNCTIONAL COMPONENT
 * Demonstrates:
 * - All core hooks (useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef)
 * - Clean structure
 * - Defensive programming (edge cases)
 * - Efficient re-render control
 * - Production-ready readability
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  // useReducer,
  useContext,
} from "react";
import "./ChipList.css";

const ELLIPSIS = "\u2026";

// Strict type definitions
type Chip = {
  label: string;
};

type ChipListProps = {
  chips: Chip[];
  maxChips?: number;
  maxTextLength?: number;
};

// Example context to show useContext usage (global theme or settings)
const ThemeContext = React.createContext("light");

// Higher Order Component that wraps a functional component to memoize its render output
// It prevents the component from re-rendering if its props haven't changed or just shallowly changed
const ChipList = React.memo(function ChipList({
  chips = [],
  maxChips,
  maxTextLength,
}: ChipListProps) {
  // useState — Local UI state
  const [visibleCount, setVisibleCount] = useState<number>(() => {
    return Math.min(chips.length, maxChips ?? chips.length);
  });

  // useMemo — Derive computed values efficiently
  const visibleChips = useMemo(() => {
    if (!chips?.length) return [];
    const sliced = maxChips ? chips.slice(0, maxChips) : chips;
    return sliced.map((chip) => {
      if (!maxTextLength || chip.label.length <= maxTextLength)
        return chip.label;
      return chip.label.slice(0, maxTextLength) + ELLIPSIS;
    });
  }, [chips, maxChips, maxTextLength]);

  // TBC useReducer — Optional example for state transitions (analytics, debug)
  // const [renderCount, incrementRenderCount] = useReducer((x) => x + 1, 0);
  const renderCount = useRef(0);

  // useCallback — Stable handler for any events (no re-creation)
  const refreshVisible = useCallback(() => {
    setVisibleCount(Math.min(chips.length, maxChips ?? chips.length));
  }, [chips.length, maxChips]);

  // useRef — Hold mutable, non-render-affecting values (e.g., render log)
  const lastRenderTime = useRef(Date.now());

  // useEffect — Side effects (logging, sync with parent)
  useEffect(() => {
    const now = Date.now();
    const diff = now - lastRenderTime.current;
    console.log(
      `%c[ChipList render #${renderCount}] took ${diff}ms since last render`,
      "color: #1E90FF"
    );
    lastRenderTime.current = now;
    //incrementRenderCount(); TBC
  }, []);

  // useContext — Access global context (theme, locale, etc.)
  const theme = useContext(ThemeContext);

  // Defensive: handle empty or invalid props
  if (!Array.isArray(chips) || chips.length === 0) {
    return (
      <section className={`chip-list ${theme}`}>
        <div className="empty">No chips available</div>
      </section>
    );
  }

  // Compute hidden chips count
  const exceeding = Math.max(chips.length - (maxChips ?? chips.length), 0);

  return (
    <section className={`chip-list ${theme}`}>
      {visibleChips.map((label, index) => (
        <div
          key={index}
          data-testid={`chip-${index}`}
          className="chip"
        >
          {label}
        </div>
      ))}

      {exceeding > 0 && (
        <aside data-testid="exceeding-text">{exceeding} more items</aside>
      )}
    </section>
  );
});

export default ChipList;