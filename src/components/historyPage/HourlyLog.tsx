"use client";

import ActionBtn from "./ActionBtn";
import AlertDialogBox from "@/modals/AlertDialogBox";

interface HourlyLogProps {
  specificTime?: string;
  date?: string;
  id?: string | number;
}

const HourlyLog = ({ specificTime, date, id }: HourlyLogProps) => {
  return (
    <div>
      {id != 1 && <h4 className='pt-6  pb-4 text-xl font-bold'>{date}</h4>}

      <div className='flex items-center justify-between pb-[13px] pt-2 max-lg:px-2'>
        <h4 className='text-xs font-bold'>{specificTime}</h4>
        <AlertDialogBox
          trigger={<ActionBtn text='Delete' />}
          className='p-0 text-delete-text'
        />
      </div>
    </div>
  );
};

export default HourlyLog;
