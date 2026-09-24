import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import PluginGate from "./components/PluginGate";

/**
 * Dedicated entry point for the floating window (OBR.modal).
 * Renders the full app in modal mode, which skips context menu
 * registration so the action popover keeps owning the menus.
 */
const container = document.getElementById("app");
if (import.meta.env.MODE !== "test") {
  const root = createRoot(container!);
  root.render(
    <PluginGate>
      <App isModal />
    </PluginGate>
  );
}
