export interface ReleaseHighlight {
  version: string;
  date: string;
  highlights: string[];
}

export const releaseHighlights: ReleaseHighlight[] = [
  {
    version: "2026-02-04",
    date: "February 4, 2026",
    highlights: [
      "🎨 New customizable color themes - Choose from 4 beautiful palettes",
      "⚡ 92% smaller CSS bundle for faster loading",
      "🚀 70% fewer modules for improved performance",
      "💾 25% smaller total bundle size",
      "🌙 Enhanced dark mode with better color contrast"
    ]
  },
  {
    version: "2025-11-24",
    date: "November 24, 2025",
    highlights: [
      "🎨 Complete UI redesign with tabbed interface",
      "📏 Compact character list (40px per item)",
      "📺 Full-width inline display (580px usable width)",
      "↔️ Expanded panel width from 400px to 600px",
      "✨ Always-available inline and popup options"
    ]
  }
];

export const changelogUrl = "https://github.com/alvarocavalcanti/sheet-from-beyond/blob/main/RELEASE-NOTES.md";
