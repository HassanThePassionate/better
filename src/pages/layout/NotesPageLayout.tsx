import HomeSidebar from "@/components/homeSidebar/HomeSidebar";
import NotesPage from "@/components/textEditor/notes/NotesPage";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NotesPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function NotesPageLayout({
  className,
  children,
}: NotesPageLayoutProps) {
  return (
    <div className={cn("flex ", className)}>
      <HomeSidebar />
      <div className='flex ml-[64px] h-screen max-sm:flex-col pr-4'>
        <NotesPage />
        {children}
      </div>
    </div>
  );
}
