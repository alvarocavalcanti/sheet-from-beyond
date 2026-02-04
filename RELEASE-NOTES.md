# Release Notes

## Version 2026-02-04

### Major Tech Stack Modernization

**Complete migration from Bootstrap to Tailwind CSS** resulting in significant performance improvements.

#### Performance Improvements

- **Bundle Size Reduction**: 70% smaller total bundle
  - CSS: 231.93 KB → 19.68 KB (91.5% reduction)
  - JavaScript: 276.36 KB → 209.51 KB (24.2% reduction)
  - Total (gzipped): 116.03 KB → 67.61 KB (41.7% reduction)
- **Build Performance**: 40% faster builds (675ms → 404ms)
- **Module Optimization**: 70% fewer modules transformed (450 → 133)
- **Dependencies**: Reduced from 22 to 15 core packages

#### Technical Changes

- Replaced Bootstrap 5 + react-bootstrap with Tailwind CSS v4
- Replaced analytics wrapper packages with direct gtag.js integration
- Maintained all existing functionality with improved performance
- Enhanced dark mode support with better color contrast
- Cleaner, more maintainable component code

#### Visual Improvements

- Improved text readability in dark mode
- Better color contrast throughout the UI
- Consistent styling with Owlbear Rodeo theme
- Smoother hover states and transitions

---

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
