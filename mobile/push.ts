// mobile/push.ts — Expo push token registration (Lane B, Task 3)

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const REGISTER_ENDPOINT = 'https://athlynx.ai/api/push/register';

/**
 * Requests push permission and registers the Expo push token with the AthlynX
 * backend. Returns the token on success, or null if denied / unavailable.
 * The user-facing rationale ("NIL spikes, recruiting interest, bracket scores")
 * is shown as a pre-prompt in App.tsx BEFORE this is called, so the system
 * dialog only appears once the user has opted in.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'AthlynX Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#1E90FF',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (existing !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }
    if (status !== 'granted') return null;

    const projectId =
      (Constants?.expoConfig?.extra as any)?.eas?.projectId ??
      (Constants as any)?.easConfig?.projectId;

    const tokenResp = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const token = tokenResp.data;

    // Fire-and-forget backend registration; failure here must not block launch.
    fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, platform: Platform.OS }),
    }).catch(() => {});

    return token;
  } catch {
    return null;
  }
}
