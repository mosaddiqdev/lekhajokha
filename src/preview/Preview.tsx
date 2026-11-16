import { useState } from "react";
import { Amount } from "../ui/Amount";
import { Button } from "../ui/Button";
import { EntrySheet } from "./EntrySheet";
import styles from "./Preview.module.css";

// Stand-in customers, only to judge how a list of amounts reads.
const SAMPLE = [
  { name: "Ramesh Das", last: "16 Nov", paise: 142000 },
  { name: "Sita Devi", last: "15 Nov", paise: 50000 },
  { name: "Gopal Kakati", last: "9 Nov", paise: 8550 },
  { name: "Anita Borah", last: "2 Nov", paise: -5000 },
  { name: "Hemen Saikia", last: "28 Oct", paise: 0 },
];

const SWATCHES = ["bg", "surface", "raised", "accent", "baki", "jama", "text"];

export function Preview() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.ledger}>
        <div>
          <h1 className={styles.name}>Ramesh Das</h1>
          <p className={styles.quiet}>98765 43210</p>
        </div>
        <div className={styles.baki}>
          <Amount paise={142000} size="hero" tone="baki" />
          <p className={styles.quiet}>Last entry 16 Nov</p>
        </div>
        <div className={styles.pair}>
          <Button tone="udhaar" onClick={() => setSheetOpen(true)}>
            Udhaar diya
          </Button>
          <Button tone="jama">Payment mila</Button>
        </div>
      </section>

      <section>
        <ul className={styles.list}>
          {SAMPLE.map((row) => (
            <li key={row.name} className={styles.row}>
              <div>
                <p className={styles.rowName}>{row.name}</p>
                <p className={styles.quiet}>Last entry {row.last}</p>
              </div>
              {row.paise === 0 ? (
                <span className={styles.quiet}>Settled</span>
              ) : (
                <Amount
                  paise={row.paise}
                  size="title"
                  tone={row.paise > 0 ? "baki" : "jama"}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.stack}>
        <Button tone="save">Save</Button>
        <Button>Add customer</Button>
      </section>

      <section className={styles.swatches}>
        {SWATCHES.map((token) => (
          <div key={token} className={styles.swatch}>
            <span className={styles.chip} style={{ background: `var(--${token})` }} />
            <span className={styles.quiet}>{token}</span>
          </div>
        ))}
      </section>

      <EntrySheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  );
}
