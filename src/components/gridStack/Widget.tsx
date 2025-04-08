// import Calendar from "./Calender";
// import Chart from "./Chart";
// import DigitalClock from "./Clock";
// import Notebook from "./NoteBook";
// import SmallCalendar from "./SmallCalender";
// import Stats from "./Stats";
// import TodoCard from "./Todo";

import NotesWidget from "./NotesWidget";
import Widgets from "./Widgets";
const notes = [
  {
    id: 1,
    title: "Welcome Hitab Notes",
    date: "July 28",
    color: "orange",
  },
  {
    id: 2,
    title: "The Last Rose of Summer",
    date: "July 28",
    color: "green",
  },
  {
    id: 3,
    title: "Change The Way of Thinking",
    date: "July 29",
    color: "red",
  },
  {
    id: 4,
    title: "Project Ideas",
    date: "July 30",
    color: "green",
  },
  {
    id: 5,
    title: "Shopping List",
    date: "July 30",
    color: "orange",
  },
];
const Widget = ({ type }: { type?: string }) => {
  return (
    <>
      {type === "large" ? (
        <Widgets size='large' />
      ) : type === "small" ? (
        <Widgets size='small' />
      ) : type === "notes" ? (
        <NotesWidget notes={notes} />
      ) : null}
    </>
  );
};

export default Widget;
