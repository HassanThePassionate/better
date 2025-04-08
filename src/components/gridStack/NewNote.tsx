import { ChevronRight } from "lucide-react";

interface Note {
  id: number;
  title: string;
  date: string;
  color: string;
}

interface NewNoteWidgetProps {
  notes: Note[];
}

export default function NewNoteWidget({ notes }: NewNoteWidgetProps) {
  return (
    <div className='w-full overflow-hidden shadow-md'>
      <div className='pb-3 bg-white'>
        <div className='flex items-center justify-between'>
          <h4 className='text-xl font-medium text-amber-700'>New note</h4>
          <ChevronRight className='h-5 w-5 text-amber-700' />
        </div>
      </div>
      <div className='p-0'>
        <div className='divide-y'>
          {notes.map((note) => (
            <div
              key={note.id}
              className='flex items-start p-4 hover:bg-amber-50 transition-colors'
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
                <h3 className='font-medium'>{note.title}</h3>
                <p className='text-sm text-gray-500'>{note.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
