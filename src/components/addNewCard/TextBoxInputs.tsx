"use client";

import type React from "react";

import ActionBtns from "./ActionBtns";
import { cn } from "@/lib/utils";
import { useFormContext } from "@/context/from-Context";

interface TextBoxInputsProps {
  actionBtns?: boolean;
  className?: string;
  notAllowTitle?: boolean;
}

const TextBoxInputs = ({
  actionBtns = false,
  className = "",
  notAllowTitle = false,
}: TextBoxInputsProps) => {
  const { formData, updateFormData, nextStep, prevStep, errors, resetForm } =
    useFormContext();

  const handleNextBtn = () => {
    nextStep();
  };

  const handlePrevBtn = () => {
    prevStep();
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleInputChange =
    (field: "title" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData(field, e.target.value);
    };

  return (
    <>
      <div className={cn("px-4 py-6 sm:p-8", className)}>
        <div className='mb-2'>
          <div className={cn("h-24", notAllowTitle && "h-18")}>
            {!notAllowTitle && (
              <label htmlFor='title' className='text-sm font-semibold'>
                Title
              </label>
            )}

            <div className={cn("relative mt-2", notAllowTitle && "mb-8")}>
              <input
                value={formData.title}
                onChange={handleInputChange("title")}
                type='text'
                name='title'
                id='title'
                placeholder='Title'
                className={cn("input rounded", errors.title && "border-error")}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />

              {errors.title && (
                <p id='title-error' className='mt-2 text-sm text-error'>
                  {errors.title}
                </p>
              )}
            </div>
          </div>
        </div>

        {!notAllowTitle && (
          <label htmlFor='description' className='text-sm font-semibold'>
            Description (optional)
          </label>
        )}

        <div className='relative mt-2'>
          <textarea
            value={formData.description}
            onChange={handleInputChange("description")}
            name='description'
            id='description'
            placeholder='Description'
            className='input rounded min-h-[108px]'
            aria-label='Description'
          ></textarea>
        </div>
        <div className='h-5'></div>
      </div>

      {!actionBtns && (
        <ActionBtns
          nextBtnClick={handleNextBtn}
          prevBtnClick={handlePrevBtn}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default TextBoxInputs;
