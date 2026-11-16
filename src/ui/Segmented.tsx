import styles from "./Segmented.module.css";

type Props<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      className={styles.track}
      role="radiogroup"
      aria-label={label}
      style={{ "--count": options.length, "--index": index } as React.CSSProperties}
    >
      {/* One thumb that slides, so a change reads as movement, not a swap. */}
      <span className={styles.thumb} aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={styles.option}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
