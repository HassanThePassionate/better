'use client';

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Favorite = {
  url: string;
  caption: string;
};

type FormValues = {
  url: string;
  caption: string;
};

type MenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  addFavorite: () => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleCloseDropdown: () => void;
  toggleMenu: () => void;
  loading: boolean;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    url: "",
    caption: "",
  });
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // This effect will run when loading changes from true to false
  useEffect(() => {
    if (!loading && formValues.url && !formValues.caption) {
      // When loading completes and we have a URL but no caption,
      // set a caption based on the URL
      const domain = new URL(formValues.url.startsWith('http') ? formValues.url : `https://${formValues.url}`).hostname;
      const siteName = domain.replace(/^www\./, '').split('.')[0];
      setFormValues(prev => ({
        ...prev,
        caption: siteName.charAt(0).toUpperCase() + siteName.slice(1) // Capitalize first letter
      }));
    }
  }, [loading, formValues]);

  const addFavorite = () => {
    const { url, caption } = formValues;
    if (!url.trim() || !caption.trim()) return;

    setFavorites((prev) => [...prev, { url, caption }]);
    handleCloseDropdown();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name === "url" && value.trim()) {
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

      if (urlRegex.test(value)) {
        setLoading(true);
        
        // Simulate fetching site data
        setTimeout(() => {
          setLoading(false);
          // The caption will be set by the useEffect when loading becomes false
        }, 1500);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFavorite();
  };

  const handleCloseDropdown = () => {
    setFormValues({ url: "", caption: "" });
    setShowDropdown(false);
    setLoading(false);
  };

  const toggleMenu = () => setOpen(!open);

  const value = {
    open,
    setOpen,
    showDropdown,
    setShowDropdown,
    formValues,
    setFormValues,
    favorites,
    setFavorites,
    addFavorite,
    handleFormChange,
    handleFormSubmit,
    handleCloseDropdown,
    toggleMenu,
    loading,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
