"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type FormData = {
  url: string;
  title: string;
  description: string;
  tags: string[];
};

type FormContextType = {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => void;
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  errors: Record<string, string>;
  validateCurrentStep: () => boolean;
  resetForm: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    url: "",
    title: "",
    description: "",
    tags: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedUrl = localStorage.getItem("inputText");
    const savedTitle = localStorage.getItem("titleValue");
    const savedDescription = localStorage.getItem("descriptionValue");

    setFormData((prev) => ({
      ...prev,
      url: savedUrl || "",
      title: savedTitle || "",
      description: savedDescription || "",
    }));
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("inputText", formData.url);
    localStorage.setItem("titleValue", formData.title);
    localStorage.setItem("descriptionValue", formData.description);
  }, [formData]);

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user updates it
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      // Validate URL
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
      if (!formData.url) {
        newErrors.url = "URL is required";
      } else if (!urlRegex.test(formData.url)) {
        newErrors.url = "URL is invalid";
      }
    } else if (currentStep === 1) {
      // Validate title
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (step: number) => {
    // Only allow going back or to validated steps
    if (step < currentStep || validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  const nextStep = (): boolean => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const resetForm = () => {
    setFormData({
      url: "",
      title: "",
      description: "",
      tags: [],
    });
    setErrors({});

    localStorage.removeItem("inputText");
    localStorage.removeItem("titleValue");
    localStorage.removeItem("descriptionValue");

    localStorage.removeItem("selectedTags");
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        errors,
        validateCurrentStep,
        resetForm,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
