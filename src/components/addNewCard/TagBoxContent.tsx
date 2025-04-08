"use client";

import TagBox from "../TagBox";
import ActionBtns from "./ActionBtns";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

import { useBookmarks } from "@/context/BookmarkContext";
import type { Card } from "@/types/TabCardType";
import { useFormContext } from "@/context/from-Context";

interface TagBoxContentProps {
  actionBtns?: boolean;
  className?: string;
  tag?: { id: string; name: string }[] | undefined;
}

const TagBoxContent = ({
  actionBtns = false,
  className = "",
  tag,
}: TagBoxContentProps) => {
  const { prevStep, resetForm, isLoading, setIsLoading, formData } =
    useFormContext();
  const { addCard, cards } = useBookmarks();

  const handleSaveBtn = () => {
    setIsLoading(true);
    const newId = cards.length > 0 ? cards[cards.length - 1].id + 1 : 1;
    const newCard: Card = {
      id: newId,
      title: formData.title,
      icon: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${formData.url}/&size=32`,
      path: formData.url,
      des: formData.description,
      tags: formData.tags.map((tag) => ({
        id: tag.toLowerCase(),
        name: tag,
      })),
    };

    addCard(newCard);
    toast.success("Bookmark Added");

    setTimeout(() => {
      setIsLoading(false);
      resetForm();
    }, 2000);
  };

  return (
    <>
      <div className={cn("px-4 py-6 sm:p-8", className)}>
        <TagBox tag={tag} />
      </div>

      {!actionBtns && (
        <ActionBtns
          prevBtnClick={prevStep}
          showSaveBtn
          nextBtnClick={handleSaveBtn}
          loading={isLoading}
        />
      )}
    </>
  );
};

export default TagBoxContent;
