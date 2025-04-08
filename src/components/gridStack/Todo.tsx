import { CheckSquare } from "lucide-react";

export default function TodoCard() {
  return (
    <div className='h-full w-full bg-card rounded-xl'>
      <div className='flex items-center  h-full gap-3  px-3 '>
        <div className='relative'>
          <div className='bg-background h-10 w-10  flex items-center justify-center rounded-lg'>
            <CheckSquare className='h-5 w-5 text-indigo-500' />
          </div>
          <div className='absolute -top-1 -right-1 bg-error text-text-primary text-xs rounded-full h-4 w-4 flex items-center justify-center'>
            1
          </div>
        </div>
        <div className='flex flex-col'>
          <span className='font-medium text-text text-base'>Todo</span>
          <span className='text-sm text-foreground'>New schedule &raquo;</span>
        </div>
      </div>
    </div>
  );
}
