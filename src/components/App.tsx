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

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  const [isInlineMode, setIsInlineMode] = useLocalStorage(
    `${ID}/inlineMode`,
    false
  );
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
    OBR.onReady(() => {
      setupContextMenu();

      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });

      const unsubscribeBroadcast = OBR.broadcast.onMessage(
        `${ID}/view-sheet`,
        (event) => {
          const { characterId } = event.data as { characterId: string; sheetURL: string };
          setActiveSheetId(characterId);
          setActiveTab("characters");
          analytics.track("view_sheet_from_context_menu");
        }
      );

      return () => {
        unsubscribeBroadcast();
      };
    });
  });

  const handleOnChange = (inlineMode: boolean) => {
    console.log(`Setting inline mode to ${inlineMode}`);
    analytics.track(inlineMode ? "settings_change_inline_mode" : "settings_change_popup_mode");
    setIsInlineMode(inlineMode);
  };

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
      analytics.track(key === "characters" ? "tab_switch_characters" : "tab_switch_settings");
    }
  };

  return sceneReady ? (
    <div className="p-4 min-h-screen">
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
              on the map and select "View Sheet". Within the extension panel,
              you always have both options: click a name to view inline, or click
              the external link icon to open in a popup.
            </p>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="displayMode"
                  value="popup"
                  checked={!isInlineMode}
                  onChange={() => handleOnChange(false)}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-100">Popup Window</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="displayMode"
                  value="inline"
                  checked={isInlineMode}
                  onChange={() => handleOnChange(true)}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-100">Open Extension Panel</span>
              </label>
            </div>
          </div>

          <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Popup Window{" "}
              <span className="text-xs bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                Recommended
              </span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              In this mode the character sheet will be displayed in a new browser
              window. Even though this is less user-friendly, the new window will
              have access to the current browser session, which means that you
              won't need to login every time, and also won't have issues with
              sites blocking the page from being loaded.
            </p>
          </div>

          <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Inline Display</h2>
            <p className="text-gray-700 dark:text-gray-300">
              In this mode the character sheet will be displayed inside the
              extension panel as an expandable section. Even though the usability
              is better, it has the following limitations:
            </p>
            <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>
                It won't have access to the current browser session. Therefore,
                you will need to accept cookies, login, etc, every time the
                sheet is displayed
              </li>
              <li>
                For <strong>D&D Beyond</strong>, the best option is to mark the character
                sheet as public and it should load without needing to login
              </li>
              <li>
                Some sites will block the page from being loaded, such as <strong>Google
                Drive</strong> and <strong>Dropbox</strong>
              </li>
            </ul>
          </div>

          <div className="p-3 text-center">
            <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank" rel="noreferrer">
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                className="h-[60px] w-[217px] inline-block"
              />
            </a>
          </div>
          <div className="p-3 text-center">
            <a href="https://ko-fi.com/O4O1WSP5B" target="_blank" rel="noreferrer">
              <img
                height="36"
                className="h-9 inline-block"
                src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </div>
        </>
      )}
    </div>
  ) : (
    <SceneNotReady />
  );
};

export default App;
