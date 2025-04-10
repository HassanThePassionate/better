"use client";

import type React from "react";

import SidebarItem from "@/components/homeSidebar/SidebarItem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colors } from "@/constant/CardColor";
import { Check } from "lucide-react";
import { IoColorPaletteSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useEditorContext } from "@/context/EditorContext";

interface CardColorSelectionProps {
  noteId: number;
}

const CardColorSelection = ({ noteId }: CardColorSelectionProps) => {
  const { filteredNotes, setNoteColor } = useEditorContext();

  // Find the current note to get its color
  const currentNote = filteredNotes.find((note) => note.id === noteId);
  const noteColor = currentNote?.color || "";

  const [inputColor, setInputColor] = useState(noteColor);

  // Update input color when note color changes
  useEffect(() => {
    setInputColor(noteColor);
  }, [noteColor]);

  const handleColorChange = (color: string) => {
    setNoteColor(noteId, color);
    setInputColor(color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNoteColor(noteId, inputColor);
  };

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <SidebarItem
          icon={
            <span className='opacity-0 group-hover:opacity-100 transition duration-200 flex rounded-[10px] items-center gap-2 bg-badge text-sm justify-center h-[36px] w-[36px] hover:opacity-80 mt-1'>
              <IoColorPaletteSharp size={20} />
            </span>
          }
          tooltip='Background'
          className='h-[36px] w-[36px]'
          side='top'
        />
      </PopoverTrigger>
      <PopoverContent className='shadow-md bg-background max-w-[250px] p-3'>
        <div className='flex flex-wrap gap-3 rounded-md'>
          {colors.map((color) => (
            <button
              type='button'
              key={color.value}
              className='relative w-[26px] h-[26px] rounded-md border-2 border-border flex items-center justify-center focus:outline-none'
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              aria-label={`Select ${color.label} color`}
            >
              {noteColor === color.value && (
                <Check
                  className={`h-4 w-4 ${
                    color.value === "#ffffff" ? "text-black" : "text-black"
                  }`}
                />
              )}
            </button>
          ))}
          <form onSubmit={handleSubmit} className='w-full'>
            <input
              type='text'
              name='color'
              id='color'
              value={inputColor}
              onChange={handleColorInput}
              className='input rounded'
            />
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CardColorSelection;
