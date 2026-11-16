import type { Key } from "../engine/keys";
import styles from "./Keypad.module.css";

// "line" starts the next line of an entry. It is the pad's own key, not text.
export type PadKey = Key | "line";

const KEYS: PadKey[] = [
  "7",
  "8",
  "9",
  "back",
  "4",
  "5",
  "6",
  "×",
  "1",
  "2",
  "3",
  "+",
  ".",
  "0",
  "00",
  "line",
];

const LABELS: Partial<Record<PadKey, string>> = {
  back: "Delete",
  "×": "Multiply",
  "+": "Plus",
  ".": "Point",
  line: "Add line",
};

export function Keypad({ onKey }: { onKey: (key: PadKey) => void }) {
  return (
    <div className={styles.pad}>
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className={styles.key}
          data-kind={/^[0-9.]+$/.test(key) ? "digit" : "function"}
          aria-label={LABELS[key]}
          onClick={() => onKey(key)}
        >
          {key === "back" ? <BackspaceIcon /> : key === "line" ? "Add line" : key}
        </button>
      ))}
    </div>
  );
}

// Thin line to match the type weight. Heavy icons make the pad look like a toy.
function BackspaceIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5h10a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H9l-5.5-7L9 5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m11.5 9.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
