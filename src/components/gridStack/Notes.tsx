import { BookOpen } from "lucide-react";

interface NotebookWidgetProps {
  count: number;
}

export default function NotebookWidget({ count }: NotebookWidgetProps) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center py-8 shadow-md'>
      <div className='bg-gray-100 rounded-full p-6 mb-4'>
        <BookOpen className='h-12 w-12 text-amber-700' />
      </div>
      <div className='text-center p-0'>
        <h2 className='text-2xl font-medium text-amber-700 mb-1'>Notebook</h2>
        <div className='flex items-baseline justify-center gap-2'>
          <span className='text-4xl font-bold text-amber-800'>{count}</span>
          <span className='text-gray-500'>records</span>
        </div>
      </div>
    </div>
  );
}
