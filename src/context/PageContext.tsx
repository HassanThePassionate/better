"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";

type PageContextProps = {
  page: string;
  setPage: (page: string) => void;
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
};

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const PageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [page, setPage] = useState<string>("bookmarks");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <PageContext.Provider value={{ page, setPage, dialogOpen, setDialogOpen }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageContextProvider");
  }
  return context;
};
