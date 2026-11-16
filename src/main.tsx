import "@fontsource-variable/geist";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/tokens.css";
import "./styles/base.css";
import { followKeyboard } from "./ui/viewport";

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root");

followKeyboard();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
