"use client";

import type React from "react";

import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import ActionBtns from "./ActionBtns";
import { cn } from "@/lib/utils";
import { useFormContext } from "@/context/from-Context";
import ErrorIcon from "../svgs/ErrorIcon";
import ClipBoardIcon from "../svgs/ClipBoardIcon";

interface Props {
  actionBtns?: boolean;
  className?: string;
  notAllowTitle?: boolean;
  isWorkingUrl?: boolean;
}

// URL validation regex
const urlRegex =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const PasteLinkInput = ({ actionBtns, className, notAllowTitle }: Props) => {
  const { formData, updateFormData, nextStep, errors, resetForm } =
    useFormContext();
  const [loading, setLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);

  // Validate URL whenever it changes
  useEffect(() => {
    if (formData.url) {
      const isValid = urlRegex.test(formData.url);
      setIsValidUrl(isValid);

      // If URL becomes invalid while loading, stop loading
      if (!isValid && loading) {
        setLoading(false);
      }
    } else {
      setIsValidUrl(false);
    }
  }, [formData.url, loading]);

  const handleNextBtn = () => {
    nextStep();
  };

  const handleCancel = () => {
    resetForm();
  };

  const handlePasteUrl = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();

      // Update the URL field
      updateFormData("url", pastedText);

      // Check if the pasted URL is valid
      const isValid = urlRegex.test(pastedText);
      setIsValidUrl(isValid);

      if (isValid) {
        setLoading(true);

        setTimeout(() => {
          try {
            // Add dummy title and description
            updateFormData(
              "title",
              "Dummy Title for " + new URL(pastedText).hostname
            );
            updateFormData(
              "description",
              "This is a dummy description for the pasted link. You can edit this text to provide more details about the content."
            );
          } catch (error) {
            console.log("Error parsing URL:", error);
          } finally {
            setLoading(false);
          }
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUrlInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    updateFormData("url", inputUrl);

    // Check if the input URL is valid
    const isValid = urlRegex.test(inputUrl);
    setIsValidUrl(isValid);

    if (isValid && inputUrl.trim() !== "") {
      setLoading(true);

      setTimeout(() => {
        try {
          updateFormData("title", "Dummy Title  ");
          updateFormData(
            "description",
            "This is a dummy description for the entered link. You can edit this text to provide more details about the content."
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }, 2000);
    }
  };

  return (
    <>
      <div className={cn("px-4 py-6 sm:p-8", className)}>
        <div className={cn("h-24", notAllowTitle && "h-[50px]")}>
          {!notAllowTitle && (
            <label htmlFor='url' className='text-sm font-semibold'>
              URL
            </label>
          )}

          <div className='flex relative rounded mt-2'>
            <input
              type='url'
              name='url'
              value={formData.url}
              onChange={handleUrlInputValue}
              id='url'
              placeholder='https://example.com'
              className={cn(
                "input rounded",
                !isValidUrl && formData.url ? "border-error" : ""
              )}
            />
            {errors.url && (
              <>
                <div className='flex pointer-events-none absolute inset-y-0 right-[84px] items-center pr-3'>
                  <ErrorIcon />
                </div>
              </>
            )}
            <button
              type='button'
              className='absolute bg-background right-2 top-[50%] -translate-y-1/2 flex items-center gap-2 transition duration-200 px-3 py-2 rounded text-sm text-foreground hover:bg-hover font-medium border border-border h-[32px]'
              onClick={handlePasteUrl}
            >
              {!loading ? (
                <>
                  <ClipBoardIcon />
                  Paste
                </>
              ) : (
                <Loader2 size={20} className='animate-spin' />
              )}
            </button>
          </div>

          {errors.url && (
            <p className='mt-2 text-sm text-error'>{errors.url}</p>
          )}
          {!isValidUrl && formData.url && !errors.url && (
            <p className='mt-2 text-sm text-error'>Please enter a valid URL</p>
          )}
        </div>
      </div>

      {!actionBtns && (
        <ActionBtns
          noprevbtn
          nextBtnClick={handleNextBtn}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default PasteLinkInput;
