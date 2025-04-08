import type { ReactNode } from "react";

interface ToolbarButtonGroupProps {
  children: ReactNode;
}

export default function ToolbarButtonGroup({
  children,
}: ToolbarButtonGroupProps) {
  return <div className='flex items-center'>{children}</div>;
}
