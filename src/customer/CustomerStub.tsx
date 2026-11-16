import { paths } from "../app/route";
import type { CustomerBaki } from "../data/customerBaki";
import { Amount } from "../ui/Amount";
import { TopBar } from "../ui/TopBar";
import styles from "./CustomerStub.module.css";

// Stands in until Step 5 builds the real ledger, so Edit has somewhere to start.
export function CustomerStub({ row }: { row: CustomerBaki }) {
  return (
    <div className={styles.screen}>
      <TopBar
        title={row.customer.name}
        back={paths.home}
        action={
          <a className={styles.edit} href={paths.edit(row.customer.id)}>
            Edit
          </a>
        }
      />
      <div className={styles.body}>
        <p className={styles.caption}>Baki</p>
        <Amount paise={row.baki} size="hero" tone={row.baki > 0 ? "baki" : "neutral"} />
        <p className={styles.caption}>The ledger arrives in Step 5.</p>
      </div>
    </div>
  );
}
