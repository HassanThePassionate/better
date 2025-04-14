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
import NewsWidget from "./news/NewsWidget";
import { useEditorContext } from "@/context/EditorContext";
import EventCalendar from "./calender/DisplayCalendar";
import TopCoinsWidget from "./crypto/TopCoinWidget";
import AdvancedCoinsWidget from "./crypto/AdvanceCoinWidget";
import SmallConverterWidget from "./converters/widgets/SmallConvertWidget";
import ConverterWidget from "./converters/widgets/ConverterWidget";
import CurrencyWidgetSmall from "./converters/widgets/SmallCurrencyWidget";
import CurrencyWidgetMedium from "./converters/widgets/WideCurrencyWidget";

const Widget = ({ type }: { type?: string }) => {
  const { filteredNotes: notes } = useEditorContext();
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
      ) : type === "top-coin" ? (
        <TopCoinsWidget />
      ) : type === "adv-crypto" ? (
        <AdvancedCoinsWidget />
      ) : type === "sm-calendar" ? (
        <EventCalendar type='small' />
      ) : type === "large-calendar" ? (
        <EventCalendar type='large' />
      ) : type === "wide-calendar" ? (
        <EventCalendar type='wide' />
      ) : type === "sm-news" ? (
        <NewsWidget height={200} width={200} />
      ) : type === "wide-news" ? (
        <NewsWidget height={200} width={300} />
      ) : type === "large-news" ? (
        <NewsWidget height={300} width={300} />
      ) : type === "sm-converter" ? (
        <SmallConverterWidget />
      ) : type === "large-converter" ? (
        <ConverterWidget />
      ) : type === "sm-currency" ? (
        <CurrencyWidgetSmall />
      ) : type === "wide-currency" ? (
        <CurrencyWidgetMedium />
      ) : null}
    </>
  );
};

export default Widget;
