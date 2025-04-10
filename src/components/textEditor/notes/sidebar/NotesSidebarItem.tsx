"use client";

import type React from "react";

import { useEditorContext } from "@/context/EditorContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import CardColorSelection from "./CardColorSelection";
import SidebarItem from "@/components/homeSidebar/SidebarItem";

interface Props {
  id: number;
  title: string;
  des: string;
  timestamp: string;
  cardView: boolean;
}

const removeHTMLTags = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const NotesSidebarItem = ({ title, des, id, timestamp, cardView }: Props) => {
  const { selectedNoteId, selectNote, deleteNote, filteredNotes } =
    useEditorContext();

  // Find the current note to get its color
  const currentNote = filteredNotes.find((note) => note.id === id);
  const noteColor = currentNote?.color || "";

  const selected = selectedNoteId === id;
  const handleClick = () => selectNote(id);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(id);
  };

  return (
    <button
      type='button'
      className={cn(
        `p-5 relative bg-card hover:bg-hover transition duration-200 group border border-border rounded-sm max-h-[150px] min-h-[136px] flex`,
        selected && `border border-brand`,
        cardView && "max-h-[280px] min-h-[260px] max-w-[164px] p-3"
      )}
      // Apply the note's specific color
      style={noteColor ? { backgroundColor: noteColor } : {}}
      onClick={handleClick}
    >
      <div className='flex gap-2 flex-col items-start w-full'>
        <div className='flex flex-col items-start gap-1'>
          <h4 className='text-sm font-medium text-text text-start max-w-[284px] line-clamp-2 overflow-hidden text-ellipsis'>
            {removeHTMLTags(title || "Untitled")}
          </h4>
          <div
            className={cn(
              "text-text opacity-70 text-left text-[13px] max-w-[272px] h-[40px] line-clamp-2 overflow-hidden text-ellipsis",
              cardView && "line-clamp-[7] h-[176px] max-w-[125px]"
            )}
          >
            {des === "Start writing..." || des === ""
              ? "Add Description"
              : removeHTMLTags(des)}
          </div>
        </div>
        <div className='flex items-center w-full justify-between gap-2'>
          <span className='text-text opacity-70 text-xs mt-1'>
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
          <div className='flex items-center gap-3'>
            <CardColorSelection noteId={id} />
            {filteredNotes.length > 1 && (
              <SidebarItem
                icon={
                  <span
                    className='hover:text-error h-[36px] w-[36px] bg-badge flex items-center justify-center rounded-[10px] opacity-0 group-hover:opacity-100 duration-200 transition'
                    onClick={handleDelete}
                  >
                    <Trash2 size={18} />
                  </span>
                }
                tooltip='Delete Note'
                className='h-[36px] w-[36px]'
                side='top'
              />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default NotesSidebarItem;
