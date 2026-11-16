import { paths } from "../app/route";
import type { CustomerBaki } from "../data/customerBaki";
import { describeDay, today } from "../engine/days";
import { Amount } from "../ui/Amount";
import styles from "./CustomerRow.module.css";

type Props = { row: CustomerBaki; selected: boolean };

export function CustomerRow({ row, selected }: Props) {
  const { customer, baki, lastEntryDate } = row;

  return (
    <a
      className={styles.row}
      href={paths.customer(customer.id)}
      aria-current={selected ? "page" : undefined}
    >
      <span className={styles.who}>
        <span className={styles.name}>{customer.name}</span>
        <span className={styles.caption}>
          {lastEntryDate
            ? `Last entry ${describeDay(lastEntryDate, today())}`
            : "No entries yet"}
        </span>
      </span>
      <span className={styles.money}>
        {baki === 0 ? (
          <span className={styles.settled}>Settled</span>
        ) : baki > 0 ? (
          <Amount paise={baki} size="title" tone="baki" />
        ) : (
          <>
            <Amount paise={-baki} size="title" tone="jama" />
            <span className={styles.caption}>Advance</span>
          </>
        )}
      </span>
    </a>
  );
}
