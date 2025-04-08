"use client";

import { useHeaderContext } from "@/context/HeaderContext";
import ActionBtn from "./ActionBtn";

const ActionsBtns = () => {
  const { currentHeader } = useHeaderContext();

  return (
    <div className='w-full flex items-center justify-between my-4 flex-wrap gap-4 '>
      <p className='text-lg font-bold text-text'>
        {currentHeader.date} {currentHeader.time}
      </p>
      <div className='flex items-center gap-4 flex-wrap'>
        <ActionBtn
          text=' Export CSV'
          className='bg-export-bg text-export-text'
        />
        <ActionBtn
          text=' Export HTML'
          className='bg-export-bg text-export-text'
        />
        <ActionBtn
          text=' Delete Entire Date'
          className='bg-delete-bg text-delete-text'
        />
      </div>
    </div>
  );
};

export default ActionsBtns;
