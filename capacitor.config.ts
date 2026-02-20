import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.kourous.app',
  appName: 'Kourous',
  webDir: 'out',
  server: {
    // Allow inline scripts & styles for Next.js
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#05070c',
    preferredContentMode: 'mobile',
    scheme: 'Kourous',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#05070c',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#05070c',
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      hideFormAccessoryBar: true,
    },
  },
};

export default config;
