import { useState } from "react";
import { paths } from "../app/route";
import type { CustomerBaki } from "../data/customerBaki";
import { deleteCustomer } from "../data/customers";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import styles from "./DeleteCustomer.module.css";

// Deleting hides the customer but keeps their entries, so nothing is lost for good.
// It is only offered once the baki is cleared: a customer who still owes can't vanish.
export function DeleteCustomer({ row }: { row: CustomerBaki }) {
  const [asking, setAsking] = useState(false);
  const owes = row.baki !== 0;

  return (
    <div className={styles.block}>
      <Button className={styles.delete} disabled={owes} onClick={() => setAsking(true)}>
        Delete customer
      </Button>
      {owes && (
        <p className={styles.hint}>Clear the baki first. Add a jama for what is left.</p>
      )}

      <BottomSheet open={asking} onClose={() => setAsking(false)} label="Delete customer">
        <div className={styles.sheet}>
          <h2 className={styles.title}>Delete {row.customer.name}?</h2>
          <p className={styles.text}>They leave your list. Their entries are kept.</p>
          <div className={styles.buttons}>
            <Button onClick={() => setAsking(false)}>Cancel</Button>
            <Button
              tone="udhaar"
              onClick={async () => {
                await deleteCustomer(row.customer.id);
                location.replace(paths.home);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
