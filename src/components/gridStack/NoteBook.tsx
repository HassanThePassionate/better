import { Pencil } from "lucide-react";

export default function Notebook() {
  return (
    <>
      <div className=' bg-card rounded-xl h-full  flex justify-center '>
        <div className='flex items-center gap-3 w-full px-4 py-3  transition-colors'>
          <div className='w-10 h-10 bg-background border-border rounded-full flex items-center justify-center'>
            <Pencil className='w-5 h-5 ' />
          </div>
          <div className='text-left'>
            <h3 className='text-text font-medium text-base'>Notebook</h3>
            <p className='text-foreground text-sm'>New note &gt;&gt;</p>
          </div>
        </div>
      </div>
    </>
  );
}
