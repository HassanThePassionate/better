"use client";

import { FloatingMenu } from "@tiptap/react";
import Button from "@/components/ui/my-button";
import { cn } from "@/lib/utils";
import { Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { useEditorContext } from "@/context/EditorContext";

export default function EditorFloatingMenu() {
  const { editor } = useEditorContext();
  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ state }) => {
        const { selection } = state;
        const { empty, $anchor } = selection;
        return (
          empty &&
          $anchor.parent.type.name === "paragraph" &&
          $anchor.pos === $anchor.start()
        );
      }}
    >
      <div className='flex items-center rounded-md border bg-background shadow-md'>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 1 })
              ? "bg-hover"
              : "bg-transparent",
            "rounded-none h-[40px] w-[40px] ring-0"
          )}
        >
          <Heading1 className='h-4 w-4' />
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 2 })
              ? "bg-hover"
              : "bg-transparent",
            "rounded-none h-[40px] w-[40px] ring-0"
          )}
        >
          <Heading2 className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            editor.isActive("bulletList") ? "bg-hover" : "bg-transparent",
            "rounded-none"
          )}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            editor.isActive("orderedList") ? "bg-hover" : "bg-transparent",
            "rounded-none ring-0"
          )}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            editor.isActive("blockquote") ? "bg-hover" : "bg-transparent",
            "rounded-none ring-0"
          )}
        >
          <Quote className='h-4 w-4' />
        </Button>
      </div>
    </FloatingMenu>
  );
}
