"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Check, Plus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Task = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
};

type WidgetSize = "small" | "large";
type FilterType = "all" | "pending" | "completed";

export default function Widgets({ size = "small" }: { size?: WidgetSize }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Borrow Sarah's travel guide",
      category: "Road Trip",
      completed: false,
    },
    {
      id: "2",
      title: "Finish expense report",
      category: "Work",
      completed: false,
    },
    {
      id: "3",
      title: "Review quarterly data with Olivia",
      category: "Prepare Presentation",
      completed: false,
    },
    { id: "4", title: "Call dentist", category: "Health", completed: false },
    { id: "5", title: "Buy groceries", category: "Home", completed: false },
    {
      id: "6",
      title: "Schedule team meeting",
      category: "Work",
      completed: false,
    },
    {
      id: "7",
      title: "Update portfolio website",
      category: "Personal",
      completed: true,
    },
    { id: "8", title: "Pay utility bills", category: "Home", completed: true },
    {
      id: "9",
      title: "Book flight tickets",
      category: "Travel",
      completed: true,
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        category: newTaskCategory.trim() || "General",
        completed: false,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
      setNewTaskCategory("");
      setIsAddDialogOpen(false);
    }
  };

  const handleAddButtonClick = () => {
    setIsAddDialogOpen(true);
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter === activeFilter ? "all" : filter);
  };

  // Determine which tasks to display based on the active filter
  const displayPendingTasks =
    activeFilter === "all" || activeFilter === "pending";
  const displayCompletedTasks =
    activeFilter === "all" || activeFilter === "completed";

  // Determine sizes based on widget size
  const isSmall = size === "small";

  return (
    <>
      <div
        className={cn(
          "bg-card backdrop-blur-sm p-4 rounded-3xl shadow-sm border-0 relative overflow-hidden h-full w-full flex flex-col "
        )}
      >
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <Star
              className={cn(
                "fill-yellow-400 text-yellow-400",
                isSmall ? "h-4 w-4" : "h-5 w-5"
              )}
            />
            <h2 className={cn("font-bold", isSmall ? "text-base" : "text-xl")}>
              Today
            </h2>
            {activeFilter !== "all" && (
              <Button
                variant='ghost'
                size='icon'
                className={cn("p-0", isSmall ? "h-4 w-4" : "h-5 w-5")}
                onClick={() => setActiveFilter("all")}
              >
                <X className={isSmall ? "h-2 w-2" : "h-3 w-3"} />
              </Button>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <button
                className={cn(
                  "rounded-full px-2 py-0.5 transition-colors",
                  isSmall ? "text-[10px]" : "text-xs",
                  activeFilter === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                )}
                onClick={() => handleFilterClick("pending")}
              >
                {pendingTasks.length} pending
              </button>
              <button
                className={cn(
                  "rounded-full px-2 py-0.5 transition-colors",
                  isSmall ? "text-[10px]" : "text-xs",
                  activeFilter === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                )}
                onClick={() => handleFilterClick("completed")}
              >
                {completedTasks.length} completed
              </button>
            </div>
          </div>
        </div>

        <ScrollArea className={cn("pr-4 h-full")}>
          {pendingTasks.length > 0 && displayPendingTasks && (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <h3
                  className={cn(
                    "font-medium text-gray-500",
                    isSmall ? "text-[10px]" : "text-xs"
                  )}
                >
                  PENDING
                </h3>
              </div>
              <div className={cn("space-y-3 mb-4", isSmall && "space-y-2")}>
                {pendingTasks.map((task) => (
                  <div key={task.id} className='flex items-start gap-3'>
                    <div
                      className={cn(
                        "rounded-full border border-gray-300 flex-shrink-0 cursor-pointer flex items-center justify-center",
                        isSmall ? "w-4 h-4 mt-0.5" : "w-5 h-5 mt-1"
                      )}
                      onClick={() => toggleTaskCompletion(task.id)}
                    />
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isSmall ? "text-sm" : "text-base"
                        )}
                      >
                        {task.title}
                      </p>
                      <p
                        className={cn(
                          "text-gray-400",
                          isSmall ? "text-xs" : "text-sm"
                        )}
                      >
                        {task.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {completedTasks.length > 0 && displayCompletedTasks && (
            <>
              {pendingTasks.length > 0 && displayPendingTasks && (
                <Separator className='my-3' />
              )}
              <div className='flex items-center gap-2 mb-2'>
                <h3
                  className={cn(
                    "font-medium text-gray-500",
                    isSmall ? "text-[10px]" : "text-xs"
                  )}
                >
                  COMPLETED
                </h3>
              </div>
              <div className={cn("space-y-3", isSmall && "space-y-2")}>
                {completedTasks.map((task) => (
                  <div key={task.id} className='flex items-start gap-3'>
                    <div
                      className={cn(
                        "rounded-full border border-green-500 bg-green-500 flex-shrink-0 cursor-pointer flex items-center justify-center",
                        isSmall ? "w-4 h-4 mt-0.5" : "w-5 h-5 mt-1"
                      )}
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <Check
                        className={
                          isSmall ? "h-2 w-2 text-white" : "h-3 w-3 text-white"
                        }
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-medium line-through text-gray-400",
                          isSmall ? "text-sm" : "text-base"
                        )}
                      >
                        {task.title}
                      </p>
                      <p
                        className={cn(
                          "text-gray-400",
                          isSmall ? "text-xs" : "text-sm"
                        )}
                      >
                        {task.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeFilter !== "all" && (
            <div className='flex justify-center mt-4'>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  "text-gray-500",
                  isSmall ? "text-[10px]" : "text-xs"
                )}
                onClick={() => setActiveFilter("all")}
              >
                Show all tasks
              </Button>
            </div>
          )}
        </ScrollArea>

        <Button
          className={cn(
            "absolute bottom-4 right-4 rounded-full bg-blue-500 hover:bg-blue-600 p-0 shadow-md",
            isSmall ? "h-10 w-10" : "h-12 w-12"
          )}
          size='icon'
          onClick={handleAddButtonClick}
        >
          <Plus
            className={isSmall ? "h-5 w-5 text-white" : "h-6 w-6 text-white"}
          />
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label htmlFor='task-title'>Task</label>
              <input
                id='task-title'
                placeholder='Enter task title'
                value={newTaskTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewTaskTitle(e.target.value)
                }
                className='rounded-xl input'
                autoFocus
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='task-category'>Category</label>
              <input
                id='task-category'
                placeholder='Enter category (optional)'
                value={newTaskCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewTaskCategory(e.target.value)
                }
                className='rounded-xl input'
              />
            </div>
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-blue-500 hover:bg-blue-600'
              onClick={addTask}
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
