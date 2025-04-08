"use client";

import type { Editor } from "@tiptap/react";
import { Palette } from "lucide-react";
import Button from "@/components/ui/my-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPopoverProps {
  editor: Editor;
}

export default function ColorPopover({ editor }: ColorPopoverProps) {
  const colors = [
    "#000000",
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
    "#f97316",
    "#eab308",
    "#14b8a6",
    "#64748b",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          title='Text Color'
          className='bg-transparent h-[40px] w-[40px] shadow-none ring-0'
        >
          <Palette className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Text Color</h4>
            <div className='grid grid-cols-5 gap-2'>
              {colors.map((color) => (
                <button
                  key={color}
                  className='w-8 h-8 rounded-md border'
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
