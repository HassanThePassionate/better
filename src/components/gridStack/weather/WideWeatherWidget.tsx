"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Pencil, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface WeatherWidget2x3Props {
  cityName: string;
  temperature?: number;
  description?: string;
  humidity?: string;
  windSpeed?: string;
  icon?: string;
}
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
// Sample data mapping for different cities
const cityData: Record<
  string,
  {
    temperature: number;
    description: string;
    humidity: string;
    windSpeed: string;
    icon: string;
    hourly: Array<{ time: string; icon: string }>;
  }
> = {
  London: {
    temperature: 12,
    description: "Heavy intensity rain",
    humidity: "77%",
    windSpeed: "11.17 m/s",
    icon: "10d",
    hourly: [
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
    hourly: [
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
    hourly: [
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
    hourly: [
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
    hourly: [
      { time: "10 AM", icon: "01d" },
      { time: "11 AM", icon: "01d" },
      { time: "12 PM", icon: "01d" },
      { time: "1 PM", icon: "02d" },
      { time: "2 PM", icon: "02d" },
      { time: "3 PM", icon: "01d" },
    ],
  },
};

export default function WideWeatherWidget({
  cityName,
  temperature,
  description,
  humidity,
  windSpeed,
  icon,
}: WeatherWidget2x3Props) {
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState(cityName);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Use provided data or fallback to sample data
  const data = {
    temperature: temperature ?? cityData[cityName]?.temperature ?? 15,
    description:
      description ?? cityData[cityName]?.description ?? "Partly cloudy",
    humidity: humidity ?? cityData[cityName]?.humidity ?? "65%",
    windSpeed: windSpeed ?? cityData[cityName]?.windSpeed ?? "5.0 m/s",
    icon: icon ?? cityData[cityName]?.icon ?? "01d",
    hourly: cityData[cityName]?.hourly ?? [
      { time: "10 AM", icon: "01d" },
      { time: "11 AM", icon: "01d" },
      { time: "12 PM", icon: "01d" },
      { time: "1 PM", icon: "01d" },
      { time: "2 PM", icon: "01d" },
      { time: "3 PM", icon: "01d" },
    ],
  };
  const today = new Date();

  const formattedToday = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setIsEditing(false);
    setShowResults(false);
  };
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );
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

  const temperatureUnit = isCelsius ? "°C" : "°F";

  return (
    <div className='w-full h-full bg-card rounded-[16px] shadow-sm overflow-hidden'>
      <div className='p-3 h-full flex flex-col'>
        <div className='flex justify-between items-start'>
          {/* Left section: City, Temperature, Description */}
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
          <div className='flex flex-col w-full'>
            <div className='flex items-center gap-2'>
              <h3 className='max-[1600px]:text-lg text-xl font-bold'>
                {currentCity}
              </h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(true)}
                className='h-6 w-6 -mr-1'
              >
                <Pencil className='h-3 w-3' />
              </Button>
            </div>

            <div className='flex items-center justify-between'>
              <p className='text-sm text-text font-medium mt-1'>
                {data.description}
              </p>
              <p className='max-[1600px]:text-xs text-sm text-text font-medium mt-1'>
                {formattedToday}
              </p>
            </div>
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center gap-2 mt-2 min-[1600px]:mb-6'>
                <div className='max-[1600px]:text-3xl text-[56px] font-bold leading-none'>
                  {displayTemperature}
                  <span className='text-lg align-top'>{temperatureUnit}</span>
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${data.icon}.png`}
                  alt='Weather icon'
                  className='max-[1600px]:h-12 max-[1600px]:w-12 h-[4rem] w-[4rem]'
                />
              </div>
              <div className=' text-sm mt-2'>
                <div>
                  <span className='text-gray-500'>Humidity:</span>{" "}
                  {data.humidity}
                </div>
                <div>
                  <span className='text-gray-500'>Wind:</span> {data.windSpeed}
                </div>
              </div>
            </div>
          </div>
          {/* Right section: Measurements and Controls */}
          <div className='flex flex-col items-end absolute top-3 right-3'>
            <div className='flex gap-1'>
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
          </div>
        </div>

        {/* Hourly Forecast */}

        <>
          <Separator className='my-2' />
          <div className='flex justify-between items-center mt-auto'>
            {data.hourly.slice(0, 5).map((hour, index) => (
              <div key={index} className='flex flex-col items-center'>
                <img
                  src={`http://openweathermap.org/img/wn/${hour.icon}.png`}
                  alt='Weather icon'
                  className='max-[1600px]:h-8 max-[1600px]:w-8 w-11 h-11'
                />
                <span className='max-[1600px]:text-[10px] text-xs text-gray-600'>
                  {hour.time}
                </span>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
}
