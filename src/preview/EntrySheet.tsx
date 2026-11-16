import { useState } from "react";
import { parseAmount } from "../engine/amount";
import { typeKey } from "../engine/keys";
import { Amount } from "../ui/Amount";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { Keypad, type PadKey } from "../ui/Keypad";
import styles from "./EntrySheet.module.css";

// A rough sketch of the Add entry screen (Step 6) built from the real pieces, so
// the keypad and the live total can be judged by hand before the real one exists.
export function EntrySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");

  // "2×" or "5." is still being typed: show the total of what is complete.
  const total = parseAmount(text.replace(/[×+.]+$/, ""));
  const paise = total.ok ? total.paise : 0;

  const press = (key: PadKey) => {
    // The Add line key arrives with Step 6.
    if (key !== "line") setText((current) => typeKey(current, key));
  };

  return (
    <BottomSheet open={open} onClose={onClose} label="Add udhaar">
      <div className={styles.head}>
        <span className={styles.name}>Ramesh Das</span>
        <span className={styles.kind}>Udhaar diya</span>
      </div>
      <div className={styles.total}>
        <Amount paise={paise} size="hero" tone="baki" />
        <span className={styles.typed}>{text || "Type an amount"}</span>
      </div>
      <Keypad onKey={press} />
      <Button
        tone="save"
        className={styles.save}
        disabled={paise === 0}
        onClick={() => {
          setText("");
          onClose();
        }}
      >
        Save
      </Button>
    </BottomSheet>
  );
}
