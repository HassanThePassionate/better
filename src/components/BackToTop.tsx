"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./ui/my-button";

interface BackToTopContainerProps {
  threshold?: number;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  height?: string;
}

export function BackToTopContainer({
  threshold = 10,
  className,
  containerClassName,
  children,
  height = "900px",
}: BackToTopContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const toggleVisibility = () => {
      if (container.scrollTop > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    container.addEventListener("scroll", toggleVisibility);
    toggleVisibility();
    return () => container.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className=' block lg:grid lg:col-span-2 lg:grid-cols-subgrid   overflow-y-auto no-scrollbar lg:overflow-y-scroll overflow-x-hidden grow pb-4 lg:pb-6 max-lg:pl-[100px] max-sm:pl-[80px] max-lg:pt-2'>
      <div
        ref={containerRef}
        className={cn(
          "  no-scrollbar block lg:grid lg:col-span-2 lg:grid-cols-subgrid   overflow-y-auto no-scrollbar lg:overflow-y-scroll overflow-x-hidden grow pb-4 lg:pb-6 max-lg:pl-0 max-sm:pl-0 max-lg:pt-2",
          containerClassName
        )}
        style={{ height }}
      >
        {children}
      </div>

      <div
        className={cn(
          "sticky bottom-4 right-0 w-full justify-end z-10  transition-all duration-300 ml-[80px] h-12 flex items-center  !p-0 ",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none",
          className
        )}
      >
        <div className='flex justify-end ml-[80px] w-full'>
          <Button
            onClick={scrollToTop}
            aria-label='Back to top'
            className='h-12 w-12 rounded-full !p-0 flex items-center justify-center ring-0 '
          >
            <ArrowUp className='h-5 w-5' />
            <span className='sr-only'>Back to top</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
