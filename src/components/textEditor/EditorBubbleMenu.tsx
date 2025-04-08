"use client";

import { BubbleMenu } from "@tiptap/react";
import Button from "@/components/ui/my-button";
import { cn } from "@/lib/utils";
import { Bold, Italic, UnderlineIcon, LinkIcon, Unlink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEditorContext } from "@/context/EditorContext";

export default function EditorBubbleMenu() {
  const { editor, linkUrl, setLinkUrl } = useEditorContext();
  const setLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const url =
      !linkUrl.startsWith("http") &&
      !linkUrl.startsWith("/") &&
      !linkUrl.startsWith("#")
        ? `https://${linkUrl}`
        : linkUrl;

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkUrl("");
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ from, to }) => {
        return from !== to;
      }}
    >
      <div className='flex items-center rounded-md border bg-background shadow-md'>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            editor.isActive("bold") ? "bg-hover" : "bg-transparent",
            "rounded-none h-[40px] w-[40px] shadow-none ring-0"
          )}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            editor.isActive("italic") ? "bg-hover" : "bg-transparent",
            "rounded-none h-[40px] w-[40px] shadow-none ring-0"
          )}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            editor.isActive("underline") ? "bg-hover" : "bg-transparent",
            "rounded-none h-[40px] w-[40px] shadow-none ring-0"
          )}
        >
          <UnderlineIcon className='h-4 w-4' />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                editor.isActive("link") ? "bg-hover" : "bg-transparent",
                "rounded-none h-[40px] w-[40px] shadow-none ring-0"
              )}
            >
              <LinkIcon className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <label htmlFor='bubble-link-url' className='text-right'>
                    URL
                  </label>
                  <input
                    id='bubble-link-url'
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
                <div className='flex justify-between'>
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
                    Remove
                  </Button>
                  <Button onClick={setLink}>Apply</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </BubbleMenu>
  );
}
