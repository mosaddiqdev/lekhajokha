import type { ReactNode } from "react";
import { ChevronLeftIcon } from "./icons";
import styles from "./TopBar.module.css";

type Props = { title: string; back: string; action?: ReactNode };

export function TopBar({ title, back, action }: Props) {
  return (
    <header className={styles.bar}>
      <a className={styles.back} href={back} aria-label="Back">
        <ChevronLeftIcon />
      </a>
      <h1 className={styles.title}>{title}</h1>
      {action}
    </header>
  );
}
