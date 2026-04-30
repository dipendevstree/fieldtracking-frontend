import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { AxiosError } from "axios";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { LoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import { handleServerError } from "@/utils/handle-server-error";
import { FontProvider } from "./context/font-context";
import { ThemeProvider } from "./context/theme-context";
import "./index.css";
// Generated Routes
import { routeTree } from "./routeTree.gen";
import { ViewTypeProvider } from "./context/view-type-context";
import { ENV } from "./config/env";

// Timestamps to track when toast was last shown (prevents duplicates within 1 second)
let last401ToastTime = 0;
let last500ToastTime = 0;
let last403ToastTime = 0;

const TOAST_DEBOUNCE_MS = 1000; // 1 second debounce window

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error("Content not modified!");
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        const now = Date.now();

        if (error.response?.status === 401) {
          if (now - last401ToastTime > TOAST_DEBOUNCE_MS) {
            last401ToastTime = now;
            toast.error(
              "Session expired or You were logged out from this device!",
            );
            const redirect = `${router.history.location.href}`;
            const wasSuperAdmin = localStorage.getItem("was_super_admin") === "true";
            const signInPath = wasSuperAdmin ? "/superadmin-sign-in" : "/sign-in";
            router.navigate({ to: signInPath, search: { redirect } });
          }
        }
        if (error.response?.status === 500) {
          if (now - last500ToastTime > TOAST_DEBOUNCE_MS) {
            last500ToastTime = now;
            toast.error("Internal Server Error!");
            router.navigate({ to: "/500" });
          }
        }
        if (error.response?.status === 403) {
          if (now - last403ToastTime > TOAST_DEBOUNCE_MS) {
            last403ToastTime = now;
            router.navigate({ to: "/403" });
            toast.error("Access Denied!");
          }
        }
      }
    },
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <FontProvider>
            <LoadScript
              googleMapsApiKey={ENV.GOOGLE_MAP_API_KEY}
              libraries={["places"]}
              loadingElement={<div></div>}
            >
              <ViewTypeProvider>
                <RouterProvider router={router} />
              </ViewTypeProvider>
            </LoadScript>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
