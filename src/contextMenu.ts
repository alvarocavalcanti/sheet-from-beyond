import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";
import { analytics } from "./utils";


export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu-add-remove`,
    icons: [
      {
        icon: "/img/add.svg",
        label: "Add Sheet",
        filter: {
          roles: ["GM"],
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove.svg",
        label: "Remove Sheet",
        filter: {
          roles: ["GM"],
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const add = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (add) {
        const characterSheetURL = window.prompt(
          "Enter the character's sheet URL:"
        );
        if (!characterSheetURL) {
          return;
        }

        try {
          new URL(characterSheetURL);
          analytics.track("add_sheet");
          OBR.scene.items.updateItems(context.items, (items) => {
            for (const item of items) {
              item.metadata[`${ID}/metadata`] = {
                characterSheetURL: characterSheetURL,
              };
            }
          });
        } catch (error) {
          OBR.notification.show("Invalid URL", "ERROR");
          return;
        }
      } else {
        analytics.track("remove_sheet");
        OBR.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            delete item.metadata[`${ID}/metadata`];
          }
        });
      }
    },
  });
  OBR.contextMenu.create({
    id: `${ID}/context-menu-view`,
    icons: [
      {
        icon: "/img/view.svg",
        label: `View sheet`,
        filter: {
          roles: ["GM", "PLAYER"],
          every: [
            { key: "layer", value: "CHARACTER" },
            {
              key: ["metadata", `${ID}/metadata`],
              value: undefined,
              operator: "!=",
            },
          ],
        },
      },
    ],
    async onClick(context) {
      const metadata: { characterSheetURL: string } = context.items[0].metadata[
        `${ID}/metadata`
      ] as { characterSheetURL: string };
      const isInlineMode = localStorage.getItem(`${ID}/inlineMode`) === "true";

      if (isInlineMode) {
        analytics.track("view_sheet_inline");

        await OBR.action.open();

        await OBR.broadcast.sendMessage(
          `${ID}/view-sheet`,
          {
            characterId: context.items[0].id,
            sheetURL: metadata.characterSheetURL,
          },
          { destination: "LOCAL" }
        );
      } else {
        analytics.track("view_sheet_popup");
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
          metadata.characterSheetURL,
          "_blank",
          `left=${left},top=${top},width=${windowWidth},height=${windowHeight}`
        );
      }
    },
  });
}
