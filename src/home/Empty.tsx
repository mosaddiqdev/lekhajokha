import { paths } from "../app/route";
import { Button } from "../ui/Button";
import styles from "./Empty.module.css";

type Props = { query?: string };

// Two kinds of empty: a new shop with no customers, and a search with no match.
export function Empty({ query }: Props) {
  const name = query?.trim();

  return (
    <div className={styles.empty}>
      {name ? (
        <>
          <p className={styles.title}>No one called “{name}”</p>
          <Button onClick={() => location.assign(paths.newCustomer(name))}>
            Add “{name}” as a new customer
          </Button>
        </>
      ) : (
        <>
          <p className={styles.title}>Add your first customer</p>
          <p className={styles.text}>
            Then write down what they take, and Lekhajokha keeps the baki.
          </p>
          <Button tone="save" onClick={() => location.assign(paths.newCustomer())}>
            Add customer
          </Button>
        </>
      )}
    </div>
  );
}
