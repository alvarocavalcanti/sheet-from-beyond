import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import PluginGate from "./components/PluginGate";
import { analytics } from "./utils";

export const ID = "es.memorablenaton.sheet-from-beyond";

const container = document.getElementById("app");
const root = createRoot(container!);

const urlParams = new URLSearchParams(window.location.search);
const isFromOBR = urlParams.has("obrref");

// Track standalone homepage views
if (!isFromOBR) {
  analytics.page();
}

root.render(
  isFromOBR ? (
    <PluginGate>
      <App />
    </PluginGate>
  ) : (
    <iframe src="/README.html" title="README" id="readme" width="800" height="1200"></iframe>
  )
);
