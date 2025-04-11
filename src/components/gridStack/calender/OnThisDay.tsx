"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getHistoricalEvents, type WikipediaEvent } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, BookOpen, Gift, Skull } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface OnThisDayProps {
  selectedDate: Date;
}

export function OnThisDay({ selectedDate }: OnThisDayProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<WikipediaEvent[]>([]);
  const [births, setBirths] = useState<WikipediaEvent[]>([]);
  const [deaths, setDeaths] = useState<WikipediaEvent[]>([]);
  const [holidays, setHolidays] = useState<WikipediaEvent[]>([]);
  const [activeTab, setActiveTab] = useState("events");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2;

    const fetchHistoricalData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const month = selectedDate.getMonth() + 1; // API uses 1-indexed months
        const day = selectedDate.getDate();

        const data = await getHistoricalEvents(month, day);

        if (isMounted && data) {
          setEvents(data.events || []);
          setBirths(data.births || []);
          setDeaths(data.deaths || []);
          setHolidays(data.holidays || []);
        }
      } catch (error) {
        console.error("Failed to fetch historical events:", error);

        if (isMounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            setTimeout(fetchHistoricalData, 1000); // Retry after 1 second
            return;
          }

          setError("Failed to load historical events. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistoricalData();

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Render a single event
  const renderEvent = (event: WikipediaEvent) => (
    <div
      key={`${event.year}-${event.text.substring(0, 20)}`}
      className='p-3 bg-background rounded-xl mb-3 shadow-sm'
    >
      <div className='flex items-start rounded-xl'>
        <div className='bg-background text-brand rounded-lg px-2 py-1 text-sm font-medium mr-3 whitespace-nowrap'>
          {event.year}
        </div>
        <div className='flex-1'>
          <p className='text-sm text-foreground opacity-85'>{event.text}</p>
          {event.pages && event.pages[0]?.extract && (
            <p className='text-xs text-text mt-1 line-clamp-2'>
              {event.pages[0].extract}
            </p>
          )}
          {event.pages && event.pages[0]?.thumbnail && (
            <div className='mt-2'>
              <img
                src={event.pages[0].thumbnail.source || "/placeholder.svg"}
                alt={event.pages[0].title}
                className='rounded-md w-full max-h-32 object-cover'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Loading skeleton
  const renderSkeleton = () => (
    <div className='space-y-3 px-3'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='flex items-start p-3 bg-card rounded-xl'>
          <Skeleton className='h-8 w-16 rounded-lg mr-3' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-4/5' />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className='bg-card p-4 !rounded-xl'>
      <h3 className='text-lg font-semibold mb-4 flex items-center'>
        <Calendar className='h-5 w-5 mr-2 text-brand' />
        On This Day: {format(selectedDate, "MMMM d")}
      </h3>

      <Tabs
        defaultValue='events'
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className='grid grid-cols-4 mb-4'>
          <TabsTrigger value='events' className='flex items-center'>
            <Clock className='h-4 w-4 mr-1' />
            <span className='hidden sm:inline'>Events</span>
          </TabsTrigger>
          <TabsTrigger value='births' className='flex items-center'>
            <Gift className='h-4 w-4 mr-1' />
            <span className='hidden sm:inline'>Births</span>
          </TabsTrigger>
          <TabsTrigger value='deaths' className='flex items-center'>
            <Skull className='h-4 w-4 mr-1' />
            <span className='hidden sm:inline'>Deaths</span>
          </TabsTrigger>
          <TabsTrigger value='holidays' className='flex items-center'>
            <BookOpen className='h-4 w-4 mr-1' />
            <span className='hidden sm:inline'>Holidays</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className='h-[200px]'>
          {error ? (
            <div className='text-center py-6'>
              <p className='text-error mb-2'>{error}</p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  const month = selectedDate.getMonth() + 1;
                  const day = selectedDate.getDate();
                  getHistoricalEvents(month, day)
                    .then((data) => {
                      if (data) {
                        setEvents(data.events || []);
                        setBirths(data.births || []);
                        setDeaths(data.deaths || []);
                        setHolidays(data.holidays || []);
                      }
                      setLoading(false);
                    })
                    .catch((err) => {
                      console.error("Retry failed:", err);
                      setError(
                        "Failed to load historical events. Please try again later."
                      );
                      setLoading(false);
                    });
                }}
                className='mt-2'
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value='events' className='mt-0'>
                {loading ? (
                  renderSkeleton()
                ) : events.length > 0 ? (
                  <div className='px-3'>{events.map(renderEvent)}</div>
                ) : (
                  <div className='text-center py-4 text-text'>
                    No historical events found for this day.
                  </div>
                )}
              </TabsContent>

              <TabsContent value='births' className='mt-0'>
                {loading ? (
                  renderSkeleton()
                ) : births.length > 0 ? (
                  <div className='px-3'>{births.map(renderEvent)}</div>
                ) : (
                  <div className='text-center py-4 text-text'>
                    No notable births found for this day.
                  </div>
                )}
              </TabsContent>

              <TabsContent value='deaths' className='mt-0'>
                {loading ? (
                  renderSkeleton()
                ) : deaths.length > 0 ? (
                  <div className='px-3'>{deaths.map(renderEvent)}</div>
                ) : (
                  <div className='text-center py-4 text-text'>
                    No notable deaths found for this day.
                  </div>
                )}
              </TabsContent>

              <TabsContent value='holidays' className='mt-0'>
                {loading ? (
                  renderSkeleton()
                ) : holidays.length > 0 ? (
                  <div className='px-3'>{holidays.map(renderEvent)}</div>
                ) : (
                  <div className='text-center py-4 text-text'>
                    No holidays found for this day.
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
