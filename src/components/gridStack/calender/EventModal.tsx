"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Trash2,
  Clock,
  Calendar,
  Video,
  X,
  MapPin,
  Users,
  Bell,
  Repeat,
  AlignLeft,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnThisDay } from "./OnThisDay";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarEvent } from "./Calendar";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: number) => void;
  mode: "view" | "add" | "edit";
  selectedEvent?: CalendarEvent;
}

export function EventModal({
  isOpen,
  onClose,
  selectedDate,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  mode,
  selectedEvent,
}: EventModalProps) {
  const [activeTab, setActiveTab] = useState<string>("events");
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [title, setTitle] = useState(selectedEvent?.title || "");
  const [description, setDescription] = useState<string | undefined>(
    selectedEvent?.description || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    selectedEvent?.color || "bg-blue-500"
  );
  const [isVideo, setIsVideo] = useState(selectedEvent?.isVideo || false);
  const [isAllDay, setIsAllDay] = useState(selectedEvent?.isAllDay || false);
  const [location, setLocation] = useState(selectedEvent?.location || "");
  const [startTime, setStartTime] = useState(
    selectedEvent ? format(parseISO(selectedEvent.date), "HH:mm") : "09:00"
  );
  const [endTime, setEndTime] = useState(
    selectedEvent ? format(parseISO(selectedEvent.endDate), "HH:mm") : "10:00"
  );
  const [notes, setNotes] = useState(selectedEvent?.notes || "");
  const [attendees, setAttendees] = useState<string[]>(
    selectedEvent?.attendees || []
  );
  const [newAttendee, setNewAttendee] = useState("");
  const [recurrence, setRecurrence] = useState<string>(
    selectedEvent?.recurrence || "none"
  );
  const [reminder, setReminder] = useState<number>(
    selectedEvent?.reminder || 15
  );
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Reset form when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      setSelectedColor(selectedEvent.color);
      setIsVideo(selectedEvent.isVideo || false);
      setIsAllDay(selectedEvent.isAllDay || false);
      setLocation(selectedEvent.location || "");
      setStartTime(format(parseISO(selectedEvent.date), "HH:mm"));
      setEndTime(format(parseISO(selectedEvent.endDate), "HH:mm"));
      setNotes(selectedEvent.notes || "");
      setAttendees(selectedEvent.attendees || []);
      setRecurrence(selectedEvent.recurrence || "none");
      setReminder(selectedEvent.reminder || 15);
      setEditingEvent(selectedEvent);
      // Show advanced options if the event has any advanced fields filled
      setShowAdvancedOptions(
        !!(
          selectedEvent.description ||
          selectedEvent.location ||
          selectedEvent.attendees?.length ||
          selectedEvent.recurrence !== "none" ||
          selectedEvent.reminder !== 15 ||
          selectedEvent.notes ||
          selectedEvent.isVideo
        )
      );
    } else {
      resetForm();
      setEditingEvent(null);
      setShowAdvancedOptions(false);
    }
  }, [selectedEvent]);

  // Reset form and view when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === "add") {
        setShowAddEventForm(true);
        setActiveTab("events");
        setShowAdvancedOptions(false);
      } else if (mode === "edit" && selectedEvent) {
        setShowAddEventForm(true);
        setActiveTab("events");
        setEditingEvent(selectedEvent);
      } else {
        setShowAddEventForm(false);
        setActiveTab("events");
      }
    }
  }, [isOpen, mode, selectedEvent]);

  // Filter events for the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Available colors for event creation
  const colors = [
    { name: "Red", value: "bg-red-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
  ];

  // Recurrence options
  const recurrenceOptions = [
    { label: "None", value: "none" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  // Reminder options
  const reminderOptions = [
    { label: "None", value: 0 },
    { label: "5 minutes before", value: 5 },
    { label: "15 minutes before", value: 15 },
    { label: "30 minutes before", value: 30 },
    { label: "1 hour before", value: 60 },
    { label: "2 hours before", value: 120 },
    { label: "1 day before", value: 1440 },
  ];

  // Handle form submission
  const handleSubmit = () => {
    if (!title.trim()) return;

    const eventDate = new Date(selectedDate);
    if (!isAllDay) {
      const [hours, minutes] = startTime.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      eventDate.setHours(0, 0, 0, 0);
    }

    let endDate;
    if (isAllDay) {
      endDate = new Date(eventDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      const [hours, minutes] = endTime.split(":").map(Number);
      endDate = new Date(eventDate);
      endDate.setHours(hours, minutes, 0, 0);

      // If end time is earlier than start time, assume it's the next day
      if (endDate < eventDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
    }

    const eventData = {
      title,
      description,
      date: eventDate.toISOString(),
      endDate: endDate.toISOString(),
      color: selectedColor,
      isVideo,
      isAllDay,
      location,
      attendees,
      recurrence: recurrence as
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "none",
      reminder,
      notes,
    };

    if (editingEvent) {
      onUpdateEvent({ ...eventData, id: editingEvent.id });
      // Show a toast or notification here if you want
    } else {
      onAddEvent(eventData);
      // Show a toast or notification here if you want
    }

    resetForm();
    setShowAddEventForm(false);
  };

  // Add attendee
  const handleAddAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee.trim())) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee("");
    }
  };

  // Remove attendee
  const handleRemoveAttendee = (attendee: string) => {
    setAttendees(attendees.filter((a) => a !== attendee));
  };

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedColor("bg-blue-500");
    setIsVideo(false);
    setIsAllDay(false);
    setLocation("");
    setStartTime("09:00");
    setEndTime("10:00");
    setNotes("");
    setAttendees([]);
    setNewAttendee("");
    setRecurrence("none");
    setReminder(15);
    setEditingEvent(null);
    setShowAdvancedOptions(false);
  };

  // Handle cancel

  // Start editing an event
  const startEditingEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setSelectedColor(event.color);
    setIsVideo(event.isVideo || false);
    setIsAllDay(event.isAllDay || false);
    setLocation(event.location || "");
    setStartTime(format(parseISO(event.date), "HH:mm"));
    setEndTime(format(parseISO(event.endDate), "HH:mm"));
    setNotes(event.notes || "");
    setAttendees(event.attendees || []);
    setRecurrence(event.recurrence || "none");
    setReminder(event.reminder || 15);
    setShowAddEventForm(true);
    // Show advanced options if the event has any advanced fields filled
    setShowAdvancedOptions(
      !!(
        event.description ||
        event.location ||
        event.attendees?.length ||
        event.recurrence !== "none" ||
        event.reminder !== 15 ||
        event.notes ||
        event.isVideo
      )
    );
  };

  // Toggle advanced options
  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md p-0 rounded-xl overflow-hidden bg-background min-h-[450px] min-w-[350px]'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <DialogHeader className='px-4 py-3 border-b flex items-center justify-between bg-badge'>
            <div className='flex items-center justify-between w-full'>
              <DialogTitle className='text-base font-semibold text-left'>
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='flex-1'
          >
            <TabsList className='w-full rounded-none bg-card p-1'>
              <TabsTrigger
                value='events'
                className='flex-1 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-none'
              >
                Your Events
              </TabsTrigger>
              <TabsTrigger
                value='onthisday'
                className='flex-1 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-none'
              >
                On This Day
              </TabsTrigger>
            </TabsList>

            {/* Your Events Tab */}
            <TabsContent value='events' className='p-0 flex-1'>
              {!showAddEventForm ? (
                <>
                  <div className='p-3 flex justify-end'>
                    <Button
                      className='bg-brand hover:bg-brand hover:text-text-primary rounded-full flex items-center justify-center'
                      onClick={() => {
                        resetForm();
                        setShowAddEventForm(true);
                      }}
                    >
                      <Plus className='h-4 w-4 mr-1' />
                      New Event
                    </Button>
                  </div>

                  <ScrollArea className='h-[280px]'>
                    <div className='px-3 pb-3 space-y-3'>
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <div
                            key={event.id}
                            className='p-3 rounded-xl bg-card shadow-sm flex items-start'
                          >
                            <div
                              className={`w-2 h-full min-h-[24px] ${event.color} rounded-full mr-3`}
                            ></div>
                            <div
                              className='flex-1 cursor-pointer'
                              onClick={() => startEditingEvent(event)}
                            >
                              <h3 className='font-medium'>{event.title}</h3>
                              {event.description && (
                                <p className='text-xs text-text mt-1 line-clamp-1'>
                                  {event.description}
                                </p>
                              )}
                              <div className='flex items-center mt-1'>
                                <Clock className='h-3 w-3 text-foreground mr-1' />
                                <span className='text-xs text-text'>
                                  {event.isAllDay
                                    ? "All day"
                                    : `${format(
                                        parseISO(event.date),
                                        "h:mm a"
                                      )} - ${format(
                                        parseISO(event.endDate),
                                        "h:mm a"
                                      )}`}
                                </span>
                                {event.isVideo && (
                                  <Video className='h-3 w-3 ml-2 text-brand' />
                                )}
                              </div>
                              {event.location && (
                                <div className='flex items-center mt-1'>
                                  <MapPin className='h-3 w-3 text-foreground mr-1' />
                                  <span className='text-xs text-text'>
                                    {event.location}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7 text-error hover:bg-hover'
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${event.title}"?`
                                  )
                                ) {
                                  onDeleteEvent(event.id);
                                  // Show a toast or notification here if you want
                                }
                              }}
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className='flex flex-col items-center justify-center py-6'>
                          <div className='bg-card rounded-full p-4 mb-3'>
                            <Calendar className='h-6 w-6 text-foreground' />
                          </div>
                          <p className='text-text mb-2'>
                            No events scheduled for this day
                          </p>
                          <p className='text-foreground text-sm'>
                            Your schedule is clear. Add an event to get started.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <ScrollArea className='h-[350px]'>
                  <div className='p-4 space-y-4'>
                    {/* Simplified Form - Always Visible */}
                    <div className='space-y-4'>
                      {/* Title Input */}
                      <div className='bg-card rounded-xl overflow-hidden shadow-sm'>
                        <input
                          type='text'
                          placeholder='Event title'
                          className='w-full px-4 py-3 border-0 focus:outline-none text-lg input'
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          autoFocus
                        />
                      </div>

                      {/* Time Selection - Simplified */}
                      <div className='bg-card rounded-xl p-4 shadow-sm'>
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center'>
                            <Clock className='h-5 w-5 text-foreground mr-2' />
                            <span className='text-text'>Time</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Switch
                              id='all-day'
                              checked={isAllDay}
                              onCheckedChange={setIsAllDay}
                            />
                            <span className='text-sm text-text'>All-day</span>
                          </div>
                        </div>

                        {!isAllDay && (
                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <label
                                htmlFor='start-time'
                                className='text-xs text-text mb-2 block'
                              >
                                Start
                              </label>
                              <input
                                id='start-time'
                                type='time'
                                className='w-full rounded-md border border-brand input p-2 text-sm'
                                value={startTime}
                                onChange={(e) => {
                                  setStartTime(e.target.value);
                                  // Auto-adjust end time if needed
                                  const [hours, minutes] = e.target.value
                                    .split(":")
                                    .map(Number);
                                  const startDate = new Date();
                                  startDate.setHours(hours, minutes);
                                  const endDate = new Date(startDate);
                                  endDate.setHours(endDate.getHours() + 1);
                                  if (endTime < e.target.value) {
                                    setEndTime(format(endDate, "HH:mm"));
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor='end-time'
                                className='text-xs text-text mb-2 block'
                              >
                                End
                              </label>
                              <input
                                id='end-time'
                                type='time'
                                className='w-full rounded-md border-brand input p-2 text-sm'
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Color Selection - Simplified */}
                      <div className='bg-card rounded-xl p-4 shadow-sm'>
                        <div className='flex items-center mb-3'>
                          <Calendar className='h-5 w-5 text-foreground mr-2' />
                          <span className='text-text'>Color</span>
                        </div>
                        <div className='flex justify-between'>
                          {colors.map((color) => (
                            <div
                              key={color.value}
                              className={`w-8 h-8 rounded-full ${
                                color.value
                              } cursor-pointer flex items-center justify-center
                              ${
                                selectedColor === color.value
                                  ? "ring-2 ring-brand ring-offset-2"
                                  : ""
                              }`}
                              onClick={() => setSelectedColor(color.value)}
                            >
                              {selectedColor === color.value && (
                                <div className='w-3 h-3 bg-text rounded-full'></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* More Options Toggle Button */}
                      <Button
                        variant='outline'
                        onClick={toggleAdvancedOptions}
                        className='w-full flex items-center justify-center py-2 text-text'
                      >
                        {showAdvancedOptions ? (
                          <>
                            <ChevronUp className='h-4 w-4 mr-2' />
                            Less Options
                          </>
                        ) : (
                          <>
                            <ChevronDown className='h-4 w-4 mr-2' />
                            More Options
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Advanced Options - Conditionally Visible */}
                    {showAdvancedOptions && (
                      <div className='space-y-4 mt-2'>
                        {/* Description Input */}
                        <div className='bg-card rounded-xl overflow-hidden shadow-sm'>
                          <textarea
                            placeholder='Add description'
                            className='w-full px-4 py-3 border-0 h-[80px] focus:outline-none text-sm resize-none input'
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>

                        {/* Location Input */}
                        <div className='bg-card rounded-xl overflow-hidden shadow-sm'>
                          <div className='flex items-center px-4 py-1'>
                            <MapPin className='h-4 w-4 text-foreground mr-2' />
                            <input
                              type='text'
                              placeholder='Add location'
                              className='w-full border-0 focus:outline-none text-sm input'
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Attendees */}
                        <div className='bg-card rounded-xl p-4 shadow-sm'>
                          <div className='flex items-center mb-3'>
                            <Users className='h-5 w-5 text-foreground mr-2' />
                            <span className='text-text'>Attendees</span>
                          </div>
                          <div className='flex items-center mb-2'>
                            <input
                              type='email'
                              placeholder='Add attendee email'
                              className='flex-1 rounded-l-md border border-border p-2 text-sm input'
                              value={newAttendee}
                              onChange={(e) => setNewAttendee(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddAttendee()
                              }
                            />
                            <Button
                              className='rounded-r-md bg-brand hover:bg-brand-hover h-9'
                              onClick={handleAddAttendee}
                            >
                              Add
                            </Button>
                          </div>
                          {attendees.length > 0 && (
                            <div className='mt-2 space-y-1'>
                              {attendees.map((attendee) => (
                                <div
                                  key={attendee}
                                  className='flex items-center justify-between bg-card rounded-md p-2'
                                >
                                  <span className='text-sm'>{attendee}</span>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 text-text hover:text-error'
                                    onClick={() =>
                                      handleRemoveAttendee(attendee)
                                    }
                                  >
                                    <X className='h-3 w-3' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recurrence */}
                        <div className='bg-card rounded-xl p-4 shadow-sm'>
                          <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center'>
                              <Repeat className='h-5 w-5 text-foreground mr-2' />
                              <span className='text-text'>Repeat</span>
                            </div>
                            <Popover
                              open={showRecurrenceOptions}
                              onOpenChange={setShowRecurrenceOptions}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  className='text-sm h-8'
                                >
                                  {recurrenceOptions.find(
                                    (o) => o.value === recurrence
                                  )?.label || "None"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className='w-48 p-0'>
                                <Command>
                                  <CommandList>
                                    <CommandGroup>
                                      {recurrenceOptions.map((option) => (
                                        <CommandItem
                                          key={option.value}
                                          onSelect={() => {
                                            setRecurrence(option.value);
                                            setShowRecurrenceOptions(false);
                                          }}
                                          className='flex items-center justify-between'
                                        >
                                          {option.label}
                                          {recurrence === option.value && (
                                            <Check className='h-4 w-4' />
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Reminder */}
                        <div className='bg-card rounded-xl p-4 shadow-sm'>
                          <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center'>
                              <Bell className='h-5 w-5 text-foreground mr-2' />
                              <span className='text-text'>Reminder</span>
                            </div>
                            <Popover
                              open={showReminderOptions}
                              onOpenChange={setShowReminderOptions}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  className='text-sm h-8'
                                >
                                  {reminderOptions.find(
                                    (o) => o.value === reminder
                                  )?.label || "None"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className='w-48 p-0'>
                                <Command>
                                  <CommandList>
                                    <CommandGroup>
                                      {reminderOptions.map((option) => (
                                        <CommandItem
                                          key={option.value}
                                          onSelect={() => {
                                            setReminder(option.value);
                                            setShowReminderOptions(false);
                                          }}
                                          className='flex items-center justify-between'
                                        >
                                          {option.label}
                                          {reminder === option.value && (
                                            <Check className='h-4 w-4' />
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Notes */}
                        <div className='bg-card rounded-xl p-4 shadow-sm'>
                          <div className='flex items-center mb-3'>
                            <AlignLeft className='h-5 w-5 text-foreground mr-2' />
                            <span className='text-text'>Notes</span>
                          </div>
                          <textarea
                            placeholder='Add notes'
                            className='w-full rounded-md border input h-[80px] p-2 text-sm resize-none'
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>

                        {/* Video Call Option */}
                        <div className='bg-card rounded-xl p-4 shadow-sm'>
                          <div className='flex items-center justify-between'>
                            <label
                              htmlFor='video-call'
                              className='flex items-center text-text'
                            >
                              <Video className='h-4 w-4 mr-2 text-text' />
                              Add video conferencing
                            </label>
                            <Switch
                              id='video-call'
                              checked={isVideo}
                              onCheckedChange={setIsVideo}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add/Update Event Button */}
                    <Button
                      className='w-full py-6 text-lg bg-brand hover:bg-brand-hover rounded-xl shadow-sm'
                      onClick={handleSubmit}
                      disabled={!title.trim()}
                    >
                      {editingEvent ? "Update Event" : "Add Event"}
                    </Button>
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {/* On This Day Tab */}
            <TabsContent
              value='onthisday'
              className='p-0 flex-1 bg-card rounded-xl'
            >
              <ScrollArea className='h-[280px]'>
                <OnThisDay selectedDate={selectedDate} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
