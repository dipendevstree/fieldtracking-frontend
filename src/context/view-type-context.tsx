import { AUTH_STORAGE_KEYS, ViewType } from "@/components/layout/types";
import React from "react";

interface ViewTypeContextType {
  viewType: ViewType;
  setViewType: React.Dispatch<React.SetStateAction<ViewType>>;
}

const ViewTypeContext = React.createContext<ViewTypeContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function ViewTypeProvider({ children }: Props) {
  const [viewType, setViewType] = React.useState<ViewType>(() => {
    const stored = localStorage.getItem(
      AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY
    );
    return stored === ViewType.Self ? ViewType.Self : ViewType.Admin;
  });

  React.useEffect(() => {
    if (
      localStorage.getItem(AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY) !== viewType
    ) {
      localStorage.setItem(AUTH_STORAGE_KEYS.VIEW_TYPE_STORAGE_KEY, viewType);
    }
    setViewType(viewType);
  }, [viewType]);

  return (
    <ViewTypeContext.Provider value={{ viewType, setViewType }}>
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
