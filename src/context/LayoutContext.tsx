import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LayoutContextType {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notificationsOpen: boolean;
  setNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        isSidebarExpanded,
        toggleSidebar,
        activeTab,
        setActiveTab,
        searchOpen,
        setSearchOpen,
        notificationsOpen,
        setNotificationsOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
