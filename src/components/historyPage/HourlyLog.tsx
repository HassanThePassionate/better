"use client";

import ActionBtn from "./ActionBtn";
import AlertDialogBox from "@/modals/AlertDialogBox";

interface HourlyLogProps {
  specificTime?: string;
}

const HourlyLog = ({ specificTime }: HourlyLogProps) => {
  return (
    <div className='flex items-center justify-between pb-[13px] pt-2 max-lg:px-2'>
      <h4 className='text-xs font-bold'>{specificTime}</h4>
      <AlertDialogBox
        trigger={<ActionBtn text='Delete' />}
        className='p-0 text-delete-text'
      />
    </div>
  );
};

export default HourlyLog;
