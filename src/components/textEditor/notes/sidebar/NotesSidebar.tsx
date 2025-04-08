import { useState } from "react";

import NotesSidebarHeader from "./NotesSidebarHeader";
import NotesSidebarItem from "./NotesSidebarItem";
import { cn } from "@/lib/utils";

import { useEditorContext } from "@/context/EditorContext";
import { CgNotes } from "react-icons/cg";

const NotesSidebar = () => {
  const { filteredNotes } = useEditorContext();
  const [cardView, setCardView] = useState(false);

  return (
    <div className='sm:w-[358px] sm:min-w-[280px] max-w-[358px]  lg:h-screen h-full bg-transparent  '>
      <NotesSidebarHeader setCardView={setCardView} />

      <div
        className={cn(
          "flex flex-col  py-1 px-4 gap-2 overflow-y-auto max-h-[290px] lg:max-h-[calc(100vh-100px)] pb-6 pt-1 no-scrollbar",
          cardView && "grid grid-cols-2"
        )}
      >
        {filteredNotes.map((note) => (
          <NotesSidebarItem
            cardView={cardView}
            key={note.id}
            id={note.id}
            title={note.title}
            des={note.des}
            timestamp={note.updatedAt}
          />
        ))}
        {filteredNotes.length === 0 && (
          <div className='flex justify-center items-center h-full text-text opacity-80 text-sm'>
            <CgNotes className='mr-1' /> No notes found
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSidebar;
