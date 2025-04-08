"use client";

import { useEffect, useState } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format date as MM/DD
  const dateString = `${String(time.getMonth() + 1).padStart(2, "0")}/${String(
    time.getDate()
  ).padStart(2, "0")}`;

  // Format time as HH:MM:SS
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  return (
    <div className='flex flex-col items-center justify-center bg-card h-full w-full   rounded-[10px]'>
      <div className='mb-2 flex justify-end w-full'>
        <div className='bg-background border border-border rounded px-3 py-1'>
          <p className='text-text text-sm font-mono'>{dateString}</p>
        </div>
      </div>

      <div className='bg-background border border-border rounded p-3 w-full mb-4 '>
        <div className='font-mono text-text text-2xl tabular-nums tracking-wider text-center'>
          {hours}:{minutes}:{seconds}
        </div>
      </div>
    </div>
  );
}
