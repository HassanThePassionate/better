import { createContext, useContext, useEffect, useState } from "react";

// Theme types
type Theme = "light" | "dark" | "sunrise" | "sunset" | "system" | "forest";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create Theme Context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Function to get system theme
const getSystemTheme = (): Theme => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
};

// Function to get sunrise/sunset themes based on time
const getTimeBasedTheme = (): Theme => {
  return getSystemTheme();
};

// Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("system");

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setThemeState(storedTheme);
  }, []);

  // Function to set theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Apply theme to <html> tag
  useEffect(() => {
    const appliedTheme = theme === "system" ? getTimeBasedTheme() : theme;
    document.documentElement.setAttribute("data-theme", appliedTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
