import { createContext, useContext, useState } from "react";
type ThemeDropDownContextType = {
  isThemeDropDownOpen: boolean;
  setIsThemeDropDownOpen: (isThemeDropDownOpen: boolean) => void;
};
const ThemeDropDownContext = createContext<
  ThemeDropDownContextType | undefined
>(undefined);

export const ThemeDropDownContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isThemeDropDownOpen, setIsThemeDropDownOpen] = useState(false);
  return (
    <ThemeDropDownContext.Provider
      value={{ isThemeDropDownOpen, setIsThemeDropDownOpen }}
    >
      {children}
    </ThemeDropDownContext.Provider>
  );
};
export const useThemeDropDownContext = () => {
  const context = useContext(ThemeDropDownContext);
  if (!context) {
    throw new Error(
      "useThemeDropDownContext must be used within a ThemeDropDownContext"
    );
  }
  return context;
};
