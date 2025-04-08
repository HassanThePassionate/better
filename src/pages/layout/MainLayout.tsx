import Header from "@/components/header/Header";
import HomeSidebar from "@/components/homeSidebar/HomeSidebar";

import TopBar from "@/components/header/topbar/TopBar";
import { ThumbnailTogglerProvider } from "@/context/ThumbnailTogglerContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:grid lg:grid-cols-[1fr_minmax(20rem,48rem)_minmax(20rem,1fr)] lg:grid-rows-[auto_auto_1fr] relative h-screen w-screen bg-background ",
        className
      )}
    >
      <Header />
      <ThumbnailTogglerProvider>
        <TopBar />
        {children}
      </ThumbnailTogglerProvider>
      <HomeSidebar />
    </div>
  );
}
