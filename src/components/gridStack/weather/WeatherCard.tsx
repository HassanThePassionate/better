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
    daily: Array<{ day: string; icon: string; high: number; low: number }>;
  }
> = {
  London: {
    temperature: 12,
    description: "Heavy intensity rain",
    humidity: "77%",
    windSpeed: "11.17 m/s",
    icon: "10d",
    daily: [
      { day: "Mon", icon: "10d", high: 13, low: 8 },
      { day: "Tue", icon: "09d", high: 12, low: 7 },
      { day: "Wed", icon: "04d", high: 14, low: 9 },
      { day: "Thu", icon: "01d", high: 16, low: 10 },
    ],
  },
  "New York": {
    temperature: 18,
    description: "Few clouds",
    humidity: "58%",
    windSpeed: "6.7 m/s",
    icon: "02d",
    daily: [
      { day: "Mon", icon: "02d", high: 19, low: 12 },
      { day: "Tue", icon: "01d", high: 21, low: 14 },
      { day: "Wed", icon: "01d", high: 23, low: 15 },
      { day: "Thu", icon: "03d", high: 20, low: 13 },
    ],
  },
  Paris: {
    temperature: 14,
    description: "Clear sky",
    humidity: "65%",
    windSpeed: "8.2 m/s",
    icon: "01d",
    daily: [
      { day: "Mon", icon: "01d", high: 15, low: 9 },
      { day: "Tue", icon: "02d", high: 16, low: 10 },
      { day: "Wed", icon: "03d", high: 14, low: 8 },
      { day: "Thu", icon: "01d", high: 17, low: 11 },
    ],
  },
  Tokyo: {
    temperature: 21,
    description: "Scattered clouds",
    humidity: "72%",
    windSpeed: "4.5 m/s",
    icon: "03d",
    daily: [
      { day: "Mon", icon: "03d", high: 22, low: 16 },
      { day: "Tue", icon: "04d", high: 20, low: 15 },
      { day: "Wed", icon: "10d", high: 19, low: 14 },
      { day: "Thu", icon: "01d", high: 23, low: 17 },
    ],
  },
  Sydney: {
    temperature: 23,
    description: "Clear sky",
    humidity: "60%",
    windSpeed: "9.3 m/s",
    icon: "01d",
    daily: [
      { day: "Mon", icon: "01d", high: 24, low: 18 },
      { day: "Tue", icon: "01d", high: 25, low: 19 },
      { day: "Wed", icon: "02d", high: 23, low: 17 },
      { day: "Thu", icon: "02d", high: 22, low: 16 },
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
  const convertTemp = (temp: number) =>
    isCelsius ? temp : Math.round((temp * 9) / 5 + 32);

  const temperatureUnit = isCelsius ? "°C" : "°F";

  return (
    <div className='h-full w-full bg-card shadow-sm'>
      <div className='p-3 h-full flex flex-col'>
        {/* Controls */}
        <div className='flex justify-end gap-1'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleRefresh}
            disabled={isLoading}
            className='h-6 w-6'
          >
            <RefreshCw
              className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
            />
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

        {/* City */}
        <div className='absolute top-5 '>
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
                <div className='absolute top-full left-0 right-0 z-10 mt-1 rounded-md border shadow-md bg-white'>
                  <ul className='py-1 max-h-[120px] overflow-y-auto'>
                    {filteredCities.map((city) => (
                      <li
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className='px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm'
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
        <div className='flex justify-between items-center'>
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

        {/* Temperature and Icon */}
        <div className='flex justify-between items-center mt-1'>
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

        {/* Description */}
        <p className='text-base text-gray-700 mt-1'>{data.description}</p>

        {/* Measurements */}
        <div className='grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm'>
          <span className='text-gray-500'>Humidity</span>
          <span className='text-right'>{data.humidity}</span>
          <span className='text-gray-500'>Wind</span>
          <span className='text-right'>{data.windSpeed}</span>
        </div>

        {/* Daily Forecast */}
        <div className='mt-2'>
          <Separator className='my-1' />
          <p className='text-xs font-medium text-gray-500'>4-Day Forecast</p>
          <div className='grid grid-cols-4 gap-1 mt-1'>
            {data.daily.map((day, index) => (
              <div key={index} className='flex flex-col items-center'>
                <span className='text-[10px] font-medium'>{day.day}</span>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                  alt='Weather icon'
                  className='h-8 w-8 -my-1'
                />
                <div className='flex gap-1 text-[10px]'>
                  <span className='font-medium'>{convertTemp(day.high)}</span>
                  <span className='text-gray-500'>{convertTemp(day.low)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
