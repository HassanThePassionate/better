import { DateRange } from "react-day-picker";
import { format } from "date-fns";
export const formatDateRange = (dateRange?: DateRange): string => {
  if (!dateRange || !dateRange.from) return "Select";

  const { from, to } = dateRange;

  if (!to || from.getTime() === to.getTime()) {
    // Single date
    return format(from, "MMMM d, yyyy");
  }

  // Same year
  if (from.getFullYear() === to.getFullYear()) {
    // Same month
    if (from.getMonth() === to.getMonth()) {
      return `${format(from, "MMMM d")} - ${format(to, "d, yyyy")}`;
    }
    // Different month, same year
    return `${format(from, "MMMM d")} - ${format(to, "MMMM d, yyyy")}`;
  }

  // Different years
  return `${format(from, "MMMM d, yyyy")} - ${format(to, "MMMM d, yyyy")}`;
};
