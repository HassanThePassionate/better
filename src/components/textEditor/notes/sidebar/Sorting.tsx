"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { useEditorContext } from "@/context/EditorContext";
import SidebarItem from "@/components/homeSidebar/SidebarItem";
import SortIcon from "@/components/svgs/SortIcon";

type SortField = "title" | "dateUpdated" | "dateCreated";
type SortDirection = "asc" | "desc";

export function Sorting() {
  const { filteredNotes, setNotes } = useEditorContext();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = "asc";

    if (sortField === field) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
    } else {
      setSortField(field);
      newDirection = "asc";
      setSortDirection(newDirection);
    }

    if (!filteredNotes) return;

    const sortedNotes = [...filteredNotes].sort((a, b) => {
      if (field === "title") {
        return newDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (field === "dateUpdated") {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return newDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (field === "dateCreated") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return newDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    if (setNotes) {
      setNotes(sortedNotes);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SidebarItem
          icon={<SortIcon />}
          tooltip='Sort options'
          className='text-text opacity-60 hover:opacity-100 !p-0 rounded h-6 w-6 '
          side='top'
          tooltipClassName='!text-xs py-[3px] px-1.5 font-medium '
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[183px] p-2 '>
        <DropdownMenuLabel className='text-[10px] uppercase text-text'>
          Sort by
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='flex items-center justify-between w-full text-sm'
            onClick={() => handleSort("title")}
          >
            <span className='text-sm text-text'>Title</span>
            <div className='flex'>
              <IoIosArrowRoundUp
                size={16}
                className={`-mr-2 ${
                  sortField === "title" && sortDirection === "asc"
                    ? "text-brand"
                    : ""
                }`}
              />
              <IoIosArrowRoundDown
                size={16}
                className={
                  sortField === "title" && sortDirection === "desc"
                    ? "text-brand"
                    : ""
                }
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-text flex items-center justify-between'
            onClick={() => handleSort("dateUpdated")}
          >
            <span>Date Updated</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-text flex items-center justify-between'
            onClick={() => handleSort("dateCreated")}
          >
            <span>Date Created</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
