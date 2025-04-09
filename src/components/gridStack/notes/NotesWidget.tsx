import { PlusIcon } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";

interface Note {
  id: number;
  title: string;
  date: string;
  color: string;
}

interface NotesWidgetProps {
  notes: Note[];
}

export default function NotesWidget({ notes }: NotesWidgetProps) {
  return (
    <div className='w-full h-full shadow-sm bg-card  rounded-3xl overflow-hidden'>
      <div className='py-4 px-5 flex flex-row items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h2 className='text-xl font-medium text-amber-700'>Notes</h2>
          <span className='text-sm text-foreground opacity-80'>
            {notes.length}
          </span>
        </div>
        <button className='text-amber-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-hover transition-colors duration-200'>
          <PlusIcon className='h-5 w-5' />
          <span className='sr-only'>Add note</span>
        </button>
      </div>

      <div className='p-0'>
        <ScrollArea className=' h-[calc(3*5rem)] '>
          {notes.map((note) => (
            <div
              key={note.id}
              className='flex items-start px-5 py-4 hover:bg-hover transition-colors duration-200 cursor-pointer'
            >
              <div
                className={`w-1.5 self-stretch rounded-full mr-3 ${
                  note.color === "orange"
                    ? "bg-orange-400"
                    : note.color === "green"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              />
              <div>
                <h3 className='font-medium text-base'>{note.title}</h3>
                <p className='text-gray-500'>{note.date}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
