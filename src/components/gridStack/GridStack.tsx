"use client";

import { useEffect, useRef, useState } from "react";
import "gridstack/dist/gridstack.min.css";
import { GridStack } from "gridstack";
import Widget from "./Widget";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Maximize, Plus } from "lucide-react";

let count = 3;
let grid: GridStack;

export function GridStackComponent() {
  const [items, setItems] = useState([
    { id: 0, width: 3, height: 3, type: "large" },
    { id: 1, width: 3, height: 2, type: "small" },
    { id: 2, width: 3, height: 3, type: "notes" },
    { id: 3, width: 2, height: 2, type: "sm-notes" },
  ]);

  const itemsRef = useRef(new Map());

  function getMap() {
    return itemsRef.current;
  }

  function addWidget(width: number, height: number, type: string) {
    count++;
    setItems([...items, { id: count, width, height, type }]);

    setTimeout(() => {
      grid.makeWidget(getMap().get(count));
    }, 5);
  }
  const autoAdjustGrid = () => {
    if (!grid) return;
    grid.compact();
  };
  useEffect(() => {
    grid = GridStack.init({ float: true });
  }, []);

  return (
    <>
      <div className='w-full h-full ml-[65px]'>
        <div className='flex gap-2 mb-4 p-4 border-b border-border'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='hover:bg-hover '>
                <Plus className='mr-2 h-4 w-4' />
                Add New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-card'>
              <DropdownMenuItem
                onClick={() => addWidget(3, 2, "small")}
                className='focus:bg-background'
              >
                Small Widget 3x2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(3, 3, "large")}
                className='focus:bg-background'
              >
                Large Widget 3x3
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(3, 3, "notes")}
                className='focus:bg-background'
              >
                Larger Notes 3x3
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(2, 2, "sm-notes")}
                className='focus:bg-background'
              >
                Small Notes 2x2
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant='outline'
            className='hover:bg-hover'
            onClick={autoAdjustGrid}
          >
            <Maximize className='mr-2 h-4 w-4' />
            Auto Adjust
          </Button>
        </div>

        <div className='grid-stack overflow-y-auto max-h-[90vh] h-full !w-full mb-12'>
          {items.map((item) => (
            <div
              className='grid-stack-item  '
              gs-w={item.width.toString()}
              gs-h={item.height.toString()}
              key={item.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(item.id, node);
                } else {
                  map.delete(item.id);
                }
              }}
            >
              <div className='grid-stack-item-content'>
                <Widget type={item.type} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
