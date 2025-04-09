"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RefreshCw, Pencil } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface WeatherWidget3x3Props {
  cityName: string;
  temperature?: number;
  description?: string;
  humidity?: string;
  windSpeed?: string;
  icon?: string;
}

// Sample data mapping for different cities
const cityData: Record<
  string,
  {
    temperature: number;
    description: string;
    humidity: string;
    windSpeed: string;
    icon: string;
    daily: Array<{ time: string; icon: string }>;
  }
> = {
  London: {
    temperature: 12,
    description: "Heavy intensity rain",
    humidity: "77%",
    windSpeed: "11.17 m/s",
    icon: "10d",
    daily: [
      { time: "10 AM", icon: "10d" },
      { time: "11 AM", icon: "09d" },
      { time: "12 PM", icon: "09d" },
      { time: "1 PM", icon: "09d" },
      { time: "2 PM", icon: "10d" },
      { time: "3 PM", icon: "02d" },
    ],
  },
  "New York": {
    temperature: 18,
    description: "Few clouds",
    humidity: "58%",
    windSpeed: "6.7 m/s",
    icon: "02d",
    daily: [
      { time: "10 AM", icon: "02d" },
      { time: "11 AM", icon: "01d" },
      { time: "12 PM", icon: "01d" },
      { time: "1 PM", icon: "02d" },
      { time: "2 PM", icon: "03d" },
      { time: "3 PM", icon: "03d" },
    ],
  },
  Paris: {
    temperature: 14,
    description: "Clear sky",
    humidity: "65%",
    windSpeed: "8.2 m/s",
    icon: "01d",
    daily: [
      { time: "10 AM", icon: "01d" },
      { time: "11 AM", icon: "01d" },
      { time: "12 PM", icon: "02d" },
      { time: "1 PM", icon: "02d" },
      { time: "2 PM", icon: "01d" },
      { time: "3 PM", icon: "01d" },
    ],
  },
  Tokyo: {
    temperature: 21,
    description: "Scattered clouds",
    humidity: "72%",
    windSpeed: "4.5 m/s",
    icon: "03d",
    daily: [
      { time: "10 AM", icon: "03d" },
      { time: "11 AM", icon: "03d" },
      { time: "12 PM", icon: "04d" },
      { time: "1 PM", icon: "04d" },
      { time: "2 PM", icon: "03d" },
      { time: "3 PM", icon: "02d" },
    ],
  },
  Sydney: {
    temperature: 23,
    description: "Clear sky",
    humidity: "60%",
    windSpeed: "9.3 m/s",
    icon: "01d",
    daily: [
      { time: "10 AM", icon: "01d" },
      { time: "11 AM", icon: "01d" },
      { time: "12 PM", icon: "01d" },
      { time: "1 PM", icon: "02d" },
      { time: "2 PM", icon: "02d" },
      { time: "3 PM", icon: "01d" },
    ],
  },
};

// Sample cities for search
const cities = [
  "London",
  "New York",
  "Paris",
  "Tokyo",
  "Sydney",
  "Berlin",
  "Rome",
  "Madrid",
  "Moscow",
  "Beijing",
];

export default function WeatherWidget3x3({
  cityName,
  temperature,
  description,
  humidity,
  windSpeed,
  icon,
}: WeatherWidget3x3Props) {
  const [currentCity, setCurrentCity] = useState(cityName);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  // Use provided data or fallback to sample data
  const data = {
    temperature: temperature ?? cityData[currentCity]?.temperature ?? 15,
    description:
      description ?? cityData[currentCity]?.description ?? "Partly cloudy",
    humidity: humidity ?? cityData[currentCity]?.humidity ?? "65%",
    windSpeed: windSpeed ?? cityData[currentCity]?.windSpeed ?? "5.0 m/s",
    icon: icon ?? cityData[currentCity]?.icon ?? "01d",
    daily: cityData[currentCity]?.daily ?? [
      { day: "Mon", icon: "01d", high: 16, low: 10 },
      { day: "Tue", icon: "01d", high: 17, low: 11 },
      { day: "Wed", icon: "02d", high: 15, low: 9 },
      { day: "Thu", icon: "03d", high: 14, low: 8 },
    ],
  };
  const today = new Date();

  const formattedToday = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setIsEditing(false);
    setShowResults(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Convert temperature based on selected unit
  const displayTemperature = isCelsius
    ? data.temperature
    : Math.round((data.temperature * 9) / 5 + 32);

  // Convert daily temperatures based on selected unit

  const temperatureUnit = isCelsius ? "°C" : "°F";

  return (
    <div className='h-full w-full px-1 bg-card shadow-sm relative'>
      <div className='flex justify-end gap-1 absolute right-2 top-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleRefresh}
          disabled={isLoading}
          className='h-6 w-6'
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
        </Button>

        <Button
          variant='ghost'
          size='icon'
          onClick={toggleTemperatureUnit}
          className='h-6 w-6'
        >
          <span className='text-[10px] font-bold'>
            {isCelsius ? "°F" : "°C"}
          </span>
        </Button>
      </div>
      <div className='p-3 h-full flex flex-col'>
        {/* City */}
        <div className='absolute top-3 w-full max-w-[280px]'>
          {isEditing && (
            <div className='relative mb-1'>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                placeholder='Search for a city...'
                className='w-full text-sm input'
                autoFocus
              />
              {showResults && (
                <div className='absolute top-full left-0 right-0 z-10 mt-1 rounded-md border shadow-md bg-background'>
                  <ul className='py-1 max-h-[120px] overflow-y-auto'>
                    {filteredCities.map((city) => (
                      <li
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className='px-3 py-1 cursor-pointer hover:bg-hover text-sm'
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='flex gap-2 items-center mt-1'>
          <h3 className='text-xl font-bold'>{currentCity}</h3>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsEditing(true)}
            className='h-6 w-6 -mr-1'
          >
            <Pencil className='h-3 w-3' />
          </Button>
        </div>
        <p className='text-base font-medium text-text mt-1'>
          {data.description}
        </p>
        <p className='text-sm text-text font-medium mt-1'>{formattedToday}</p>

        {/* Temperature and Icon */}
        <div className='flex gap-2 items-center mt-1'>
          <div className='text-5xl font-bold leading-none'>
            {displayTemperature}
            <span className='text-2xl align-top'>{temperatureUnit}</span>
          </div>
          <img
            src={`http://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt='Weather icon'
            className='h-16 w-16'
          />
        </div>
        <div className='grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm'>
          <span className='text-gray-500'>Humidity</span>
          <span className='text-right'>{data.humidity}</span>
          <span className='text-gray-500'>Wind</span>
          <span className='text-right'>{data.windSpeed}</span>
        </div>

        {/* Daily Forecast */}
        <>
          <Separator className='my-2' />
          <div className='flex justify-between items-center '>
            {data.daily.slice(0, 5).map((hour, index) => (
              <div key={index} className='flex flex-col items-center'>
                <img
                  src={`http://openweathermap.org/img/wn/${hour.icon}.png`}
                  alt='Weather icon'
                  className='h-9 w-9'
                />
                <span className='text-[11px] text-text'>{hour.time}</span>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
}
