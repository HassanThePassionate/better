"use client";

import { FolderItem } from "./SelectFolderItem";

interface FolderListProps {
  folders: string[];
  onSelect: (folder: string) => void;
}

export function FolderList({ folders, onSelect }: FolderListProps) {
  return (
    <div className='overflow-y-auto max-h-40 px-2 py-2 no-scrollbar'>
      {folders.length > 0 ? (
        folders.map((folder, index) => (
          <FolderItem key={index} folder={folder} onSelect={onSelect} />
        ))
      ) : (
        <div className='py-2 px-4 text-sm text-muted-foreground'>
          No folders found
        </div>
      )}
    </div>
  );
}
