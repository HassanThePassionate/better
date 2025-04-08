"use client";

interface FolderItemProps {
  folder: string;
  onSelect: (folder: string) => void;
}

export function FolderItem({ folder, onSelect }: FolderItemProps) {
  return (
    <div
      className='flex items-center justify-between relative w-full cursor-pointer hover:bg-hover text-text rounded-sm py-1.5 px-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group'
      onClick={() => onSelect(folder)}
    >
      <span>{folder}</span>
    </div>
  );
}
