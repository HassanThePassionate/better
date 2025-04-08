import { FiMoon } from "react-icons/fi";

import { useState } from "react";
import HoursBall from "./HoursBall";

const HoursBalls = () => {
  const hours = [
    11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 7, 6, 5, 2, 1, 12,
  ];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const disabledIndexes = [4, 5, 7, 10, 12, 16, 20];

  const handleSelectedItem = (index: number) => {
    if (!disabledIndexes.includes(index)) {
      setSelectedIndex(index);
    }
  };

  return (
    <div
      className='flex items-center justify-between gap-3 mt-6  overflow-x-auto no-scrollbar
    '
    >
      <FiMoon size={18} />
      <div className='flex items-center gap-1.5'>
        {hours.map((hour, index) => (
          <HoursBall
            key={index}
            text={hour}
            isDisabled={disabledIndexes.includes(index)}
            isSelected={selectedIndex === index}
            onSelect={() => handleSelectedItem(index)}
          />
        ))}
      </div>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='18px'
        height='18px'
        viewBox='0 -960 960 960'
        fill='currentColor'
      >
        <path d='M480-280q-83 0-141.5-58.5T280-480t58.5-141.5T480-680t141.5 58.5T680-480t-58.5 141.5T480-280M200-440H40v-80h160zm720 0H760v-80h160zM440-760v-160h80v160zm0 720v-160h80v160zM256-650l-101-97 57-59 96 100zm492 496-97-101 53-55 101 97zm-98-550 97-101 59 57-100 96zM154-212l101-97 55 53-97 101z'></path>
      </svg>
    </div>
  );
};

export default HoursBalls;
