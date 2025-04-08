"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RefreshCw, Pencil } from "lucide-react";

interface WeatherWidgetProps {
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
  }
> = {
  London: {
    temperature: 12,
    description: "Heavy intensity rain",
    humidity: "77%",
    windSpeed: "11.17 m/s",
    icon: "10d",
  },
  "New York": {
    temperature: 18,
    description: "Few clouds",
    humidity: "58%",
    windSpeed: "6.7 m/s",
    icon: "02d",
  },
  Paris: {
    temperature: 14,
    description: "Clear sky",
    humidity: "65%",
    windSpeed: "8.2 m/s",
    icon: "01d",
  },
  Tokyo: {
    temperature: 21,
    description: "Scattered clouds",
    humidity: "72%",
    windSpeed: "4.5 m/s",
    icon: "03d",
  },
  Sydney: {
    temperature: 23,
    description: "Clear sky",
    humidity: "60%",
    windSpeed: "9.3 m/s",
    icon: "01d",
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

export default function WeatherWidget({
  cityName,
  temperature,
  description,
  humidity,
  windSpeed,
  icon,
}: WeatherWidgetProps) {
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

  const temperatureUnit = isCelsius ? "°C" : "°F";

  return (
    <div
      className={`w-full h-full bg-card shadow-sm transition-all duration-300`}
    >
      <div className='bg-card h-full w-full px-3 py-1.5'>
        {/* Controls */}
        <div className='flex justify-end gap-1 mb-1'>
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
        {isEditing ? (
          <div className='relative mb-2'>
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
                <ul className='py-1'>
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
        ) : (
          <div className='flex justify-between items-center'>
            <h3 className='text-base font-bold'>{currentCity}</h3>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsEditing(true)}
              className='h-6 w-6 -mr-1'
            >
              <Pencil className='h-3 w-3' />
            </Button>
          </div>
        )}

        {/* Temperature and Icon */}
        <div className='flex justify-between items-center mt-1'>
          <div className='text-2xl font-bold leading-none'>
            {displayTemperature}
            <span className='text-xl align-top'>{temperatureUnit}</span>
          </div>
          <img
            src={`http://openweathermap.org/img/wn/${data.icon}.png`}
            alt='Weather icon'
            className='h-12 w-12'
          />
        </div>

        {/* Description */}
        <p className='text-sm text-gray-700 mt-1'>{data.description}</p>

        {/* Measurements */}
        <div className='grid grid-cols-2 gap-x-2 mt-3 px-1 text-sm'>
          <span className='text-gray-500'>Humidity</span>
          <span className='text-right'>{data.humidity}</span>
          <span className='text-gray-500'>Wind</span>
          <span className='text-right'>{data.windSpeed}</span>
        </div>
      </div>
    </div>
  );
}
