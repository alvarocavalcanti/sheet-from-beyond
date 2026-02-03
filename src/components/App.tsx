import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";

import SceneNotReady from "./SceneNotReady";
import { Badge, Card, Form, Nav, Tab } from "react-bootstrap";
import { setupContextMenu } from "../contextMenu";
import { ID } from "../main";
import { useLocalStorage } from "@uidotdev/usehooks";
import { analytics } from "../utils";
import CharacterSheetsList from "./CharacterSheetsList";

const setTheme = (theme: string): void => {
  document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
};

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  const [isInlineMode, setIsInlineMode] = useLocalStorage(
    `${ID}/inlineMode`,
    false
  );
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("characters");

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
    <div className="p-2">
      <h1 className="mb-3">Sheet from Beyond</h1>

      <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="characters">Characters</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="settings">Settings</Nav.Link>
          </Nav.Item>
          <div className="ms-auto text-secondary small align-self-center">v{version}</div>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="characters">
            <CharacterSheetsList
              activeSheetId={activeSheetId}
              setActiveSheetId={setActiveSheetId}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="settings">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Context Menu Behavior</Card.Title>
                <Card.Text className="mb-3">
                  This setting controls what happens when you right-click a character
                  on the map and select "View Sheet". Within the extension panel,
                  you always have both options: click a name to view inline, or click
                  the external link icon to open in a popup.
                </Card.Text>
                <Form.Check
                  type="radio"
                  id="popupMode"
                  name="displayMode"
                  value="popup"
                  checked={!isInlineMode}
                  onChange={() => handleOnChange(false)}
                  label="Popup Window"
                  inline
                />
                <Form.Check
                  type="radio"
                  id="inlineMode"
                  name="displayMode"
                  value="inline"
                  checked={isInlineMode}
                  onChange={() => handleOnChange(true)}
                  label="Open Extension Panel"
                  inline
                />
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>
                  Popup Window <Badge bg="secondary">Recommended</Badge>
                </Card.Title>
                <Card.Text>
                  In this mode the character sheet will be displayed in a new browser
                  window. Even though this is less user-friendly, the new window will
                  have access to the current browser session, which means that you
                  won't need to login every time, and also won't have issues with
                  sites blocking the page from being loaded.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Inline Display</Card.Title>
                <Card.Text>
                  In this mode the character sheet will be displayed inside the
                  extension panel as an expandable section. Even though the usability
                  is better, it has the following limitations:
                  <ul className="mt-3">
                    <li className="mb-2">
                      It won't have access to the current browser session. Therefore,
                      you will need to accept cookies, login, etc, every time the
                      sheet is displayed
                    </li>
                    <li className="mb-2">
                      For <strong>D&D Beyond</strong>, the best option is to mark the character
                      sheet as public and it should load without needing to login
                    </li>
                    <li className="mb-2">
                      Some sites will block the page from being loaded, such as <strong>Google
                      Drive</strong> and <strong>Dropbox</strong>
                    </li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>

            <div className="p-3 text-center">
              <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank" rel="noreferrer">
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                  alt="Buy Me A Coffee"
                  style={{ height: "60px", width: "217px" }}
                />
              </a>
            </div>
            <div className="p-3 text-center">
              <a href="https://ko-fi.com/O4O1WSP5B" target="_blank" rel="noreferrer">
                <img
                  height="36"
                  style={{ border: 0, height: "36px" }}
                  src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
                  alt="Buy Me a Coffee at ko-fi.com"
                />
              </a>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  ) : (
    <SceneNotReady />
  );
};

export default App;
