# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sheet from Beyond is an Owlbear Rodeo extension that allows GMs and players to associate external character sheet URLs with character tokens and view them either as popovers within the scene or as separate popup windows.

## Development Commands

### Build and Development
- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Compile TypeScript and build production bundle with Vite
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on TypeScript/TSX files with strict error reporting

### Project Structure
The build creates two separate HTML entry points via Vite's multi-page configuration:
- `index.html` → Main settings UI (React app)
- `background.html` → Background context menu setup

## Architecture

### Entry Points and Initialization

**Background Context (`background.ts`)**
- Initializes Owlbear Rodeo SDK when ready
- Sets up context menu handlers via `setupContextMenu()`
- Handles theme synchronization with Owlbear Rodeo's current theme

**Main App (`main.tsx`)**
- Renders different content based on whether it's loaded from OBR (checks `obrref` URL param)
- If from OBR: Renders React settings UI wrapped in `PluginGate`
- If standalone: Shows README iframe
- Defines the plugin ID: `es.memorablenaton.sheet-from-beyond`

### Context Menu System (`contextMenu.ts`)

Creates two context menu entries for CHARACTER layer items:

1. **Add/Remove Sheet** (GM only)
   - Add: Shows when character has no sheet URL metadata
   - Remove: Shows when character has sheet URL metadata
   - Stores URL in item metadata under `${ID}/metadata` with `characterSheetURL` property
   - Validates URLs before storing

2. **View Sheet** (GM and PLAYER)
   - Only visible when character has sheet URL metadata
   - Two display modes based on localStorage `${ID}/popoverMode`:
     - **Popover mode**: Opens in OBR popover with configurable dimensions
     - **Popup mode**: Opens in new browser window (400x800, centered on screen)

### Main UI (`App.tsx`)

React component with accordion-based interface featuring two main sections:

**1. Character Sheets Accordion:**
- Lists all character tokens with associated sheet URLs
- Displays character name with external link icon for quick access
- Empty state with instructions when no sheets are added
- Real-time updates via `OBR.scene.items.onChange()`
- Opens sheets in popup window when clicked from list
- Sorted alphabetically by character name

**2. Settings Accordion:**
- Display mode toggle (Popup Window vs Popover)
- Popover size configuration (height/width) when in popover mode
- Uses `useLocalStorage` hook from `@uidotdev/usehooks` for persistence
- Settings stored with keys: `${ID}/popoverMode`, `${ID}/popoverHeight`, `${ID}/popoverWidth`

**Additional UI Elements:**
- Both accordions collapsed by default on page load
- Buy Me a Coffee button at bottom
- Version display from `/manifest.json`
- Only renders when scene is ready (via `OBR.scene.isReady()`)

### Character Sheets List (`CharacterSheetsList.tsx`)

Component that displays all characters with associated sheet URLs:
- Queries OBR scene items filtered by CHARACTER layer with metadata
- Extracts character name from item text (supports both plainText and richText)
- Subscribes to item changes for real-time list updates
- Opens sheets in centered popup window (400x800)
- Shows informative empty state when no sheets exist
- Uses Bootstrap ListGroup for consistent styling

### Key Data Flow

1. **Metadata Storage**: Character sheet URLs stored in Owlbear item metadata
2. **Settings Persistence**: Display preferences stored in browser localStorage
3. **Theme Sync**: App listens to OBR theme changes and updates Bootstrap theme accordingly (`data-bs-theme` attribute)

### Technology Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: React Bootstrap 5
- **Build Tool**: Vite with multi-page setup
- **SDK**: @owlbear-rodeo/sdk for OBR integration
- **Linting**: ESLint with TypeScript and React Hooks plugins
- **Analytics**: Google Analytics via `analytics` library with `@analytics/google-analytics` plugin

### Important Constants

- Plugin ID: `es.memorablenaton.sheet-from-beyond` (exported from `main.tsx`)
- Default popover size: 800h x 400w
- Default popup window: 800h x 400w (centered)

### Permissions Model

- **GM Role**: Can add, remove, and view sheets
- **PLAYER Role**: Can view sheets (requires "Character Update" permission in Owlbear)

### Manifest Configuration

Version and metadata managed in `public/manifest.json`:
- Uses manifest_version 1
- Action popover defaults: 600h x 400w
- Icon references in `/img/` directory

### Analytics Implementation

Analytics is configured in `src/utils.ts` using Google Analytics (Measurement ID: G-GEYF4VC4CN).

**Tracked Events:**

Context Menu Actions (`contextMenu.ts`):
- `add_sheet` - Character sheet URL added
- `remove_sheet` - Character sheet URL removed
- `view_sheet_popover` - Sheet viewed in popover mode
- `view_sheet_popup` - Sheet viewed in popup window

Settings UI Actions (`App.tsx`):
- `settings_change_popup_mode` - Display mode changed to popup
- `settings_change_popover_mode` - Display mode changed to popover
- `settings_update_popover_height` - Popover height changed
- `settings_update_popover_width` - Popover width changed
- `accordion_open_sheets` - Character Sheets accordion opened
- `accordion_open_settings` - Settings accordion opened

Character Sheet List Actions (`CharacterSheetsList.tsx`):
- `open_sheet_from_list` - Sheet opened via list external link icon

Page Views:
- Settings page view tracked via `analytics.page()` in `App.tsx`
- Standalone homepage view tracked via `analytics.page()` in `main.tsx`

**Usage Pattern:**
```typescript
import { analytics } from "./utils";
analytics.track("event_name");  // Track events
analytics.page();               // Track page views
```
