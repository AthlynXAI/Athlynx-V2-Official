/**
 * AthlynX — Push Notification Hook
 * Handles subscribing/unsubscribing from push notifications
 * Badge counts update on the PWA app icon automatically
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const { data: vapidData } = trpc.push.getVapidKey.useQuery();
  const subscribeMutation = trpc.push.subscribe.useMutation();
  const unsubscribeMutation = trpc.push.unsubscribe.useMutation();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      // Check current subscription status
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
      });
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported || !vapidData?.publicKey) return;
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setIsLoading(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey) as BufferSource,
      });
      const json = sub.toJSON();
      await subscribeMutation.mutateAsync({
        endpoint: sub.endpoint,
        p256dhKey: json.keys?.p256dh ?? "",
        authKey: json.keys?.auth ?? "",
      });
      setSubscription(sub);
      setIsSubscribed(true);
    } catch (err) {
      console.error("[Push] Subscribe failed:", err);
    }
    setIsLoading(false);
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    setIsLoading(true);
    try {
      await subscription.unsubscribe();
      await unsubscribeMutation.mutateAsync({ endpoint: subscription.endpoint });
      setSubscription(null);
      setIsSubscribed(false);
    } catch (err) {
      console.error("[Push] Unsubscribe failed:", err);
    }
    setIsLoading(false);
  };

  return { isSupported, isSubscribed, isLoading, subscribe, unsubscribe };
}
