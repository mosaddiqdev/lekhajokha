import { formatRupees } from "../engine/rupees";
import styles from "./Amount.module.css";

type Props = {
  paise: number;
  size?: "hero" | "amount" | "title";
  // baki is red, jama is green, anything else is plain text.
  tone?: "baki" | "jama" | "neutral";
};

export function Amount({ paise, size = "amount", tone = "neutral" }: Props) {
  return (
    <span className={styles.amount} data-size={size} data-tone={tone}>
      {paise < 0 && <span className={styles.sign}>−</span>}
      <span className={styles.rupee}>₹</span>
      {formatRupees(Math.abs(paise))}
    </span>
  );
}
