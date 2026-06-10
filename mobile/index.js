// AthlynXAI safe native launcher.
// Build 73 proved the pure React Native shell launches on device. This entry keeps
// that shell path while restoring the real Home layer from App.tsx only.
// It intentionally avoids Expo Router, auth bootstrap, Supabase, WebView, Sentry,
// splash-screen calls, and optional native startup modules during first restore.
const { AppRegistry } = require('react-native');
const App = require('./App').default;

AppRegistry.registerComponent('main', () => App);
