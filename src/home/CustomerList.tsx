import type { CustomerBaki } from "../data/customerBaki";
import styles from "./CustomerList.module.css";
import { CustomerRow } from "./CustomerRow";

type Props = { rows: CustomerBaki[]; selectedId?: string };

export function CustomerList({ rows, selectedId }: Props) {
  return (
    <ul className={styles.list}>
      {rows.map((row) => (
        <li key={row.customer.id} className={styles.item}>
          <CustomerRow row={row} selected={row.customer.id === selectedId} />
        </li>
      ))}
    </ul>
  );
}
