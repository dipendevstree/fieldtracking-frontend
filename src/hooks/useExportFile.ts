import { useState, useCallback } from "react";

type ExportType = "csv" | "xlsx";

interface UseExportFileOptions {
  baseUrl?: string; // default API base
}

interface ExportFileParams {
  url: string;
  type: ExportType;
  queryParams?: Record<string, any>;
  filename: string;
}

// Utility to download blob
const downloadBlob = (
  blob: Blob,
  filename: string,
  type: "csv" | "xlsx" | "pdf"
) => {
  // Ensure the filename has the correct extension
  const ext = type;
  if (!filename.toLowerCase().endsWith(`.${ext}`)) {
    filename = `${filename}.${ext}`;
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Hook
export const useExportFile = (options?: UseExportFileOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportFile = useCallback(
    async ({ url, type, queryParams = {}, filename }: ExportFileParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(
          Object.entries(queryParams).map(([key, value]) => [
            key,
            String(value),
          ])
        ).toString();

        const baseUrl = options?.baseUrl || import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}${url}?${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to export ${type}`);
        }

        const blob = await response.blob();
        downloadBlob(blob, filename, type);
      } catch (err: any) {
        setError(err);
        console.error("Export failed", err);
      } finally {
        setIsLoading(false);
      }
    },
    [options?.baseUrl]
  );

  return { exportFile, isLoading, error };
};
