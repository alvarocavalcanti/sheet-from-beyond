import React, { useEffect, useState } from 'react';
import { releaseHighlights, changelogUrl } from '../releaseNotes';
import DonationButtons from './DonationButtons';

interface WhatsNewProps {
  currentVersion: string;
  storageKey: string;
}

const WhatsNew: React.FC<WhatsNewProps> = ({ currentVersion, storageKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem(storageKey);

    if (lastSeenVersion !== currentVersion) {
      setIsVisible(true);
    }
  }, [currentVersion, storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, currentVersion);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const recentReleases = releaseHighlights.slice(0, 2);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-400 dark:border-gray-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: 'var(--color-card, #FFFFFF)' }}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎉 What's New
            </h2>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              title="Close"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {recentReleases.map((release, index) => (
              <div key={release.version}>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Version {release.version}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {release.date}
                  </span>
                  {index === 0 && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-medium">
                      NEW
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {release.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                {index < recentReleases.length - 1 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={changelogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              View full changelog on GitHub →
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              Enjoying the extension? Consider supporting development:
            </p>
            <DonationButtons />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDismiss}
              className="px-6 py-2 bg-theme-primary border-2 border-theme-primary text-white rounded font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
