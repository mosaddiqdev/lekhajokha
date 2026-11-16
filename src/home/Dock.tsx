import { paths } from "../app/route";
import { ClearIcon, PlusIcon, SearchIcon } from "../ui/icons";
import styles from "./Dock.module.css";

type Props = { query: string; onQuery: (query: string) => void };

// Sits at the bottom where the thumb rests: search first, add beside it.
export function Dock({ query, onQuery }: Props) {
  return (
    <div className={styles.dock}>
      <label className={styles.search}>
        <SearchIcon />
        <input
          className={styles.input}
          type="search"
          value={query}
          placeholder="Search name or number"
          aria-label="Search customers"
          enterKeyHint="search"
          onChange={(event) => onQuery(event.target.value)}
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onClick={() => onQuery("")}
          >
            <ClearIcon />
          </button>
        )}
      </label>
      <a className={styles.add} href={paths.newCustomer()} aria-label="Add customer">
        <PlusIcon />
      </a>
    </div>
  );
}
