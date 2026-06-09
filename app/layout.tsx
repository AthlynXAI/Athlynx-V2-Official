import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AthlynX — The Athlete's Playbook",
  description:
    "One Platform. Every Tool. Unlimited Potential. Built for every athlete — youth to pro to retirement.",
  metadataBase: new URL("https://athlynx.ai"),
  openGraph: {
    title: "AthlynX — The Athlete's Playbook",
    description:
      "Your Name. Your Image. Your Likeness. Built for every athlete — youth to pro to retirement.",
    url: "https://athlynx.ai",
    siteName: "AthlynX",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-granite-900 text-granite-50 font-sans">{children}</body>
    </html>
  );
}
