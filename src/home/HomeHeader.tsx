import { Amount } from "../ui/Amount";
import styles from "./HomeHeader.module.css";

type Props = { owed: number; owingCount: number };

export function HomeHeader({ owed, owingCount }: Props) {
  return (
    <header className={styles.header}>
      <p className={styles.caption}>Total baki</p>
      <Amount paise={owed} size="hero" tone={owed > 0 ? "baki" : "neutral"} />
      <p className={styles.caption}>
        {owingCount === 0
          ? "Nobody owes you"
          : `from ${owingCount} ${owingCount === 1 ? "customer" : "customers"}`}
      </p>
    </header>
  );
}
