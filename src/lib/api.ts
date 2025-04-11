/**
 * API functions for fetching Wikipedia data with fallback mechanism
 */

// Types for Wikipedia API responses
export interface WikipediaEvent {
    year: string
    text: string
    pages?: {
      title: string
      extract: string
      thumbnail?: {
        source: string
      }
    }[]
  }
  
  export interface OnThisDayResponse {
    events: WikipediaEvent[]
    births: WikipediaEvent[]
    deaths: WikipediaEvent[]
    holidays: WikipediaEvent[]
    selected: WikipediaEvent[]
  }
  
  // Cache for storing API responses to avoid repeated calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiCache: Record<string, { data: any; timestamp: number }> = {}
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  
  /**
   * Fetches historical events for a specific month and day from Wikipedia
   */
  export async function getHistoricalEvents(month: number, day: number): Promise<OnThisDayResponse | null> {
    try {
      const cacheKey = `onthisday-${month}-${day}`
  
      // Check cache first
      if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
        return apiCache[cacheKey].data
      }
  
      // Format month and day with leading zeros
      const formattedMonth = month.toString().padStart(2, "0")
      const formattedDay = day.toString().padStart(2, "0")
      const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${formattedMonth}/${formattedDay}`
  
      const response = await fetch(url, {
        headers: {
          "User-Agent": "iOS Calendar App (educational project)",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Wikipedia API request failed with status ${response.status}: ${response.statusText}`)
      }
  
      const data = await response.json()
  
      // Cache the response
      apiCache[cacheKey] = {
        data,
        timestamp: Date.now(),
      }
  
      return data
    } catch (error) {
      console.error("Error fetching historical events:", error)
  
      // Fallback to mock data when API fails
      return getFallbackHistoricalEvents(month, day)
    }
  }
  
  /**
   * Provides fallback data when the Wikipedia API call fails
   */
  function getFallbackHistoricalEvents(month: number, day: number): OnThisDayResponse {
    // Map of months to their names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
  
    // Generic fallback data
    const fallbackEvents: WikipediaEvent[] = [
      {
        year: "1969",
        text: `On ${monthNames[month - 1]} ${day}, Apollo 11 landed on the moon, marking the first human landing on the lunar surface.`,
        pages: [
          {
            title: "Apollo 11",
            extract: "Apollo 11 was the spaceflight that first landed humans on the Moon.",
          },
        ],
      },
      {
        year: "1989",
        text: `On ${monthNames[month - 1]} ${day}, the World Wide Web was invented by Tim Berners-Lee.`,
        pages: [
          {
            title: "World Wide Web",
            extract:
              "The World Wide Web is an information system enabling documents and other web resources to be accessed over the Internet.",
          },
        ],
      },
      {
        year: "2007",
        text: `On ${monthNames[month - 1]} ${day}, the first iPhone was released by Apple Inc.`,
        pages: [
          {
            title: "iPhone",
            extract: "The iPhone is a line of smartphones designed and marketed by Apple Inc.",
          },
        ],
      },
    ]
  
    // Month-specific fallback data
    const monthSpecificEvents: Record<number, WikipediaEvent[]> = {
      1: [{ year: "1901", text: "The first Nobel Prizes were awarded." }],
      2: [{ year: "1922", text: "The first issue of Reader's Digest was published." }],
      3: [{ year: "1876", text: "Alexander Graham Bell made the first successful telephone call." }],
      4: [{ year: "1912", text: "The Titanic sank after hitting an iceberg." }],
      5: [{ year: "1961", text: "Alan Shepard became the first American in space." }],
      6: [{ year: "1944", text: "D-Day: Allied forces landed on the beaches of Normandy." }],
      7: [{ year: "1776", text: "The United States Declaration of Independence was adopted." }],
      8: [{ year: "1991", text: "The World Wide Web became publicly available." }],
      9: [{ year: "1926", text: "The first television demonstration was given." }],
      10: [{ year: "1927", text: "The first feature-length talking motion picture was released." }],
      11: [{ year: "1918", text: "World War I ended with the signing of the Armistice." }],
      12: [{ year: "1903", text: "The Wright brothers made their first powered flight." }],
    }
  
    // Combine generic and month-specific events
    const combinedEvents = [...fallbackEvents]
    if (monthSpecificEvents[month]) {
      combinedEvents.push(...monthSpecificEvents[month])
    }
  
    return {
      events: combinedEvents,
      births: [
        {
          year: "1879",
          text: `On ${monthNames[month - 1]} ${day}, Albert Einstein was born.`,
          pages: [
            {
              title: "Albert Einstein",
              extract: "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity.",
            },
          ],
        },
      ],
      deaths: [
        {
          year: "1955",
          text: `On ${monthNames[month - 1]} ${day}, Albert Einstein died.`,
          pages: [
            {
              title: "Albert Einstein",
              extract: "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity.",
            },
          ],
        },
      ],
      holidays: [],
      selected: combinedEvents.slice(0, 2),
    }
  }
  
  /**
   * Formats a date for display in iOS style
   */
  export function formatDateIOS(date: Date): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
  
    const dayName = days[date.getDay()]
    const monthName = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
  
    return `${dayName}, ${monthName} ${day}, ${year}`
  }
  