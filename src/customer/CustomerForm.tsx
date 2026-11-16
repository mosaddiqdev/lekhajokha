import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useRef, useState } from "react";
import { paths } from "../app/route";
import { type CustomerBaki, listCustomerBaki } from "../data/customerBaki";
import { addCustomer, updateCustomer } from "../data/customers";
import { checkCustomer, formatPhone } from "../engine/customerInput";
import { sameName } from "../engine/customerList";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { TopBar } from "../ui/TopBar";
import styles from "./CustomerForm.module.css";
import { DeleteCustomer } from "./DeleteCustomer";

type Props = { existing?: CustomerBaki; prefill?: string };

export function CustomerForm({ existing, prefill }: Props) {
  const editing = existing !== undefined;
  const [name, setName] = useState(existing?.customer.name ?? prefill ?? "");
  const [phone, setPhone] = useState(
    existing?.customer.phone ? formatPhone(existing.customer.phone) : "",
  );
  const [problem, setProblem] = useState<{ field: "name" | "phone"; message: string }>();
  const nameInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);
  const others = useLiveQuery(listCustomerBaki);

  // Focus is set here, not with autoFocus, so a prefilled name isn't skipped.
  useEffect(() => {
    nameInput.current?.focus();
  }, []);

  const twin = others && sameName(others, name, existing?.customer.id);

  async function save() {
    const check = checkCustomer({ name, ...(phone.trim() ? { phone } : {}) });
    if (!check.ok) {
      setProblem({ field: check.field, message: check.message });
      (check.field === "name" ? nameInput : phoneInput).current?.focus();
      return;
    }
    if (existing) {
      await updateCustomer(existing.customer.id, check.value);
      history.back();
    } else {
      const created = await addCustomer(check.value);
      // Replace, so Back from the ledger goes home and not to this form.
      location.replace(paths.customer(created.id));
    }
  }

  const fieldError = (field: "name" | "phone") =>
    problem?.field === field ? problem.message : undefined;

  return (
    <form
      className={styles.screen}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <TopBar title={editing ? "Edit customer" : "New customer"} back={paths.home} />
      <div className={styles.fields}>
        <TextField
          ref={nameInput}
          label="Name"
          value={name}
          onChange={(value) => {
            setName(value);
            setProblem(undefined);
          }}
          error={fieldError("name")}
          hint={
            twin
              ? "You already have a customer with this name. Add a mobile number to tell them apart."
              : undefined
          }
          autoComplete="off"
          enterKeyHint="next"
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            phoneInput.current?.focus();
          }}
        />
        <TextField
          ref={phoneInput}
          label="Mobile number (optional)"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setProblem(undefined);
          }}
          error={fieldError("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="98765 43210"
          enterKeyHint="done"
        />
        {existing && <DeleteCustomer row={existing} />}
      </div>
      <div className={styles.actions}>
        <Button type="submit" tone="save" className={styles.save}>
          Save
        </Button>
      </div>
    </form>
  );
}
