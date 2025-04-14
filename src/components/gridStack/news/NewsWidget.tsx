"use client";

import { useEffect, useState, useRef } from "react";

import { Clock, ChevronRight, Newspaper, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  imageUrl: string;
  category?: string;
}

interface NewsWidgetProps {
  width: 200 | 300;
  height: 200 | 300;
  title?: string;
}

export default function NewsWidget({
  width,
  height,
  title = "News",
}: NewsWidgetProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate fetching news data
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: "New climate policy announced by government officials",
        source: "The Daily News",
        time: "2h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Politics",
      },
      {
        id: 2,
        title: "Tech company launches revolutionary AI assistant",
        source: "Tech Today",
        time: "4h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Technology",
      },
      {
        id: 3,
        title: "Scientists discover new species in deep ocean",
        source: "Science Weekly",
        time: "5h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Science",
      },
      {
        id: 4,
        title: "Global markets reach all-time high amid economic recovery",
        source: "Financial Times",
        time: "6h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Finance",
      },
      {
        id: 5,
        title: "Major sports team wins championship after 20-year drought",
        source: "Sports Center",
        time: "8h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Sports",
      },
      {
        id: 6,
        title: "New streaming service launches with exclusive content",
        source: "Entertainment Weekly",
        time: "10h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Entertainment",
      },
      {
        id: 7,
        title: "Health experts recommend new dietary guidelines",
        source: "Health Today",
        time: "12h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Health",
      },
      {
        id: 8,
        title:
          "Electric vehicle sales surpass traditional cars in major market",
        source: "Auto News",
        time: "14h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Automotive",
      },
      {
        id: 9,
        title: "Famous artist unveils controversial new exhibition",
        source: "Arts & Culture",
        time: "16h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Arts",
      },
      {
        id: 10,
        title: "Space agency announces plans for new lunar mission",
        source: "Space Explorer",
        time: "18h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Space",
      },
      {
        id: 11,
        title: "Researchers develop breakthrough in renewable energy storage",
        source: "Science Daily",
        time: "20h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Science",
      },
      {
        id: 12,
        title: "New smartphone features revolutionary camera technology",
        source: "Tech Review",
        time: "22h ago",
        imageUrl: "/placeholder.svg?height=100&width=100",
        category: "Technology",
      },
    ];

    setNews(mockNews);
  }, []);

  const formattedTime = currentTime
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .toLowerCase();

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulate refresh delay
    setTimeout(() => {
      // Shuffle the news array to simulate new content
      const shuffledNews = [...news].sort(() => Math.random() - 0.5);
      setNews(shuffledNews);
      setCurrentTime(new Date());
      setIsRefreshing(false);

      // Scroll to top
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }, 1500);
  };

  return (
    <div className='relative overflow-hidden bg-card w-full h-full'>
      {/* Widget Content */}
      <div className='h-full flex flex-col'>
        {/* Widget Header */}
        <div className='px-4 pt-3.5 pb-1.5 flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <div className='w-5 h-5 rounded-[6px] bg-brand flex items-center justify-center shadow-sm'>
              <Newspaper className='w-3 h-3 ' />
            </div>
            <span className='text-[13px] font-semibold text-text'>{title}</span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={handleRefresh}
              className='w-5 h-5 flex items-center justify-center rounded-full  transition-colors'
              disabled={isRefreshing}
              aria-label='Refresh news'
            >
              <RefreshCw
                className={`w-3 h-3  ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <div className='text-[11px] text-text'>{formattedTime}</div>
          </div>
        </div>

        {/* News Items - Scrollable Area */}
        <ScrollArea className='   overflow-y-auto '>
          <div className='flex-1 pt-2 px-4  pb-2'>
            {news.map((item, index) => (
              <div
                key={item.id}
                className={`flex gap-3 ${
                  index !== 0 ? "mt-3" : ""
                } rounded-xl transition-colors duration-200`}
              >
                {/* Only show images for larger widgets */}
                {(width === 300 || height === 300) && (
                  <div className='shrink-0'>
                    <div className='w-[46px] h-[46px] rounded-[10px] overflow-hidden shadow-sm'>
                      <img
                        src='https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?cs=srgb&dl=pexels-brotin-biswas-158640-518543.jpg&fm=jpg'
                        alt={item.title}
                        width={46}
                        height={46}
                        className='object-cover w-full h-full'
                      />
                    </div>
                  </div>
                )}

                <div className='flex-1 min-w-0'>
                  {item.category && width === 300 && height === 300 && (
                    <span className='inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-brand text-text-primary mb-1'>
                      {item.category}
                    </span>
                  )}

                  <h3
                    className={`font-medium text-text ${
                      width === 200 && height === 200
                        ? "text-[12px] leading-[1.2] line-clamp-2"
                        : "text-[13px] leading-[1.3] line-clamp-2"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Only show source for larger widgets */}
                  {width === 300 && height === 300 && (
                    <div className='flex items-center mt-1 text-[11px] text-text'>
                      <span className='truncate'>{item.source}</span>
                      <span className='mx-1'>•</span>
                      <span className='flex items-center'>
                        <Clock className='w-2.5 h-2.5 mr-0.5' />
                        {item.time}
                      </span>
                    </div>
                  )}

                  {/* Show only time for medium widgets */}
                  {((width === 300 && height === 200) ||
                    (width === 200 && height === 300)) && (
                    <div className='mt-0.5 text-[11px] text-text flex items-center'>
                      <Clock className='w-2.5 h-2.5 mr-0.5' />
                      {item.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* See More Button - iOS style */}
        <div className='mt-auto mx-4 mb-3'>
          <button className='w-full flex items-center justify-between text-[13px] font-medium text-brand-hover py-1.5 px-3 rounded-xl transition-colors'>
            <span>Show More</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>
    </div>
  );
}
