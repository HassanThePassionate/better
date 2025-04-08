"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

// Sample data - in a real app, this would come from an API
const weatherData = {
  city: "London",
  description: "Heavy intensity rain",
  date: "Sunday, 12 April 2020",
  temperature: 12,
  icon: "10d",
  measurements: {
    pressure: "1001 hPa",
    humidity: "77%",
    windSpeed: "11.17 meters / sec",
  },
  hourly: [
    { time: "10 AM", icon: "10d" },
    { time: "11 AM", icon: "09d" },
    { time: "12 PM", icon: "09d" },
    { time: "1 PM", icon: "09d" },
    { time: "2 PM", icon: "10d" },
    { time: "3 PM", icon: "02d" },
  ],
};

// Sample cities for search
const cities = [
  "Bath",
  "Birmingham",
  "Brighton and Hove",
  "Bristol",
  "Cambridge",
  "Canterbury",
  "Carlisle",
  "Chester",
  "Chichester",
  "Coventry",
  "Derby",
  "Durham",
  "Ely",
  "Exeter",
  "Gloucester",
  "Hereford",
  "Kingston upon Hull",
  "Lancaster",
  "Leeds",
  "Leicester",
  "Lichfield",
  "Lincoln",
  "Liverpool",
  "London",
  "Manchester",
  "Newcastle upon Tyne",
  "Norwich",
  "Nottingham",
  "Oxford",
  "Peterborough",
  "Plymouth",
  "Portsmouth",
  "Preston",
  "Ripon",
  "Salford",
  "Salisbury",
  "Sheffield",
  "Southampton",
  "St. Albans",
  "Stoke-on-Trent",
  "Sunderland",
  "Truro",
  "Wakefield",
  "Wells",
  "Westminster",
  "Winchester",
  "Wolverhampton",
  "Worcester",
  "York",
  "New York",
  "Paris",
  "Tokyo",
  "Sydney",
];

export default function WeatherCard() {
  const [currentCity, setCurrentCity] = useState(weatherData.city);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showHourly, setShowHourly] = useState(false);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setIsEditing(false);
    setShowResults(false);
    // In a real app, you would fetch weather data for the selected city here
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSearchQuery(currentCity);
    setShowResults(true);
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
    ? weatherData.temperature
    : Math.round((weatherData.temperature * 9) / 5 + 32);

  const temperatureUnit = isCelsius ? "°C" : "°F";

  return (
    <div className='w-full h-full bg-card rounded-3xl shadow-lg'>
      <div className='p-6 bg-card  rounded-3xl '>
        {/* Controls */}
        <div className='flex justify-end gap-2 mb-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleRefresh}
            disabled={isLoading}
            className='h-8 w-8'
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          <Button
            variant='ghost'
            size='icon'
            onClick={toggleTemperatureUnit}
            className='h-8 w-8'
          >
            <span className='text-xs font-bold'>{isCelsius ? "°F" : "°C"}</span>
          </Button>
        </div>

        {/* City and Edit Section */}
        <div className='flex items-center mb-1'>
          {isEditing ? (
            <div className='relative w-full'>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for a city...'
                className='w-full input'
                autoFocus
              />
              {showResults && (
                <div className='absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-background  '>
                  <ul className='py-1'>
                    {filteredCities.slice(0, 5).map((city) => (
                      <li
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className='px-3 py-1 cursor-pointer hover:bg-hover'
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <h1 className='text-3xl font-bold'>{currentCity}</h1>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleEditClick}
                className='h-8 w-8 ml-2'
              >
                <Pencil className='h-4 w-4' />
              </Button>
            </>
          )}
        </div>

        {/* Weather Description and Date */}
        <p className='text-xl font-medium text-gray-800'>
          {weatherData.description}
        </p>
        <p className='uppercase text-sm mb-6 text-gray-500'>
          {weatherData.date}
        </p>

        {/* Temperature and Measurements */}
        <div className='flex justify-between items-start mb-6'>
          <div className='flex items-start'>
            <div className='text-7xl font-bold leading-none'>
              {displayTemperature}
              <span className='text-3xl align-top'>{temperatureUnit}</span>
            </div>
          </div>

          <div className='flex-shrink-0'>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              alt='Weather icon'
              className='h-20 w-20'
            />
          </div>

          <div className='grid grid-cols-2 gap-x-4 gap-y-1 text-right'>
            <div className='text-gray-500'>Pressure</div>
            <div>{weatherData.measurements.pressure}</div>
            <div className='text-gray-500'>Humidity</div>
            <div>{weatherData.measurements.humidity}</div>
            <div className='text-gray-500'>Wind speed</div>
            <div>{weatherData.measurements.windSpeed}</div>
          </div>
        </div>

        <Separator className='my-6' />

        {/* Hourly Forecast Toggle */}
        <div className='flex justify-between items-center mb-2 '>
          <h3 className='text-sm font-medium text-gray-700'>Hourly Forecast</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowHourly(!showHourly)}
            className='h-6 px-2'
          >
            {showHourly ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>

        {/* Hourly Forecast */}
        {showHourly && (
          <div className='grid grid-cols-6 gap-2 '>
            {weatherData.hourly.map((hour, index) => (
              <div key={index} className='flex flex-col items-center'>
                <img
                  src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                  alt='Weather icon'
                  className='h-12 w-12'
                />
                <span className='text-gray-600'>{hour.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
