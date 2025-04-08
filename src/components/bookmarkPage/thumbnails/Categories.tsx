"use client";

import { categories } from "@/constant/categories";
import { useBookmarks } from "@/context/BookmarkContext";
import { usePageContext } from "@/context/PageContext";
import { getCategoryCounts, getCategoryName } from "@/lib/category-utils";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import DialogBox from "../../../modals/DialogBox";
import AddNew from "../../addNewFolder/AddNew";
import { BsPin, BsPinFill } from "react-icons/bs";

const Categories = ({ className }: { className?: string }) => {
  const {
    toggleCategory,
    selectedCategories,
    filteredCards,
    categories: categoriesData,
    setPinCategories,
    pinCategories,
  } = useBookmarks();
  const { page } = usePageContext();
  const categoryCounts = useMemo(
    () => getCategoryCounts(filteredCards),
    [filteredCards]
  );
  const isDownloadPage = page === "downloads";

  const categoryData = isDownloadPage ? categories : categoriesData;
  const handlePinCategory = (name: string) => {
    return () => {
      const updatedCategories = pinCategories.includes(name)
        ? pinCategories.filter((category) => category !== name)
        : [...pinCategories, name];

      setPinCategories(updatedCategories);
    };
  };

  return (
    <div
      className={cn(
        "hidden lg:block w-[260px] justify-self-end overflow-x-hidden overflow-y-auto no-scrollbar py-2 max-lg:p-5  ",
        className
      )}
    >
      <div className='flex flex-col gap-1.5 lg:gap-0 lg:items-end lg:pr-2  '>
        <h2
          className={cn(
            "  w-[60px] text-foreground opacity-60 font-medium",
            isDownloadPage && "mr-4"
          )}
        >
          Filters
        </h2>
        {categoryData.map((category, i) => (
          <div key={i} className='flex items-center group'>
            <button
              onClick={getCategoryName(category.id, toggleCategory)}
              type='button'
              className={cn(
                "text-foreground hover:text-text group focus:outline-none max-w-[260px] cursor-pointer flex gap-0.5 text-sm items-center",
                selectedCategories.includes(category.id) &&
                  "font-medium text-brand hover:text-brand"
              )}
            >
              <span className='group-focus-visible:ring-1 ring-0 rounded ring-inset ring-border leading-1 whitespace-nowrap truncate grow text-right p-2'>
                {category.name}
              </span>
              <span
                className={cn(
                  "w-8 text-left shrink whitespace-nowrap truncate text-foreground",
                  selectedCategories.includes(category.id) &&
                    "font-medium text-brand hover:text-brand"
                )}
              >
                {categoryCounts[category.id] || 0}
              </span>
            </button>
            <button
              className={cn(
                "mt-1 -ml-1.5 cursor-pointer opacity-0 transition duration-200 group-hover:opacity-100 hover:text-brand",
                pinCategories.includes(category.name) &&
                  "text-brand opacity-100"
              )}
              onClick={handlePinCategory(category.name)}
            >
              {pinCategories.includes(category.name) ? (
                <BsPinFill size={18} />
              ) : (
                <BsPin size={18} />
              )}
            </button>
          </div>
        ))}
        {!isDownloadPage && (
          <DialogBox
            className='p-6 !rounded-[32px] bg-background max-w-[550px] w-full '
            trigger={
              <span className=' rounded lg:mr-8 mt-2 block text-text    font-medium  '>
                Add New
              </span>
            }
          >
            <AddNew />
          </DialogBox>
        )}
      </div>
    </div>
  );
};

export default Categories;
