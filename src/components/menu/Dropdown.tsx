"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { SiGooglesheets } from "react-icons/si";
import { PiPresentationChartLight } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md";

const DocDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("doc");

  const items = [
    {
      id: "doc",
      icon: <HiOutlineDocumentAdd className='h-4 w-4' />,
      label: "Doc",
    },
    {
      id: "sheet",
      icon: <SiGooglesheets className='h-4 w-4' />,
      label: "Sheet",
    },
    {
      id: "slide",
      icon: <PiPresentationChartLight className='h-4 w-4' />,
      label: "Slide",
    },
    {
      id: "form",
      icon: <MdOutlineAssignment className='h-4 w-4' />,
      label: "Form",
    },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={toggleDropdown}
        className='text-sm opacity-80 text-text hover:opacity-100 font-medium px-3 py-2 rounded-md hover:bg-accent'
      >
        New doc
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 bg-white rounded-lg right-1 py-2 shadow-md border border-border min-w-[150px]'>
          {items.map((item) => (
            <button
              key={item.id}
              className='flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-hover font-medium rounded-md'
              onClick={() => handleItemClick(item.id)}
            >
              <div className='flex items-center gap-3'>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {selectedItem === item.id && (
                <Check className='h-4 w-4 text-primary' />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocDropdown;
