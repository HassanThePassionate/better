"use client";

import PasteLinkInput from "@/components/addNewCard/PasteLinkInput";
import TagBoxContent from "@/components/addNewCard/TagBoxContent";
import TextBoxInputs from "@/components/addNewCard/TextBoxInputs";
import EditActionBtns from "@/components/EditActionBtns";
import { Edit } from "lucide-react";
import SelectFolder from "@/components/addNewFolder/SelectFolder";
import { useBookmarks } from "@/context/BookmarkContext";

import type { Card } from "@/types/TabCardType";
import { toast } from "react-toastify";
import { useFormContext } from "@/context/from-Context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageContext } from "@/context/PageContext";

interface EditBookmarkProps {
  activeTabData?: Card;
}

const EditBookmark = ({ activeTabData }: EditBookmarkProps) => {
  const { resetForm, setIsLoading, formData } = useFormContext();
  formData.title = activeTabData?.title || formData.title;
  formData.description = activeTabData?.des || formData.description;
  formData.url = activeTabData?.path || formData.url;
  const { updateCard } = useBookmarks();
  const { page } = usePageContext();
  const handleSaveBtn = () => {
    if (!activeTabData) return;

    setIsLoading(true);

    const updatedCard: Card = {
      ...activeTabData,
      title: formData.title || activeTabData.title,
      path: formData.url || activeTabData.path,
      des: formData.description || activeTabData.des || "",
      tags:
        formData.tags.length > 0
          ? formData.tags.map((tag) => ({
              id: tag.toLowerCase(),
              name: tag,
            }))
          : activeTabData.tags,
      icon:
        formData.url !== activeTabData.path
          ? `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${formData.url}/&size=32`
          : activeTabData.icon,
    };

    updateCard(updatedCard);
    toast.success("Bookmark Updated");

    setTimeout(() => {
      setIsLoading(false);
      resetForm();
    }, 2000);
  };

  return (
    <>
      <div className='flex items-center justify-between min-h-[72px] px-6'>
        <h2 className='text-xl font-semibold leading-7 flex items-center gap-3 text-text'>
          <Edit className='h-5 w-5' />
          Edit Bookmark
        </h2>
      </div>
      <div className='px-6 pb-2'>
        <Tabs defaultValue='meta' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-4 bg-hover'>
            <TabsTrigger value='meta'>Meta</TabsTrigger>
            <TabsTrigger value='tags'>Tags</TabsTrigger>
          </TabsList>

          <TabsContent value='meta'>
            {page !== "extensions" && (
              <PasteLinkInput
                actionBtns
                className='sm:px-0 sm:pb-0 sm:pt-2'
                notAllowTitle
              />
            )}

            <TextBoxInputs
              actionBtns
              className='sm:px-0 sm:py-0 sm:pt-2'
              notAllowTitle
            />
            <SelectFolder
              triggerClassName='!font-normal w-full rounded-none rounded focus:ring-brand focus:ring-2 text-sm text-text font-medium border-border border w py-1.5 px-3 outline-none bg-searchbar'
              className='mx-0'
              popoverClassName='max-w-[500px] bg-searchbar'
            />
          </TabsContent>

          <TabsContent value='tags'>
            <TagBoxContent
              actionBtns
              className='sm:px-0 sm:pt-2'
              tag={activeTabData?.tags}
            />
          </TabsContent>
        </Tabs>

        <div className='h-4'></div>
        <EditActionBtns savBtnAction={handleSaveBtn} />
      </div>
    </>
  );
};

export default EditBookmark;
