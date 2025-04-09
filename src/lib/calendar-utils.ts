import { format, isSameDay, parseISO } from "date-fns"

export const events = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync",
    date: "2025-04-08T10:00:00",
    endDate: "2025-04-08T11:00:00",
    color: "bg-red-500",
    isVideo: true,
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    description: "At Sushi Place",
    date: "2025-04-08T12:30:00",
    endDate: "2025-04-08T13:30:00",
    color: "bg-orange-500",
  },
  {
    id: 3,
    title: "Project Deadline",
    description: "Submit final deliverables",
    date: "2025-04-10T17:00:00",
    endDate: "2025-04-10T17:30:00",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    title: "Gym Session",
    description: "Cardio day",
    date: "2025-04-09T18:00:00",
    endDate: "2025-04-09T19:00:00",
    color: "bg-green-500",
  },
  {
    id: 5,
    title: "Doctor Appointment",
    description: "Annual checkup",
    date: "2025-04-12T09:30:00",
    endDate: "2025-04-12T10:30:00",
    color: "bg-blue-500",
  },
  // Additional events for April 8th to demonstrate scrolling
  {
    id: 6,
    title: "Client Call",
    description: "Quarterly review",
    date: "2025-04-08T14:00:00",
    endDate: "2025-04-08T15:00:00",
    color: "bg-purple-500",
    isVideo: true,
  },
  {
    id: 7,
    title: "Coffee Break",
    description: "With design team",
    date: "2025-04-08T15:30:00",
    endDate: "2025-04-08T16:00:00",
    color: "bg-pink-500",
  },
  {
    id: 8,
    title: "Review Designs",
    description: "New product mockups",
    date: "2025-04-08T16:30:00",
    endDate: "2025-04-08T17:30:00",
    color: "bg-indigo-500",
  },
  {
    id: 9,
    title: "Evening Workout",
    description: "Strength training",
    date: "2025-04-08T18:00:00",
    endDate: "2025-04-08T19:00:00",
    color: "bg-green-500",
  },
]

// Sample all-day events
export const allDayEvents = [
  {
    id: 101,
    title: "Product Sync",
    date: "2025-04-22",
    color: "bg-blue-500",
    isVideo: true,
    time: "9:15-9:30 AM",
    canJoin: true,
  },
  {
    id: 102,
    title: "Marketing Meeting",
    date: "2025-04-22",
    color: "bg-orange-500",
    isVideo: true,
    time: "10:00-10:30 AM",
  },
  {
    id: 103,
    title: "Lunch w/ Jon",
    date: "2025-04-22",
    color: "bg-green-500",
    time: "12:00PM-1:00PM",
  },
  {
    id: 104,
    title: "Project Review",
    date: "2025-04-22",
    color: "bg-red-500",
    isVideo: true,
  },
  {
    id: 105,
    title: "Client Presentation",
    date: "2025-04-22",
    color: "bg-purple-500",
    isVideo: true,
  },
]

// Format time for display
export const formatEventTime = (dateString: string) => {
  return format(parseISO(dateString), "h:mm a")
}

// Get event colors for a specific day
export const getEventColorsForDay = (day: Date) => {
  return events
    .filter((event) => isSameDay(parseISO(event.date), day))
    .map((event) => event.color.replace("bg-", ""))
    .slice(0, 3) // Limit to 3 colors max
}
