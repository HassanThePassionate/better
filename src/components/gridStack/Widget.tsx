// import Calendar from "./Calender";
// import Chart from "./Chart";
// import DigitalClock from "./Clock";
// import Notebook from "./NoteBook";
// import SmallCalendar from "./SmallCalender";
// import Stats from "./Stats";
// import TodoCard from "./Todo";

import NotesWidget from "./notes/NotesWidget";
import SmallNotesWidget from "./notes/SmallNotWidget";
import WeatherCard from "./weather/WeatherCard";
import WeatherWidget from "./weather/WeatherWidget";
import WeatherWidgetWide from "./weather/WideWeatherWidget";
import Widgets from "./notes/Widgets";
import MovieWidget from "./MovieWidget";
import CryptoWidget from "./crypto/CryptoWidget";
import WideCryptoWidget from "./crypto/WideCryptoWidget";
import LargeCryptoWidget from "./crypto/LargeCryptoWidget";
import SmallCalendar from "./calender/SmCalendar";
import MainCalendar from "./calender/CalenderWidget";
import WideCalendar from "./calender/WideCalendar";
import NewsWidget from "./news/NewsWidget";
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
      ) : type === "sm-notes" ? (
        <SmallNotesWidget notes={notes} />
      ) : type === "weather" ? (
        <WeatherCard cityName='London' />
      ) : type === "sm-weather" ? (
        <WeatherWidget cityName='New York' />
      ) : type === "wide-weather" ? (
        <WeatherWidgetWide cityName='New York' />
      ) : type === "movie" ? (
        <MovieWidget />
      ) : type === "sm-cryptoCard" ? (
        <CryptoWidget />
      ) : type === "wide-cryptoCard" ? (
        <WideCryptoWidget />
      ) : type === "large-cryptoCard" ? (
        <LargeCryptoWidget />
      ) : type === "sm-calendar" ? (
        <SmallCalendar />
      ) : type === "large-calendar" ? (
        <MainCalendar />
      ) : type === "wide-calendar" ? (
        <WideCalendar />
      ) : type === "sm-news" ? (
        <NewsWidget height={200} width={200} />
      ) : type === "wide-news" ? (
        <NewsWidget height={200} width={300} />
      ) : type === "large-news" ? (
        <NewsWidget height={300} width={300} />
      ) : null}
    </>
  );
};

export default Widget;
