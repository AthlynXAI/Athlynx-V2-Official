# AthlynXAI App Store Readiness

This file tracks source-side readiness for Google Play and Apple App Store submission without committing private credentials.

## Current app identity

| Platform | Identifier | Version | Build | Status |
|---|---|---:|---:|---|
| iOS | `ai.athlynx.app` | `1.0.0` | `18` | Source configured for store distribution |
| Android | `ai.athlynx.app` | `1.0.0` | `18` | Source configured for AAB production build |

## Source-ready items

| Item | Status | Evidence |
|---|---|---|
| Expo app config | Ready | `mobile/app.json` defines iOS bundle ID and Android package |
| EAS production build profile | Ready | `mobile/eas.json` uses Android `app-bundle` and iOS `store` distribution |
| Required app icons | Ready | `mobile/assets/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png` exist |
| API endpoint | Ready | `extra.apiUrl` points to `https://athlynx.ai` |
| Encryption export declaration | Ready | `ITSAppUsesNonExemptEncryption=false` is configured |

## External account items not committed to Git

| Item | Owner action |
|---|---|
| Google Play service account JSON | Add locally/securely as `mobile/google-service-account.json` only at submit time |
| Apple App Store Connect API key | Add locally/securely as `mobile/AuthKey_MT3P665D4W.p8` only at submit time |
| Apple Developer membership / agreements | Verify in Apple Developer and App Store Connect |
| Google Play app listing / internal testing access | Verify in Play Console |
| Store screenshots, privacy questionnaire, age rating | Complete in App Store Connect and Play Console if not already done |

## Safe commands

```bash
cd mobile
pnpm install
npx expo-doctor
pnpm exec eas build --platform android --profile production
pnpm exec eas build --platform ios --profile production
```

Do not commit store credential files, private keys, provisioning artifacts, or service-account JSON.
