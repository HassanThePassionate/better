"use client";

import type React from "react";

import type { RefObject } from "react";
import { ImageIcon, Upload } from "lucide-react";
import Button from "@/components/ui/my-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ImagePopoverProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  addImage: () => void;
  triggerImageUpload: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImagePopover({
  imageUrl,
  setImageUrl,
  addImage,
  triggerImageUpload,
  fileInputRef,
  handleImageUpload,
}: ImagePopoverProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button
            title='Insert Image'
            className='bg-transparent h-[40px] w-[40px] shadow-none ring-0'
          >
            <ImageIcon className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[22rem]'>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <h4 className='font-medium leading-none'>Insert Image</h4>
            </div>
            <div className='grid gap-2'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='image-url'>Image URL</label>
                <input
                  id='image-url'
                  value={imageUrl}
                  className='input'
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder='https://example.com/image.jpg'
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
              </div>
              <div className='flex justify-between items-center mt-2'>
                <Button
                  onClick={triggerImageUpload}
                  className='flex items-center gap-2'
                >
                  <Upload className='h-4 w-4' />
                  Upload from Computer
                </Button>
                <Button
                  onClick={addImage}
                  className='bg-brand text-white hover:bg-brand-hover ring-0 '
                >
                  Insert URL
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        className='hidden input'
      />
    </>
  );
}
