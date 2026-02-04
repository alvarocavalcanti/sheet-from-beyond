# Sheet from Beyond - Stack Migration Notes

## Current State Analysis

### Dependencies (22 packages)

**Runtime:**

- @analytics/google-analytics
- @owlbear-rodeo/sdk
- @uidotdev/usehooks
- analytics
- bootstrap
- react
- react-bootstrap
- react-dom
- react-router-dom

**Dev:**

- @types/node
- @types/react
- @types/react-dom
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vitejs/plugin-react
- eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- typescript
- vite

### Bootstrap Components Used

- **Badge**: Small status indicators (1 usage - "Recommended" badge)
- **Card**: Content containers (3 cards in settings tab)
- **Form.Check**: Radio buttons for settings
- **Nav/Tab**: Tab navigation (Characters/Settings)
- **Alert**: Info messages (2 usages)
- **ListGroup**: Character list display
- **Button**: Link-style button for popup icon

### Icons

✅ Already optimized! Using inline Bootstrap Icons SVG (just 1 icon)

### Files to Migrate

1. `src/main.tsx` - Remove Bootstrap CSS import
2. `src/components/App.tsx` - Main component (tabs, cards, forms)
3. `src/components/CharacterSheetsList.tsx` - List and alerts
4. `src/components/SceneNotReady.tsx` - (need to check)
5. `src/components/OBRLoading.tsx` - (need to check)

### Analytics Simplification

Current: `analytics` wrapper + `@analytics/google-analytics` plugin

**Option 1**: Use gtag.js directly (smallest)
**Option 2**: Keep analytics wrapper (if you use it elsewhere)

Recommendation: Switch to gtag.js for ~15KB savings

## Migration Plan

### Phase 1: Low-Hanging Fruit

- [ ] Simplify analytics to gtag.js
- [ ] Keep @uidotdev/usehooks (useful, small)
- [ ] Document current bundle size

### Phase 2: Tailwind Migration

- [ ] Install Tailwind CSS, PostCSS, Autoprefixer
- [ ] Create tailwind.config.js with OBR theme support
- [ ] Migrate components to Tailwind
- [ ] Remove Bootstrap dependencies

### Phase 3: Verification

- [ ] Build and test
- [ ] Measure bundle size improvement
- [ ] Verify all functionality works

## Expected Improvements

**Current estimate:**

- Bootstrap CSS: ~200KB (uncompressed), ~50KB (gzipped)
- analytics wrapper: ~15KB
- react-bootstrap: ~50KB

**After migration:**

- Tailwind CSS: <10KB (purged, gzipped)
- gtag.js: inline script
- No react-bootstrap

**Total savings: ~150-200KB** (~60-70% reduction in assets)
