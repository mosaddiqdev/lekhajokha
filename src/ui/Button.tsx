import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

// save is the one brass button on a screen. udhaar and jama wear the money colours.
type Tone = "save" | "udhaar" | "jama" | "quiet";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone };

export function Button({ tone = "quiet", className, ...rest }: Props) {
  return (
    <button
      type="button"
      className={className ? `${styles.button} ${className}` : styles.button}
      data-tone={tone}
      {...rest}
    />
  );
}
