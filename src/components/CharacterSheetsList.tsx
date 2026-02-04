import OBR, { Item } from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
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
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          No character sheets added yet
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          Right-click on a character token and select <strong>"Add Sheet"</strong> to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className={`flex justify-between items-center px-4 py-3 cursor-pointer border-b border-gray-300 dark:border-gray-600 last:border-b-0 ${
              activeSheetId === sheet.id
                ? "bg-blue-100 dark:bg-blue-900/40"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveSheetId(sheet.id);
              analytics.track("select_character_inline");
            }}
          >
            <span className="text-gray-900 dark:text-white">{sheet.name}</span>
            <button
              onClick={(e) => handleOpenInPopup(sheet.url, e)}
              title="Open in popup window"
              className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
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
            </button>
          </div>
        ))}
      </div>

      {activeSheetId ? (
        (() => {
          const selectedSheet = sheets.find((s) => s.id === activeSheetId);
          return selectedSheet ? (
            <div>
              <iframe
                src={selectedSheet.url}
                width="100%"
                height="600px"
                className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                title={`${selectedSheet.name} Character Sheet`}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          ) : null;
        })()
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">
            Click a character name to view their sheet inline, or click the external link icon to open in a popup window.
          </p>
        </div>
      )}
    </>
  );
};

export default CharacterSheetsList;
