import { useEffect } from "react";
import { useBlocker } from "@tanstack/react-router";

export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const blocker = useBlocker({
    shouldBlockFn: () => isDirty, // Block if dirty
    withResolver: true, // Enable proceed/reset
  });

  return {
    showExitPrompt: blocker.status === "blocked",
    confirmExit: () => blocker.proceed?.(), // Proceed with navigation
    cancelExit: () => blocker.reset?.(), // Cancel navigation (stay)
  };
}
