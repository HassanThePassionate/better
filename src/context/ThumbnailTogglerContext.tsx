import { createContext, useContext, useState, ReactNode } from "react";
import { usePageContext } from "./PageContext";

const ThumbnailTogglerContext = createContext<
  | {
      isListView: boolean;
      setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const ThumbnailTogglerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { page } = usePageContext();
  const showCards = page === "extensions";
  const [isListView, setIsListView] = useState(showCards);

  return (
    <ThumbnailTogglerContext.Provider value={{ isListView, setIsListView }}>
      {children}
    </ThumbnailTogglerContext.Provider>
  );
};

export function useThumbnailToggler() {
  const context = useContext(ThumbnailTogglerContext);
  if (!context) {
    throw new Error(
      "useThumbnailToggler must be used within a ThumbnailTogglerProvider"
    );
  }
  return context;
}
