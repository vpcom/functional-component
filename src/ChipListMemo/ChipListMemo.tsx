/**
 * STATE-OF-THE-ART FUNCTIONAL COMPONENT
 * Demonstrates:
 * - All core hooks (useState, useEffect, useCallback, useMemo, useRef)
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
} from "react";
import styles from "./ChipListMemo.module.css";

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

let renderCount = 0;

// Higher Order Component that wraps a functional component to memoize its render output
// It prevents the component from re-rendering if its props haven't changed or just shallowly changed
const ChipListMemo = React.memo(function ChipListMemo({
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

  const mountCount = useRef(0);

  // useEffect — Side effects (logging, sync with parent)
  useEffect(() => {
    renderCount++;
    console.log(
      `%c[ChipListMemo rendered #${renderCount}]`,
      "color: #1eff31ff"
    );
  });


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
      `%c[ChipListMemo mounted #${mountCount.current}] took ${diff}ms since last render`,
      "color: #1E90FF"
    );
    lastRenderTime.current = now;
  }, []);

  // Defensive: handle empty or invalid props
  if (!Array.isArray(chips) || chips.length === 0) {
    return (
      <section className={`${styles.chipList} light`}>
        <div className={styles.empty}>No chips available</div>
      </section>
    );
  }

  // Compute hidden chips count
  const exceeding = Math.max(chips.length - (maxChips ?? chips.length), 0);

  return (
    <section className={`${styles.chipList} light`}>
      {visibleChips.map((label, index) => (
        <div
          key={index}
          data-testid={`chip-${index}`}
          className={styles.chip}
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

export default ChipListMemo;