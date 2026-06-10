/**
 * AthlynX — Push Notification Bell
 * Shows in the admin header — enables push notifications with one tap
 * Once enabled, badge counts appear on the PWA icon for new signups/messages
 */
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationBell() {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) return null;

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
      title={isSubscribed ? "Push notifications ON — tap to disable" : "Enable push notifications"}
      style={{
        background: isSubscribed
          ? "linear-gradient(135deg, #00c853, #00e676)"
          : "rgba(255,255,255,0.1)",
        border: isSubscribed ? "none" : "1px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        padding: "6px 12px",
        color: "#fff",
        fontSize: "13px",
        fontWeight: "600",
        cursor: isLoading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        opacity: isLoading ? 0.6 : 1,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "16px" }}>{isSubscribed ? "" : ""}</span>
      {isLoading ? "..." : isSubscribed ? "Alerts ON" : "Enable Alerts"}
    </button>
  );
}
