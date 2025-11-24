import OBR, { Item } from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { Alert, Button, ListGroup } from "react-bootstrap";
import { ID } from "../main";
import { analytics } from "../utils";

interface CharacterSheet {
  id: string;
  name: string;
  url: string;
}

interface CharacterSheetsListProps {
  activeSheetId: string | null;
  setActiveSheetId: (id: string | null) => void;
}

const getItemName = (item: Item): string => {
  // CHARACTER items have a name property directly
  return item.name || "Unknown Character";
};

const CharacterSheetsList: React.FC<CharacterSheetsListProps> = ({
  activeSheetId,
  setActiveSheetId,
}) => {
  const [sheets, setSheets] = useState<CharacterSheet[]>([]);

  const loadSheets = (items: Item[]) => {
    const characterSheets: CharacterSheet[] = items
      .filter((item) => {
        return (
          item.layer === "CHARACTER" &&
          item.metadata[`${ID}/metadata`] !== undefined
        );
      })
      .map((item) => {
        const metadata = item.metadata[`${ID}/metadata`] as { characterSheetURL: string };
        return {
          id: item.id,
          name: getItemName(item),
          url: metadata.characterSheetURL,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setSheets(characterSheets);
  };

  useEffect(() => {
    OBR.scene.items
      .getItems((item) => item.layer === "CHARACTER")
      .then((items) => loadSheets(items));

    const unsubscribe = OBR.scene.items.onChange((items) => {
      loadSheets(items.filter((item) => item.layer === "CHARACTER"));
    });

    return unsubscribe;
  }, []);

  const handleOpenInPopup = (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    analytics.track("select_character_popup");


    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const screenHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const windowWidth = 400;
    const windowHeight = 800;
    const left = Math.max(0, (screenWidth - windowWidth) / 2);
    const top = Math.max(0, (screenHeight - windowHeight) / 2);
    window.open(
      url,
      "_blank",
      `left=${left},top=${top},width=${windowWidth},height=${windowHeight}`
    );
  };

  if (sheets.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No character sheets added yet</Alert.Heading>
        <p>
          Right-click on a character token and select <strong>"Add Sheet"</strong> to get started.
        </p>
      </Alert>
    );
  }

  return (
    <>
      <ListGroup className="mb-3">
        {sheets.map((sheet) => (
          <ListGroup.Item
            key={sheet.id}
            action
            active={activeSheetId === sheet.id}
            onClick={() => {
              setActiveSheetId(sheet.id);
              analytics.track("select_character_inline");
            }}
            className="d-flex justify-content-between align-items-center py-2"
          >
            <span>{sheet.name}</span>
            <Button
              variant="link"
              size="sm"
              onClick={(e) => handleOpenInPopup(sheet.url, e)}
              title="Open in popup window"
              className="p-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                />
                <path
                  fillRule="evenodd"
                  d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                />
              </svg>
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {activeSheetId ? (
        (() => {
          const selectedSheet = sheets.find((s) => s.id === activeSheetId);
          return selectedSheet ? (
            <div className="iframe-container">
              <iframe
                src={selectedSheet.url}
                width="100%"
                height="600px"
                style={{ border: "1px solid #dee2e6", borderRadius: "4px" }}
                title={`${selectedSheet.name} Character Sheet`}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          ) : null;
        })()
      ) : (
        <Alert variant="info" className="text-center">
          Click a character name to view their sheet inline, or click the external link icon to open in a popup window.
        </Alert>
      )}
    </>
  );
};

export default CharacterSheetsList;
