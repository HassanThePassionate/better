"use client";

import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  MoreVertical,
  Plus,
  Search,
  Star,
  LucideTag,
  X,
  CalendarIcon,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Badge from "@/components/ui/Badge";

type Task = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  time?: string;
  date?: string;
  repeat?: string;
  tags?: string[];
};

type WidgetSize = "small" | "large";
type FilterType = "all" | "pending" | "completed";
type Category = {
  id: string;
  name: string;
};

type TagType = {
  id: string;
  name: string;
};

export default function Widgets({ size = "small" }: { size?: WidgetSize }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Go to the bank at 2pm",
      category: "Daily plan",
      completed: false,
      time: "14:00",
      date: "Today",
      repeat: "Does not repeat",
      tags: ["finance", "errands"],
    },
    {
      id: "2",
      title: "Date Henry at 7pm, don't be late",
      category: "Daily plan",
      completed: false,
      time: "19:00",
      date: "Today",
      tags: ["personal"],
    },
    {
      id: "3",
      title: "Review quarterly data with Olivia",
      category: "Work plan",
      completed: false,
      tags: ["work", "meeting"],
    },
    {
      id: "4",
      title: "Call dentist",
      category: "Personal",
      completed: false,
      tags: ["health"],
    },
    {
      id: "5",
      title: "Buy groceries",
      category: "Daily plan",
      completed: false,
      tags: ["shopping"],
    },
    {
      id: "6",
      title: "Schedule team meeting",
      category: "Work plan",
      completed: false,
      tags: ["work"],
    },
    {
      id: "7",
      title: "Update portfolio website",
      category: "Personal",
      completed: true,
      tags: ["personal", "tech"],
    },
    {
      id: "8",
      title: "Pay utility bills",
      category: "Daily plan",
      completed: true,
      tags: ["finance", "home"],
    },
    {
      id: "9",
      title: "Book flight tickets",
      category: "Personal",
      completed: true,
      tags: ["travel"],
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Daily plan" },
    { id: "2", name: "Work plan" },
    { id: "3", name: "Personal" },
  ]);

  const [tags, setTags] = useState<TagType[]>([
    { id: "1", name: "work" },
    { id: "2", name: "personal" },
    { id: "3", name: "finance" },
    { id: "4", name: "health" },
    { id: "5", name: "shopping" },
    { id: "6", name: "travel" },
    { id: "7", name: "meeting" },
    { id: "8", name: "tech" },
    { id: "9", name: "errands" },
    { id: "10", name: "home" },
  ]);

  // Add state for Plans filter and list/tag management
  // const [isPlansView, setIsPlansView] = useState(false);
  const [isRenameListDialogOpen, setIsRenameListDialogOpen] = useState(false);
  const [isRenameTagDialogOpen, setIsRenameTagDialogOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");
  const [newListNameForRename, setNewListNameForRename] = useState("");
  const [newTagNameForRename, setNewTagNameForRename] = useState("");
  const [repeatOption, setRepeatOption] = useState("Does not repeat");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isSetDueDateOpen, setIsSetDueDateOpen] = useState(false);
  const [isMoveToListOpen, setIsMoveToListOpen] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);

  const [newListName, setNewListName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Today");
  const [selectedTag, setSelectedTag] = useState("");

  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskCategory, setEditTaskCategory] = useState("");
  const [editTaskDate, setEditTaskDate] = useState("");
  const [editTaskTime, setEditTaskTime] = useState("");
  const [editTaskTags, setEditTaskTags] = useState<string[]>([]);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const newListInputRef = useRef<HTMLInputElement>(null);
  const newTagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddListDialogOpen && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddListDialogOpen]);

  useEffect(() => {
    if (isAddTagDialogOpen && newTagInputRef.current) {
      newTagInputRef.current.focus();
    }
  }, [isAddTagDialogOpen]);

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
        category: newTaskCategory.trim() || "Daily plan",
        completed: false,
        date: newTaskDate || undefined,
        time: newTaskTime || undefined,
        repeat: repeatOption !== "Does not repeat" ? repeatOption : undefined,
        tags: newTaskTags.length > 0 ? newTaskTags : undefined,
      };
      setTasks([newTask, ...tasks]);
      resetNewTaskForm();
    }
  };

  const resetNewTaskForm = () => {
    setNewTaskTitle("");
    setNewTaskCategory("");
    setNewTaskDate("");
    setNewTaskTime("");
    setNewTaskTags([]);
    setRepeatOption("Does not repeat");
    setIsAddDialogOpen(false);
  };

  const addList = () => {
    if (newListName.trim()) {
      const newList: Category = {
        id: Date.now().toString(),
        name: newListName.trim(),
      };
      setCategories([...categories, newList]);
      setNewListName("");
      setIsAddListDialogOpen(false);
    }
  };

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag: TagType = {
        id: Date.now().toString(),
        name: newTagName.trim().toLowerCase(),
      };
      setTags([...tags, newTag]);
      setNewTagName("");
      setIsAddTagDialogOpen(false);
    }
  };

  // Add these functions after the addTag function
  const renameList = () => {
    if (newListNameForRename.trim()) {
      setCategories(
        categories.map((category) =>
          category.id === selectedListId
            ? { ...category, name: newListNameForRename.trim() }
            : category
        )
      );
      setTasks(
        tasks.map((task) =>
          task.category ===
          categories.find((c) => c.id === selectedListId)?.name
            ? { ...task, category: newListNameForRename.trim() }
            : task
        )
      );
      setNewListNameForRename("");
      setIsRenameListDialogOpen(false);
    }
  };

  const deleteList = (id: string) => {
    const listToDelete = categories.find((c) => c.id === id);
    if (listToDelete) {
      // Move tasks from this list to "Daily plan" or first available list
      const defaultList =
        categories.find((c) => c.id !== id)?.name || "Daily plan";
      setTasks(
        tasks.map((task) =>
          task.category === listToDelete.name
            ? { ...task, category: defaultList }
            : task
        )
      );
      setCategories(categories.filter((category) => category.id !== id));
    }
  };

  const renameTag = () => {
    if (newTagNameForRename.trim()) {
      const oldTagName = tags.find((t) => t.id === selectedTagId)?.name;
      setTags(
        tags.map((tag) =>
          tag.id === selectedTagId
            ? { ...tag, name: newTagNameForRename.trim().toLowerCase() }
            : tag
        )
      );
      // Update all tasks that have this tag
      if (oldTagName) {
        setTasks(
          tasks.map((task) => {
            if (task.tags && task.tags.includes(oldTagName)) {
              return {
                ...task,
                tags: task.tags.map((t) =>
                  t === oldTagName
                    ? newTagNameForRename.trim().toLowerCase()
                    : t
                ),
              };
            }
            return task;
          })
        );
      }
      setNewTagNameForRename("");
      setIsRenameTagDialogOpen(false);
    }
  };

  const deleteTag = (id: string) => {
    const tagToDelete = tags.find((t) => t.id === id)?.name;
    if (tagToDelete) {
      // Remove this tag from all tasks
      setTasks(
        tasks.map((task) => {
          if (task.tags && task.tags.includes(tagToDelete)) {
            return {
              ...task,
              tags: task.tags.filter((t) => t !== tagToDelete),
            };
          }
          return task;
        })
      );
      setTags(tags.filter((tag) => tag.id !== id));
    }
  };

  const handleRenameList = (id: string) => {
    const list = categories.find((c) => c.id === id);
    if (list) {
      setSelectedListId(id);
      setNewListNameForRename(list.name);
      setIsRenameListDialogOpen(true);
    }
  };

  const handleRenameTag = (id: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      setSelectedTagId(id);
      setNewTagNameForRename(tag.name);
      setIsRenameTagDialogOpen(true);
    }
  };

  const editTask = () => {
    if (currentTask && editTaskTitle.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                title: editTaskTitle,
                category: editTaskCategory,
                date: editTaskDate || undefined,
                time: editTaskTime || undefined,
                tags: editTaskTags.length > 0 ? editTaskTags : undefined,
              }
            : task
        )
      );
      setIsEditTaskDialogOpen(false);
    }
  };

  const setTaskDueDate = () => {
    if (currentTask) {
      // Format the date for display
      let displayDate = editTaskDate;

      if (editTaskDate) {
        try {
          const date = new Date(editTaskDate);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          if (date.toDateString() === today.toDateString()) {
            displayDate = "Today";
          } else if (date.toDateString() === tomorrow.toDateString()) {
            displayDate = "Tomorrow";
          }
        } catch (e) {
          console.error(e);
          // If date parsing fails, use the original string
        }
      }

      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                date: displayDate || undefined,
                time: editTaskTime || undefined,
                repeat:
                  repeatOption !== "Does not repeat" ? repeatOption : undefined,
              }
            : task
        )
      );
      setIsSetDueDateOpen(false);
    }
  };

  const moveTaskToList = (categoryName: string) => {
    if (currentTask) {
      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                category: categoryName,
              }
            : task
        )
      );
      setIsMoveToListOpen(false);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const handleAddButtonClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleWidgetClick = () => {
    setIsDetailDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setEditTaskTitle(task.title);
    setEditTaskCategory(task.category);
    setEditTaskDate(task.date || "");
    setEditTaskTime(task.time || "");
    setEditTaskTags(task.tags || []);
    setIsEditTaskDialogOpen(true);
  };

  const handleSetDueDate = (task: Task) => {
    setCurrentTask(task);

    // If no date is set, default to today
    if (!task.date || task.date === "Today") {
      const today = new Date();
      setEditTaskDate(today.toISOString().split("T")[0]);
      setSelectedDate(today);
      setCurrentMonth(today);
    } else if (task.date === "Tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setEditTaskDate(tomorrow.toISOString().split("T")[0]);
      setSelectedDate(tomorrow);
      setCurrentMonth(tomorrow);
    } else {
      try {
        const date = new Date(task.date);
        setEditTaskDate(date.toISOString().split("T")[0]);
        setSelectedDate(date);
        setCurrentMonth(date);
      } catch (e) {
        console.error(e);
        // If parsing fails, default to today
        const today = new Date();
        setEditTaskDate(today.toISOString().split("T")[0]);
        setSelectedDate(today);
        setCurrentMonth(today);
      }
    }

    setEditTaskTime(task.time || "");
    setRepeatOption(task.repeat || "Does not repeat");
    setIsSetDueDateOpen(true);
  };

  const handleMoveToList = (task: Task) => {
    setCurrentTask(task);
    setIsMoveToListOpen(true);
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

  // Modify the filteredTasks to include Plans filter
  const filteredTasks = tasks.filter((task) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags &&
        task.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    // Filter by completion status
    const matchesCompletion = !hideCompleted || !task.completed;

    // Filter by category
    const matchesCategory =
      selectedCategory === "Today" || task.category === selectedCategory;

    // Filter by tag
    const matchesTag =
      selectedTag === "" || (task.tags && task.tags.includes(selectedTag));

    return matchesSearch && matchesCompletion && matchesCategory && matchesTag;
  });

  // Get counts for sidebar
  const getCategoryCount = (categoryName: string) => {
    return tasks.filter(
      (task) => !task.completed && task.category === categoryName
    ).length;
  };

  const getTagCount = (tagName: string) => {
    return tasks.filter(
      (task) => !task.completed && task.tags && task.tags.includes(tagName)
    ).length;
  };

  // Calendar navigation functions
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const setToCurrentDate = () => {
    const today = new Date();
    setEditTaskDate(today.toISOString().split("T")[0]);
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const setToCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setEditTaskTime(`${hours}:${minutes}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString === "Today" || dateString === "Tomorrow") return dateString;

    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
      }
    } catch (e) {
      return dateString;
      console.log(e);
    }
  };

  // Determine sizes based on widget size
  const isSmall = size === "small";

  return (
    <>
      <div
        className={cn(
          "bg-card backdrop-blur-sm p-4 rounded-2xl shadow-sm border-0 relative overflow-hidden cursor-pointer h-full w-full"
        )}
        onClick={handleWidgetClick}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilter("all");
                }}
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
                    ? "bg-brandtext-brand text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterClick("pending");
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterClick("completed");
                }}
              >
                {completedTasks.length} completed
              </button>
            </div>
          </div>
        </div>

        <ScrollArea className={cn("pr-4", isSmall ? "h-[90px]" : "h-[230px]")}>
          {pendingTasks.length > 0 && displayPendingTasks && (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <h3
                  className={cn(
                    "font-medium text-foreground",
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
                        "rounded-full border border-gray-300 flex-shrink-0 cursor-pointer flex items-center justify-center transition-colors hover:bg-gray-100 hover:border-brandtext-brand",
                        isSmall ? "w-4 h-4 mt-0.5" : "w-5 h-5 mt-1"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id);
                      }}
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
                          "text-foreground",
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
                    "font-medium text-foreground",
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id);
                      }}
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
                          "font-medium line-through text-foreground",
                          isSmall ? "text-sm" : "text-base"
                        )}
                      >
                        {task.title}
                      </p>
                      <p
                        className={cn(
                          "text-foreground",
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
                  "text-foreground",
                  isSmall ? "text-[10px]" : "text-xs"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilter("all");
                }}
              >
                Show all tasks
              </Button>
            </div>
          )}
        </ScrollArea>

        <Button
          className={cn(
            "absolute bottom-4 right-4 rounded-full bg-brand text-brand hover:bg-blue-600 p-0 shadow-md",
            isSmall ? "h-10 w-10" : "h-12 w-12"
          )}
          size='icon'
          onClick={(e) => {
            e.stopPropagation();
            handleAddButtonClick();
          }}
        >
          <Plus
            className={isSmall ? "h-5 w-5 text-white" : "h-6 w-6 text-white"}
          />
        </Button>
      </div>

      {/* Add Task Dialog */}
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
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className='rounded-xl input'
                autoFocus
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='task-category'>List</label>
              <Select
                value={newTaskCategory}
                onValueChange={setNewTaskCategory}
              >
                <SelectTrigger className='rounded-xl'>
                  <SelectValue placeholder='Select a list' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <label>Due Date</label>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <CalendarIcon className='h-4 w-4 text-foreground' />
                  </div>
                  <input
                    type='text'
                    placeholder='mm/dd/yyyy'
                    value={newTaskDate ? formatDate(newTaskDate) : ""}
                    className='rounded-xl pl-10 input'
                    readOnly
                    onClick={() => {
                      // Open a date picker dialog
                      handleSetDueDate({
                        id: "new",
                        title: newTaskTitle,
                        category: newTaskCategory,
                        completed: false,
                        date: newTaskDate,
                        time: newTaskTime,
                      });
                    }}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-brand'
                    onClick={() => {
                      const today = new Date();
                      setNewTaskDate(today.toISOString().split("T")[0]);
                    }}
                  >
                    Today
                  </Button>
                </div>
                <div className='relative flex-1'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <Clock className='h-4 w-4 text-foreground' />
                  </div>
                  <input
                    type='time'
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className='rounded-xl pl-10 input'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-brand'
                    onClick={() => {
                      const now = new Date();
                      const hours = String(now.getHours()).padStart(2, "0");
                      const minutes = String(now.getMinutes()).padStart(2, "0");
                      setNewTaskTime(`${hours}:${minutes}`);
                    }}
                  >
                    Now
                  </Button>
                </div>
              </div>
              <Select value={repeatOption} onValueChange={setRepeatOption}>
                <SelectTrigger className='rounded-xl'>
                  <SelectValue placeholder='Repeat' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Does not repeat'>
                    Does not repeat
                  </SelectItem>
                  <SelectItem value='Every day'>Every day</SelectItem>
                  <SelectItem value='Every week'>Every week</SelectItem>
                  <SelectItem value='Every month'>Every month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <label>Tags</label>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className={cn(
                      "cursor-pointer ",
                      newTaskTags.includes(tag.name) &&
                        "bg-brand text-text-primary"
                    )}
                    onClick={() => {
                      if (newTaskTags.includes(tag.name)) {
                        setNewTaskTags(
                          newTaskTags.filter((t) => t !== tag.name)
                        );
                      } else {
                        setNewTaskTags([...newTaskTags, tag.name]);
                      }
                    }}
                    text={tag.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={resetNewTaskForm}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-brand hover:bg-brand-hover'
              onClick={addTask}
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={isEditTaskDialogOpen}
        onOpenChange={setIsEditTaskDialogOpen}
      >
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label htmlFor='edit-task-title'>Task</label>
              <input
                id='edit-task-title'
                placeholder='Enter task title'
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className='rounded-xl input'
                autoFocus
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='edit-task-category'>List</label>
              <Select
                value={editTaskCategory}
                onValueChange={setEditTaskCategory}
              >
                <SelectTrigger className='rounded-xl'>
                  <SelectValue placeholder='Select a list' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <label>Due Date</label>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <CalendarIcon className='h-4 w-4 text-foreground' />
                  </div>
                  <input
                    type='text'
                    value={editTaskDate ? formatDate(editTaskDate) : ""}
                    className='rounded-xl pl-10 input'
                    readOnly
                    onClick={() => {
                      if (currentTask) {
                        handleSetDueDate(currentTask);
                      }
                    }}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-brand'
                    onClick={() => {
                      const today = new Date();
                      setEditTaskDate(today.toISOString().split("T")[0]);
                    }}
                  >
                    Today
                  </Button>
                </div>
                <div className='relative flex-1'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <Clock className='h-4 w-4 text-foreground' />
                  </div>
                  <input
                    type='time'
                    value={editTaskTime}
                    onChange={(e) => setEditTaskTime(e.target.value)}
                    className='rounded-xl pl-10 input'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-brand'
                    onClick={setToCurrentTime}
                  >
                    Now
                  </Button>
                </div>
              </div>
            </div>
            <div className='grid gap-2'>
              <label>Tags</label>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className={cn(
                      "cursor-pointer ",
                      editTaskTags.includes(tag.name) &&
                        "bg-brand text-text-primary"
                    )}
                    onClick={() => {
                      if (editTaskTags.includes(tag.name)) {
                        setEditTaskTags(
                          editTaskTags.filter((t) => t !== tag.name)
                        );
                      } else {
                        setEditTaskTags([...editTaskTags, tag.name]);
                      }
                    }}
                    text={tag.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsEditTaskDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-brand hover:bg-brand-hover'
              onClick={editTask}
              disabled={!editTaskTitle.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Due Date Dialog */}
      <Dialog open={isSetDueDateOpen} onOpenChange={setIsSetDueDateOpen}>
        <DialogContent className='sm:max-w-md p-0 rounded-xl overflow-hidden'>
          <div className='bg-white'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b'>
              <button
                className='text-foreground font-medium text-sm'
                onClick={() => setIsSetDueDateOpen(false)}
              >
                Cancel
              </button>
              <h2 className='text-base font-medium'>Set Time</h2>
              <button
                className='text-brand font-medium text-sm'
                onClick={setTaskDueDate}
              >
                Done
              </button>
            </div>

            <div className='p-4 space-y-4'>
              {/* Repeat Option */}
              <div className='relative'>
                <Select value={repeatOption} onValueChange={setRepeatOption}>
                  <SelectTrigger className='w-full border rounded-xl py-3 px-4 text-sm'>
                    <SelectValue placeholder='Does not repeat' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Does not repeat'>
                      Does not repeat
                    </SelectItem>
                    <SelectItem value='Every day'>Every day</SelectItem>
                    <SelectItem value='Every week'>Every week</SelectItem>
                    <SelectItem value='Every month'>Every month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div className='bg-white rounded-xl'>
                {/* Month Navigation */}
                <div className='flex justify-between items-center mb-4'>
                  <button
                    className='p-2 rounded-full hover:bg-gray-100'
                    onClick={prevMonth}
                  >
                    <ChevronLeft className='h-5 w-5 text-foreground' />
                  </button>
                  <h3 className='text-base font-medium'>
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    className='p-2 rounded-full hover:bg-gray-100'
                    onClick={nextMonth}
                  >
                    <ChevronRight className='h-5 w-5 text-foreground' />
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className='grid grid-cols-7 text-center mb-2'>
                  <div className='text-xs text-foreground'>Mo</div>
                  <div className='text-xs text-foreground'>Tu</div>
                  <div className='text-xs text-foreground'>We</div>
                  <div className='text-xs text-foreground'>Th</div>
                  <div className='text-xs text-foreground'>Fr</div>
                  <div className='text-xs text-foreground'>Sa</div>
                  <div className='text-xs text-foreground'>Su</div>
                </div>

                {/* Calendar Days */}
                <div className='grid grid-cols-7 gap-1 text-center'>
                  {Array.from({ length: 42 }, (_, i) => {
                    const firstDayOfMonth = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      1
                    );
                    const startingDayOfWeek = firstDayOfMonth.getDay() || 7; // Convert Sunday (0) to 7 for easier calculation
                    const day = i - (startingDayOfWeek - 2) + 1; // Adjust to start from Monday
                    const date = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    );

                    const isCurrentMonth =
                      date.getMonth() === currentMonth.getMonth();
                    const isToday =
                      new Date().toDateString() === date.toDateString();
                    const isSelected =
                      selectedDate &&
                      date.toDateString() === selectedDate.toDateString();

                    return (
                      <button
                        key={i}
                        className={cn(
                          "h-9 w-9 text-sm rounded-full flex items-center justify-center",
                          !isCurrentMonth && "invisible",
                          isToday &&
                            !isSelected &&
                            "border border-brandtext-brand",
                          isSelected && "bg-brandtext-brand text-white",
                          isCurrentMonth && !isSelected && "hover:bg-gray-100"
                        )}
                        onClick={() => {
                          if (isCurrentMonth) {
                            setSelectedDate(date);
                            setEditTaskDate(date.toISOString().split("T")[0]);
                          }
                        }}
                      >
                        {isCurrentMonth ? day : ""}
                      </button>
                    );
                  })}
                </div>

                {/* Set to Current Date Button */}
                <button
                  className='w-full mt-4 text-brand text-sm font-medium py-2'
                  onClick={setToCurrentDate}
                >
                  Set to Current Date
                </button>
              </div>

              {/* Time Section */}
              <div className='mt-4'>
                <div className='text-sm font-medium mb-2'>Time</div>
                <div className='flex items-center gap-2'>
                  <div className='relative flex-1'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <Clock className='h-4 w-4 text-foreground' />
                    </div>
                    <input
                      type='time'
                      value={editTaskTime}
                      onChange={(e) => setEditTaskTime(e.target.value)}
                      className='pl-10 h-10 rounded-xl input '
                    />
                  </div>
                  <Button
                    variant='outline'
                    className='h-10 rounded-xl border border-border'
                    onClick={setToCurrentTime}
                  >
                    Set to Current Time
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Move to List Dialog */}
      <Dialog open={isMoveToListOpen} onOpenChange={setIsMoveToListOpen}>
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Move to List</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <div className='space-y-2'>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => moveTaskToList(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsMoveToListOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add List Dialog */}
      <Dialog open={isAddListDialogOpen} onOpenChange={setIsAddListDialogOpen}>
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <div className='flex items-center gap-3 py-4'>
            <div className='bg-brand opacity-70 p-3 rounded-xl'>
              <List className='h-5 w-5 text-brand' />
            </div>
            <input
              ref={newListInputRef}
              placeholder='new list'
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className='rounded-xl input'
            />
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsAddListDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-brandtext-brand hover:bg-blue-600 text-white'
              onClick={addList}
              disabled={!newListName.trim()}
            >
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={isAddTagDialogOpen} onOpenChange={setIsAddTagDialogOpen}>
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className='flex items-center gap-3 py-4'>
            <div className='bg-blue-100 p-3 rounded-xl'>
              <LucideTag className='h-5 w-5 text-brand' />
            </div>
            <input
              ref={newTagInputRef}
              placeholder='new tag'
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className='rounded-xl input'
            />
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsAddTagDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-brandtext-brand hover:bg-blue-600 text-white'
              onClick={addTag}
              disabled={!newTagName.trim()}
            >
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename List Dialog */}
      <Dialog
        open={isRenameListDialogOpen}
        onOpenChange={setIsRenameListDialogOpen}
      >
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Rename List</DialogTitle>
          </DialogHeader>
          <div className='flex items-center gap-3 py-4'>
            <div className='bg-brand opacity-70 p-3 rounded-xl'>
              <List className='h-5 w-5 text-brand' />
            </div>
            <input
              placeholder='List name'
              value={newListNameForRename}
              onChange={(e) => setNewListNameForRename(e.target.value)}
              className='rounded-xl input'
              autoFocus
            />
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsRenameListDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-brand hover:bg-brand-hover text-text-primary'
              onClick={renameList}
              disabled={!newListNameForRename.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Tag Dialog */}
      <Dialog
        open={isRenameTagDialogOpen}
        onOpenChange={setIsRenameTagDialogOpen}
      >
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Rename Tag</DialogTitle>
          </DialogHeader>
          <div className='flex items-center gap-3 py-4'>
            <div className='bg-brand opacity-70 p-3 rounded-xl'>
              <LucideTag className='h-5 w-5 text-brand' />
            </div>
            <input
              placeholder='Tag name'
              value={newTagNameForRename}
              onChange={(e) => setNewTagNameForRename(e.target.value)}
              className='rounded-xl input'
              autoFocus
            />
          </div>
          <DialogFooter className='sm:justify-between'>
            <Button
              type='button'
              variant='outline'
              className='rounded-xl'
              onClick={() => setIsRenameTagDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='rounded-xl bg-brand text-text-primary hover:bg-brand-hover '
              onClick={renameTag}
              disabled={!newTagNameForRename.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detailed Todo List Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className='sm:max-w-4xl max-h-[90vh] p-0 rounded-xl overflow-hidden'>
          <div className='flex h-full'>
            {/* Sidebar */}
            <div className='w-64 border-r bg-card p-4'>
              <div className='mb-6'>
                <div className='relative'>
                  <Search className='absolute left-2 top-2.5 h-4 w-4 text-foreground' />
                  <input
                    placeholder='Search'
                    className='pl-8 rounded-lg input'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue='lists' className='w-full'>
                <TabsList className='grid w-full grid-cols-2 mb-4'>
                  <TabsTrigger value='lists'>Lists</TabsTrigger>
                  <TabsTrigger value='tags'>Tags</TabsTrigger>
                </TabsList>
                <TabsContent value='lists' className='mt-0'>
                  <div className='space-y-1 mb-6'>
                    <div className='text-sm font-medium text-foreground mb-2'>
                      Smart Lists
                    </div>
                    <Button
                      variant={
                        selectedCategory === "Today" ? "secondary" : "ghost"
                      }
                      className='w-full justify-start text-left'
                      onClick={() => {
                        setSelectedCategory("Today");
                        setSelectedTag("");
                      }}
                    >
                      Today
                      <Badge className='ml-auto' text={pendingTasks.length} />
                    </Button>
                  </div>

                  <div className='space-y-1'>
                    <div className='text-sm font-medium text-foreground mb-2'>
                      My Lists
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className='flex items-center justify-between'
                      >
                        <Button
                          variant={
                            selectedCategory === category.name
                              ? "secondary"
                              : "ghost"
                          }
                          className='w-full justify-start text-left'
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setSelectedTag("");
                          }}
                        >
                          {category.name}{" "}
                          <Badge
                            className='ml-auto'
                            text={getCategoryCount(category.name)}
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='ml-2'
                            >
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleRenameList(category.id)}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-error'
                              onClick={() => deleteList(category.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value='tags' className='mt-0'>
                  <div className='space-y-1'>
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <div
                          key={tag.id}
                          className='flex items-center justify-between'
                        >
                          <Button
                            variant={
                              selectedTag === tag.name ? "secondary" : "ghost"
                            }
                            className='w-full justify-start text-left'
                            onClick={() => {
                              setSelectedTag(tag.name);
                              setSelectedCategory("Today");
                            }}
                          >
                            {tag.name}{" "}
                            <Badge
                              className='ml-auto'
                              text={getTagCount(tag.name)}
                            />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='ml-2'
                              >
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => handleRenameTag(tag.id)}
                              >
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className='text-error'
                                onClick={() => deleteTag(tag.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))
                    ) : (
                      <div className='p-4 text-center text-foreground'>
                        No tags created yet
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className='absolute bottom-4 left-4'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size='icon'
                      className='rounded-full bg-brand text-text-primary hover:bg-brand-hover'
                    >
                      <Plus className='h-5 w-5' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side='top' className='w-48'>
                    <div className='space-y-2'>
                      <Button
                        variant='ghost'
                        className='w-full justify-start'
                        onClick={() => setIsAddListDialogOpen(true)}
                      >
                        <List className='h-4 w-4 mr-2' />
                        New List
                      </Button>
                      <Button
                        variant='ghost'
                        className='w-full justify-start'
                        onClick={() => setIsAddTagDialogOpen(true)}
                      >
                        <LucideTag className='h-4 w-4 mr-2' />
                        New Tag
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 flex flex-col max-h-[80vh]'>
              <div className='flex items-center justify-between p-4 border-b'>
                <h2 className='text-xl font-bold'>
                  {selectedTag ? `#${selectedTag}` : selectedCategory}
                </h2>
                <div className='flex items-center gap-2'>
                  {completedTasks.length > 0 && (
                    <div className='flex items-center gap-2 bg-badge rounded-full px-3 py-1 text-sm'>
                      <span>{completedTasks.length} Completed</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-auto p-0 text-brand hover:text-brand'
                        onClick={clearCompletedTasks}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                  <Button
                    variant={hideCompleted ? "default" : "outline"}
                    onClick={() => setHideCompleted(!hideCompleted)}
                    className='rounded-full'
                  >
                    {hideCompleted ? "Show Completed" : "Hide Completed"}
                  </Button>
                </div>
              </div>

              <ScrollArea className='flex-1 p-4'>
                <div className='space-y-4'>
                  {filteredTasks.map((task) => (
                    <div key={task.id} className='flex items-start gap-3 group'>
                      <div
                        className={cn(
                          "rounded-full border flex-shrink-0 cursor-pointer flex items-center justify-center w-5 h-5 mt-1 transition-colors",
                          task.completed
                            ? "border-green-500 bg-green-500 hover:bg-green-600 hover:border-green-600"
                            : "border-border hover:bg-badge hover:border-brand text-text-primary"
                        )}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed && (
                          <Check className='h-3 w-3 text-text-primary' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <p
                          className={cn(
                            "font-medium text-base",
                            task.completed && "line-through text-foreground"
                          )}
                        >
                          {task.title}
                        </p>
                        {(task.time || task.date) && (
                          <div className='flex items-center gap-1 text-foreground text-sm mt-1'>
                            <Clock className='h-3 w-3' />
                            {task.date && <span>{formatDate(task.date)}</span>}
                            {task.time && <span>at {task.time}</span>}
                            {task.repeat && (
                              <span className='text-brand ml-2'>
                                {task.repeat}
                              </span>
                            )}
                          </div>
                        )}
                        <div className='flex flex-wrap gap-1 mt-2'>
                          <Badge className='bg-badge' text={task.category} />

                          {task.tags &&
                            task.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className='bg-badge'
                                text={`#${tag}`}
                              />
                            ))}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSetDueDate(task)}
                          >
                            Set Due Date
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMoveToList(task)}
                          >
                            Move to List
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-error'
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className='p-4 border-t'>
                <Button
                  variant='ghost'
                  className='w-full justify-start text-foreground'
                  onClick={handleAddButtonClick}
                >
                  <Plus className='h-4 w-4 mr-2' /> Add To-do
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
