import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";

import SceneNotReady from "./SceneNotReady";
import { setupContextMenu } from "../contextMenu";
import { ID } from "../main";
import { useLocalStorage } from "@uidotdev/usehooks";
import { analytics } from "../utils";
import CharacterSheetsList from "./CharacterSheetsList";
import ThemeSelector from "./ThemeSelector";
import { useTheme } from "../hooks/useTheme";
import { ColorMode } from "../themes";
import WhatsNew from "./WhatsNew";
import DonationButtons from "./DonationButtons";

interface AppProps {
  /**
   * True when rendered inside the floating window (OBR.modal via modal.html).
   * The modal must not register context menus, otherwise it steals ownership
   * from the action popover and "View Sheet" stops working once dismissed.
   */
  isModal?: boolean;
}

const App: React.FC<AppProps> = ({ isModal = false }) => {
  const [sceneReady, setSceneReady] = useState(false);
  const [displayMode, setDisplayMode] = useLocalStorage<"popup" | "panel" | "floating">(
    `${ID}/displayMode`,
    "floating" // Default to floating which is the most requested
  );
  
  // Migrate old inlineMode setting if it exists
  useEffect(() => {
    const oldInlineMode = localStorage.getItem(`${ID}/inlineMode`);
    if (oldInlineMode !== null) {
      setDisplayMode(oldInlineMode === "true" ? "panel" : "popup");
      localStorage.removeItem(`${ID}/inlineMode`);
    }
  }, [setDisplayMode]);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("characters");
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  const { themeId, changeTheme } = useTheme(colorMode);

  const setTheme = (theme: string): void => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      setColorMode('dark');
    } else {
      root.classList.remove('dark');
      setColorMode('light');
    }
  };

  const [version, setVersion] = useState("unknown");
  useEffect(() => {
    fetch("/manifest.json")
      .then((b) => b.json())
      .then((j) => j.version)
      .then(setVersion);
  }, []);

  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  useEffect(() => {
    analytics.page();
    let unsubscribeBroadcast: (() => void) | undefined;
    let unsubscribeTheme: (() => void) | undefined;
    OBR.onReady(() => {
      // The floating window (modal) must not register context menus:
      // OBR binds a menu to the iframe that registered it, so the modal
      // would steal ownership and the menus would die with it on dismissal.
      if (!isModal) {
        setupContextMenu();
      }

      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      unsubscribeTheme = OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });

      unsubscribeBroadcast = OBR.broadcast.onMessage(
        `${ID}/view-sheet`,
        (event) => {
          const { characterId } = event.data as { characterId: string; sheetURL: string };
          setActiveSheetId(characterId);
          setActiveTab("characters");
          analytics.track("view_sheet_from_context_menu");
        }
      );
    });
    return () => {
      unsubscribeBroadcast?.();
      unsubscribeTheme?.();
    };
  }, [isModal]);

  // The floating window is opened via OBR.modal, which mounts a fresh App.
  // The context menu writes the requested sheet here before opening the
  // modal, so the sheet shows deterministically (no broadcast race).
  useEffect(() => {
    if (!isModal) return;
    const pendingKey = `${ID}/pendingSheet`;
    try {
      const raw = localStorage.getItem(pendingKey);
      if (raw) {
        const { characterId } = JSON.parse(raw) as { characterId: string; sheetURL: string };
        setActiveSheetId(characterId);
        setActiveTab("characters");
        localStorage.removeItem(pendingKey);
      }
    } catch {
      // Ignore a malformed pending sheet; the Characters tab still works.
    }
  }, [isModal]);

  const handleOnChange = (newMode: "popup" | "panel" | "floating") => {
    analytics.track(`settings_change_${newMode}_mode`);
    setDisplayMode(newMode);
  };

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
      analytics.track(key === "characters" ? "tab_switch_characters" : "tab_switch_settings");
    }
  };

  return sceneReady ? (
    <div className="p-4 min-h-screen">
      {!isModal && (
        <WhatsNew currentVersion={version} storageKey="sheet-from-beyond-last-seen-version" />
      )}

      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sheet from Beyond</h1>

      {/* Tab Navigation */}
      <div className="mb-4">
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          <button
            onClick={() => handleTabSelect("characters")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "characters"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Characters
          </button>
          <button
            onClick={() => handleTabSelect("settings")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "settings"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Settings
          </button>
          <div className="ml-auto self-center text-gray-500 dark:text-gray-500 text-xs">
            v{version}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "characters" && (
        <CharacterSheetsList
          activeSheetId={activeSheetId}
          setActiveSheetId={setActiveSheetId}
        />
      )}

      {activeTab === "settings" && (
        <>
          <ThemeSelector currentTheme={themeId} onThemeChange={changeTheme} />

          <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Context Menu Behavior</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This setting controls what happens when you right-click a character
              on the map and select "View Sheet".
            </p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="displayMode"
                  value="floating"
                  checked={displayMode === "floating"}
                  onChange={() => handleOnChange("floating")}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-100">Floating Window <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded ml-1">New & Recommended</span></span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="displayMode"
                  value="panel"
                  checked={displayMode === "panel"}
                  onChange={() => handleOnChange("panel")}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-100">Extension Panel</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="displayMode"
                  value="popup"
                  checked={displayMode === "popup"}
                  onChange={() => handleOnChange("popup")}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-100">Browser Popup</span>
              </label>
            </div>
          </div>

          <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Floating Window & Extension Panel</h2>
            <p className="text-gray-700 dark:text-gray-300">
              In these modes the character sheet will be displayed inside Owlbear Rodeo. 
              The <strong>Floating Window</strong> stays open when you click the map, while the <strong>Extension Panel</strong> auto-closes. Note:
            </p>
            <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>
                They don't share your browser session cookies. You will need to login every time the sheet is displayed unless the sheet is public.
              </li>
              <li>
                For <strong>D&D Beyond</strong>, the best option is to mark the character
                sheet as public so it loads instantly without logging in.
              </li>
              <li>
                Some sites will block the page from being loaded, such as <strong>Google
                Drive</strong> and <strong>Dropbox</strong>.
              </li>
            </ul>
          </div>

          <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Browser Popup Window</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The character sheet opens in a new browser window. It has access to your current browser session (no need to login every time) and bypasses iframe blocking.
            </p>
          </div>

          <DonationButtons />
        </>
      )}
    </div>
  ) : (
    <SceneNotReady />
  );
};

export default App;
