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
    { id: 0, width: 4, height: 3, type: "calender" },
    { id: 1, width: 2, height: 2, type: "chart" },
    { id: 2, width: 2, height: 2, type: "clock" },
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
                onClick={() => addWidget(4, 3, "calender")}
                className='focus:bg-background'
              >
                Calender
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(1, 1, "stats")}
                className='focus:bg-background'
              >
                Stats
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(2, 2, "clock")}
                className='focus:bg-background'
              >
                Clock
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(2, 2, "chart")}
                className='focus:bg-background'
              >
                Chart
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(2, 2, "sm-calender")}
                className='focus:bg-background'
              >
                Small Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(3, 1, "notebook")}
                className='focus:bg-background'
              >
                NoteBook
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => addWidget(3, 1, "todo")}
                className='focus:bg-background'
              >
                Todo
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
