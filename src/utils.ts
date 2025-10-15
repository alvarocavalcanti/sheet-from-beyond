import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

export const analytics = Analytics({
  app: 'sheet-from-beyond',
  plugins: [
    googleAnalytics({
      measurementIds: ['G-GEYF4VC4CN']
    })
  ]
})
