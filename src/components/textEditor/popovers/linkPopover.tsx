"use client";

import type { Editor } from "@tiptap/react";
import { LinkIcon, Unlink } from "lucide-react";
import Button from "@/components/ui/my-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LinkPopoverProps {
  editor: Editor;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  setLink: () => void;
}

export default function LinkPopover({
  editor,
  linkUrl,
  setLinkUrl,
  setLink,
}: LinkPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className={cn(
            editor.isActive("link") ? "bg-btn-hover" : "bg-transparent ",
            "shadow-none h-[40px] w-[40px] ring-0"
          )}
          title='Add Link'
        >
          <LinkIcon className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[22rem]'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Insert Link</h4>
          </div>
          <div className='grid gap-2'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='link-url'>URL</label>
              <input
                id='link-url'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder='https://example.com'
                className='col-span-2 input'
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setLink();
                  }
                }}
              />
            </div>
            <div className='flex justify-between mt-3'>
              <Button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run()
                }
                disabled={!editor.isActive("link")}
              >
                <Unlink className='h-4 w-4 mr-2' />
                Remove Link
              </Button>
              <Button
                onClick={setLink}
                className='bg-brand text-white hover:bg-brand-hover ring-0 '
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
