import DocumentationIcon from "@/components/svgs/DocumentationIcon";
import ExistIcon from "@/components/svgs/ExistIcon";
import NoteIcon from "@/components/svgs/NoteIcon";
import BookmarksIcon from "@/components/svgs/BookmarksIcon";
import { HistoryIcon } from "lucide-react";
import PuzzleIcon from "@/components/svgs/PuzzleIcon";
import DownloadIcon from "@/components/svgs/DownloadIcon";

export const sidebarData = [
  {
    icon: <BookmarksIcon />,
    tooltip: "Bookmarks",
    link: "bookmarks",
  },
  {
    icon: <HistoryIcon />,
    tooltip: "History",
    link: "history",
  },
  {
    icon: <PuzzleIcon />,
    tooltip: "Extensions",
    link: "extensions",
  },
  {
    icon: <DownloadIcon />,
    tooltip: "Downloads",
    link: "downloads",
  },
  {
    icon: <NoteIcon />,
    tooltip: "Notes",
    link: "notes",
  },
];
export const sidebarDataBottom = [
  {
    icon: <DocumentationIcon />,
    tooltip: "Documentation",
    link: "grid",
  },
  {
    icon: <ExistIcon />,
    tooltip: "Logout",
    link: "logout",
  },
];
