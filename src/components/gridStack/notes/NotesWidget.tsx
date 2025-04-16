"use client";

import { PlusIcon } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { useEditorContext } from "@/context/EditorContext";
import { formatDistanceToNow } from "date-fns";

type Notes = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  des: string;
  color?: string;
}[];

interface NotesWidgetProps {
  notes: Notes;
}

export default function NotesWidget({ notes }: NotesWidgetProps) {
  const { addNewNote } = useEditorContext();

  return (
    <div className='w-full h-full shadow-sm bg-card rounded-3xl overflow-hidden'>
      <div className='py-4 px-5 flex flex-row items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h2 className='text-xl font-medium text-amber-700'>Notes</h2>
          <span className='text-sm text-foreground opacity-80'>
            {notes.length}
          </span>
        </div>
        <button
          className='text-amber-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-hover transition-colors duration-200'
          onClick={addNewNote}
        >
          <PlusIcon className='h-5 w-5' />
          <span className='sr-only'>Add note</span>
        </button>
      </div>

      <div className='p-0'>
        <ScrollArea className='h-[calc(3*5rem)] '>
          {notes.map((note) => (
            <div
              key={note.id}
              className='flex items-start px-5 py-4 hover:bg-hover transition-colors duration-200 cursor-pointer'
            >
              <div
                className='w-1.5 self-stretch rounded-full mr-3 bg-background'
                style={{ backgroundColor: note.color || "" }}
              />
              <div>
                <h3 className='font-medium text-base'>{note.title}</h3>
                <p className='text-gray-500'>
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
