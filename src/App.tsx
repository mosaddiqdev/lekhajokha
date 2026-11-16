import styles from "./App.module.css";
import { useRoute } from "./app/useRoute";
import { CustomerScreen } from "./customer/CustomerScreen";
import { Home } from "./home/Home";
import { useWide } from "./ui/viewport";

export function App() {
  const route = useRoute();
  const wide = useWide();
  const selectedId = route.name === "home" || route.name === "new" ? undefined : route.id;

  if (!wide) {
    return route.name === "home" ? <Home /> : <CustomerScreen route={route} />;
  }

  // On a laptop the list stays put and the open screen fills the right side.
  return (
    <div className={styles.split}>
      <aside className={styles.list}>
        <Home selectedId={selectedId} />
      </aside>
      <main className={styles.detail}>
        {route.name === "home" ? (
          <p className={styles.pick}>Pick a customer, or add a new one.</p>
        ) : (
          <CustomerScreen route={route} />
        )}
      </main>
    </div>
  );
}
