import { type InputHTMLAttributes, type Ref, useId } from "react";
import styles from "./TextField.module.css";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  // Shown in red under the field. A hint is the quiet version, for help.
  error?: string;
  hint?: string;
  ref?: Ref<HTMLInputElement>;
};

export function TextField({ label, value, onChange, error, hint, ref, ...input }: Props) {
  const id = useId();
  const note = error ?? hint;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={styles.input}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? `${id}-note` : undefined}
        onChange={(event) => onChange(event.target.value)}
        {...input}
      />
      {note && (
        <p
          id={`${id}-note`}
          className={styles.note}
          data-error={error ? true : undefined}
        >
          {note}
        </p>
      )}
    </div>
  );
}
