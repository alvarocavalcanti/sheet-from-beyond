# Release Notes

## Version 2025-11-24

### Major UI Redesign

**Complete interface overhaul** addressing [Issue #2](https://github.com/alvarocavalcanti/sheet-from-beyond/issues/2) - persistent sheet viewing.

#### New Features

- **Tabbed Interface**: Replaced accordion navigation with clean tab-based layout
  - "Characters" tab for sheet management
  - "Settings" tab for configuration
  - Version number integrated into tab navigation

- **Compact Character List**: Streamlined list design with minimal padding
  - 40px height per character (down from ~60px)
  - Click character name to view sheet inline
  - External link icon to open in popup window
  - Active selection highlighting

- **Full-Width Inline Display**: Single iframe below character list
  - 580px usable width (up from ~500px - 16% increase)
  - 600px height for better readability
  - Always available regardless of mode setting

- **Improved Panel Width**: Expanded from 400px to 600px for better sheet viewing

#### Behavior Changes

- **Extension Panel**: Always offers both inline and popup options
  - Click character name → view inline
  - Click external link icon → open popup
  - Mode setting does NOT affect panel behavior

- **Context Menu**: Respects mode setting
  - "Open Extension Panel" mode → opens panel and shows sheet inline
  - "Popup Window" mode → opens popup directly (doesn't touch panel)

#### Space Improvements

- Reduced vertical overhead by ~100px
- Increased iframe width by ~80px
- Minimal padding throughout (down from triple-nested accordions)

#### Analytics Updates

- `tab_switch_characters` - Switching to Characters tab
- `tab_switch_settings` - Switching to Settings tab
- `view_sheet_from_context_menu` - Context menu opens panel
- `select_character_inline` - Clicking character name in list
- `select_character_popup` - Clicking external link icon

---

## Version 2025-01-15

### Previous Release
- Initial inline display implementation
- Accordion-based interface
- Basic popover/popup mode switching
