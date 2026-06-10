/**
 * useExportPng — turn any DOM node into a downloadable PNG.
 *
 * Used by every Studio component (Lineup, Match Day, Final Score).
 * The hook intentionally targets the *card* ref, not the whole studio page,
 * so chrome (controls, sidebars) never leaks into the export.
 */
import { useCallback, useState, type RefObject } from "react";
import { toPng } from "html-to-image";

export interface UseExportPngResult {
  exportPng: (filename: string) => Promise<string | null>;
  isExporting: boolean;
  lastError: string | null;
}

export function useExportPng(
  ref: RefObject<HTMLElement | null>,
): UseExportPngResult {
  const [isExporting, setIsExporting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const exportPng = useCallback(
    async (filename: string): Promise<string | null> => {
      if (!ref.current) {
        setLastError("Card not ready");
        return null;
      }
      setIsExporting(true);
      setLastError(null);
      try {
        const dataUrl = await toPng(ref.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#0a0a0a",
        });
        const safeName = filename.replace(/[^a-z0-9_-]+/gi, "_");
        const link = document.createElement("a");
        link.download = `${safeName}.png`;
        link.href = dataUrl;
        link.click();
        return dataUrl;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Export failed";
        setLastError(msg);
        return null;
      } finally {
        setIsExporting(false);
      }
    },
    [ref],
  );

  return { exportPng, isExporting, lastError };
}
