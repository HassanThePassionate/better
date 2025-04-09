"use client";

import { Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allDayEvents } from "@/lib/calendar-utils";

export default function WideCalendar() {
  return (
    <>
      <div className='w-full h-full overflow-hidden rounded-2xl shadow-sm border-0 bg-card backdrop-blur-sm'>
        <div className='p-0 relative'>
          {/* Add button */}
          <div className='absolute top-3 right-3 z-10'>
            <Button
              variant='destructive'
              size='icon'
              className='h-7 w-7 rounded-full p-0 shadow-sm bg-error '
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex h-full'>
            {/* Left side - Date */}
            <div className='w-[90px] bg-hover flex flex-col items-center justify-center border-r border-border'>
              <h2 className='text-xs font-bold text-text-primary bg-error p-1 rounded-md'>
                MONDAY
              </h2>
              <span className='text-4xl font-bold mt-1'>22</span>
            </div>

            {/* Right side - Events */}
            <div className='flex-1 p-3 pt-2'>
              {/* All-day events summary */}
              <div className='mb-2 flex items-center'>
                <div className='bg-purple-500 text-text-primary text-xs px-2 py-0.5 rounded-md inline-block'>
                  2 all-day events
                </div>
                <span className='text-[10px] text-text ml-2'>All-Day</span>
              </div>

              {/* Events list */}
              <div className='space-y-2.5 mt-3'>
                {/* Product Sync */}
                <div className='flex items-center space-x-2'>
                  <div className='w-1 h-8 bg-brand rounded-full'></div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-medium'>
                        {allDayEvents[0].title}
                      </span>
                      <div className='flex items-center space-x-1 mt-2'>
                        <Video className='h-3 w-3 text-brand ' />
                      </div>
                    </div>
                    <span className='text-[9px] text-text'>
                      {allDayEvents[0].time}
                    </span>
                  </div>
                </div>

                {/* Marketing Meeting */}
                <div className='flex items-center space-x-2'>
                  <div className='w-1 h-8 bg-orange-500 rounded-full'></div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-medium'>
                        {allDayEvents[1].title}
                      </span>
                      <Video className='h-3 w-3 text-orange-500' />
                    </div>
                    <span className='text-[9px] text-text'>
                      {allDayEvents[1].time}
                    </span>
                  </div>
                </div>

                {/* Lunch */}
                <div className='flex items-center space-x-2'>
                  <div className='w-1 h-8 bg-green-500 rounded-full'></div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-medium'>
                        {allDayEvents[2].title}
                      </span>
                    </div>
                    <span className='text-[9px] text-text'>
                      {allDayEvents[2].time}
                    </span>
                  </div>
                </div>
              </div>

              {/* More events indicator */}
              <div className='absolute bottom-3 right-3'>
                <div className='bg-pink-100 text-pink-500 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm'>
                  +3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
