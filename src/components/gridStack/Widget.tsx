import Calendar from "./Calender";
import Chart from "./Chart";
import DigitalClock from "./Clock";
import Notebook from "./NoteBook";
import SmallCalendar from "./SmallCalender";
import Stats from "./Stats";
import TodoCard from "./Todo";

const Widget = ({ type }: { type?: string }) => {
  return (
    <>
      {type === "calender" ? (
        <Calendar />
      ) : type === "stats" ? (
        <Stats />
      ) : type === "chart" ? (
        <Chart />
      ) : type === "clock" ? (
        <DigitalClock />
      ) : type === "notebook" ? (
        <Notebook />
      ) : type === "todo" ? (
        <TodoCard />
      ) : type === "sm-calender" ? (
        <SmallCalendar />
      ) : (
        <div className='bg-red-500 h-full w-full'>Widget</div>
      )}
    </>
  );
};

export default Widget;
