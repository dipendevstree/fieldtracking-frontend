import { AUTH_STORAGE_KEYS, ViewType } from "@/components/layout/types";
import React from "react";

interface ViewTypeContextType {
  viewType: ViewType | null;
  setViewType: React.Dispatch<React.SetStateAction<ViewType | null>>;
  viewTypeToggle: boolean;
  setViewTypeToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewTypeContext = React.createContext<ViewTypeContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function ViewTypeProvider({ children }: Props) {
  const [viewType, setViewType] = React.useState<ViewType | null>(() => {
    const stored = localStorage.getItem(
      AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY
    );
    return stored === ViewType.Self ? ViewType.Self : ViewType.Admin;
  });

  const [viewTypeToggle, setViewTypeToggle] = React.useState<boolean>(() => {
    const stored = localStorage.getItem(
      AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY
    );
    return stored === ViewType.Self ? true : false;
  });

  React.useEffect(() => {
    if (viewTypeToggle) {
      setViewType(viewType);
      setViewTypeToggle(true);
      viewType &&
        localStorage.setItem(AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY, viewType);
    } else {
      setViewType(null);
      setViewTypeToggle(false);
      localStorage.removeItem(AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY);
    }
  }, [viewTypeToggle]);

  React.useEffect(() => {
    if (
      viewType &&
      localStorage.getItem(AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY) !== viewType
    ) {
      localStorage.setItem(AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY, viewType);
    }
    setViewType(viewType);
  }, [viewType]);

  // set decvice id to local storage if not present
  React.useEffect(() => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = `web_${crypto.randomUUID()}`;
      localStorage.setItem("deviceId", deviceId);
    }
  }, []);

  return (
    <ViewTypeContext.Provider
      value={{ viewType, setViewType, viewTypeToggle, setViewTypeToggle }}
    >
      {children}
    </ViewTypeContext.Provider>
  );
}

export const useViewType = () => {
  const context = React.useContext(ViewTypeContext);

  if (!context)
    throw new Error("useViewType must be used within a ViewTypeProvider");

  return context;
};
