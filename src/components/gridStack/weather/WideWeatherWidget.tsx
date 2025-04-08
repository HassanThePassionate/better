"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface WeatherWidget2x4Props {
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

export default function WeatherWidget2x4({
  cityName,
  temperature,
  description,
  humidity,
  windSpeed,
  icon,
}: WeatherWidget2x4Props) {
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showHourly, setShowHourly] = useState(true);

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
    <div className='h-full w-full bg-card shadow-sm overflow-hidden'>
      <div className='p-3 h-full flex flex-col'>
        <div className='flex justify-between items-start'>
          {/* Left section: City, Temperature, Description */}
          <div className='flex flex-col'>
            <h3 className='text-lg font-bold'>{cityName}</h3>
            <div className='flex items-center mt-2'>
              <div className='text-3xl font-bold leading-none'>
                {displayTemperature}
                <span className='text-lg align-top'>{temperatureUnit}</span>
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${data.icon}.png`}
                alt='Weather icon'
                className='h-12 w-12'
              />
            </div>
            <p className='text-sm text-gray-700 mt-1'>{data.description}</p>
          </div>

          {/* Right section: Measurements and Controls */}
          <div className='flex flex-col items-end'>
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
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowHourly(!showHourly)}
                className='h-6 w-6'
              >
                {showHourly ? (
                  <ChevronUp className='h-3 w-3' />
                ) : (
                  <ChevronDown className='h-3 w-3' />
                )}
              </Button>
            </div>
            <div className='text-right text-sm mt-2'>
              <div>
                <span className='text-gray-500'>Humidity:</span> {data.humidity}
              </div>
              <div>
                <span className='text-gray-500'>Wind:</span> {data.windSpeed}
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        {showHourly && (
          <>
            <Separator className='my-2' />
            <div className='flex justify-between items-center mt-auto'>
              {data.hourly.slice(0, 6).map((hour, index) => (
                <div key={index} className='flex flex-col items-center'>
                  <img
                    src={`http://openweathermap.org/img/wn/${hour.icon}.png`}
                    alt='Weather icon'
                    className='h-8 w-8'
                  />
                  <span className='text-[10px] text-gray-600'>{hour.time}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
