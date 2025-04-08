"use client";

import { exeFilter } from "@/constant/ExeFilter";
import Badge from "../ui/Badge";
import { useExtensionContext } from "@/context/ExtensionContext";

const ExtensionFilter = () => {
  const { activeFilter, setActiveFilter } = useExtensionContext();

  return (
    <div className='flex'>
      {exeFilter.map((item, i) => (
        <Badge
          key={i}
          text={item.label}
          onClick={() => setActiveFilter(item.value)}
          active={activeFilter === item.value}
          className='text-sm font-semibold  disabled:cursor-not-allowed whitespace-nowrap flex items-center h-8 px-4 py-0.5 mr-2 rounded-[20px]   relative  '
        />
      ))}
    </div>
  );
};

export default ExtensionFilter;
