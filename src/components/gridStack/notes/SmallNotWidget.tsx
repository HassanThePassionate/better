import { PlusIcon } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";

interface Note {
  id: number;
  title: string;
  date: string;
  color: string;
}

interface SmallNotesWidgetProps {
  notes: Note[];
}

export default function SmallNotesWidget({ notes }: SmallNotesWidgetProps) {
  return (
    <div className='w-full h-full  shadow-sm bg-card border-0 rounded-2xl overflow-hidden'>
      <div className='py-2 px-3 flex flex-row items-center justify-between'>
        <div className='flex items-baseline gap-1.5'>
          <h2 className='text-sm font-medium text-amber-700'>Notes</h2>
          <span className='text-xs text-foreground opacity-75'>
            {notes.length}
          </span>
        </div>
        <button className='text-amber-700 w-6 h-6 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors duration-200'>
          <PlusIcon className='h-3.5 w-3.5' />
          <span className='sr-only'>Add note</span>
        </button>
      </div>

      <div className='p-0'>
        <ScrollArea className=' h-[calc(3*3.2rem)] '>
          {notes.map((note) => (
            <div
              key={note.id}
              className='flex items-start px-3 py-2 hover:bg-amber-50 transition-colors duration-200 cursor-pointer'
            >
              <div
                className={`w-1 self-stretch rounded-full mr-2 ${
                  note.color === "orange"
                    ? "bg-orange-400"
                    : note.color === "green"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              />
              <div>
                <h3 className='font-medium text-xs'>{note.title}</h3>
                <p className='text-gray-500 text-xs'>{note.date}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
