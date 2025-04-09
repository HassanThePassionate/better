"use client";

import { Video } from "lucide-react";

import { allDayEvents } from "@/lib/calendar-utils";

export default function SmallCalendar() {
  return (
    <>
      <div className='w-full h-full overflow-hidden rounded-2xl shadow-sm border-0 bg-card backdrop-blur-sm'>
        <div className='p-0'>
          {/* iOS-style widget with glass morphism effect */}
          <div className='flex flex-col h-full relative'>
            {/* Widget header with date */}
            <div className='px-3 pt-3 pb-1 flex justify-between items-center'>
              <div className='flex flex-col'>
                <h2 className='text-xs font-bold text-error'>MONDAY</h2>
                <span className='text-2xl font-bold leading-tight'>22</span>
              </div>
              <div className='bg-purple-500 text-text-primary text-[10px] px-2 py-0.5 rounded-md font-medium'>
                2 all-day events
              </div>
            </div>

            {/* Divider */}
            <div className='w-full h-px bg-border my-1'></div>

            {/* Events list */}
            <div className='px-3 py-1 flex-1 overflow-hidden'>
              <div className='space-y-2'>
                {/* Product Sync */}
                <div className='flex items-center space-x-2'>
                  <div className='w-1 h-10 bg-brand rounded-full'></div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-medium'>
                        {allDayEvents[0].title}
                      </span>
                      <Video className='h-3 w-3 text-brand ' />
                    </div>
                    <span className='text-[9px] text-text'>
                      {allDayEvents[0].time}
                    </span>
                  </div>
                </div>

                {/* Marketing Meeting */}
                <div className='flex items-center space-x-2'>
                  <div className='w-1 h-10 bg-orange-500 rounded-full'></div>
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
                  <div className='w-1 h-10 bg-green-500 rounded-full'></div>
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
            </div>

            {/* More events indicator */}
            <div className='absolute bottom-2 right-3'>
              <div className='bg-pink-100 text-pink-500 text-[10px] font-medium px-2 py-0.5 rounded-full'>
                +3
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
