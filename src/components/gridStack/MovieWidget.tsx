"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function MovieWidget() {
  const [selectedMovie, setSelectedMovie] = useState(0);
  const [contentType, setContentType] = useState("movies"); // "movies" or "series"
  const [category, setCategory] = useState("trending"); // "trending", "new", "region"
  const [isScrolling, setIsScrolling] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if can scroll
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setCanScrollDown(
          scrollHeight > clientHeight &&
            scrollTop < scrollHeight - clientHeight - 10
        );
      }
    };

    // Initial check
    checkScroll();

    // Add scroll event listener
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [contentType, category]);

  // Handle scroll events
  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      // Hide scrollbar after 1.5 seconds of inactivity
      setTimeout(() => setIsScrolling(false), 1500);
    }

    // Check if we can scroll down
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollDown(
        scrollHeight > clientHeight &&
          scrollTop < scrollHeight - clientHeight - 10
      );
    }
  };

  // Sample data
  const content = {
    movies: {
      trending: [
        {
          title: "Inception",
          year: 2010,
          rating: 8.8,
          genre: "Sci-Fi",
          image:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
        },
        {
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          genre: "Action",
          image:
            "https://images.moviesanywhere.com/bd47f9b7d090170d79b3085804075d41/c6140695-a35f-46e2-adb7-45ed829fc0c0.jpg",
        },
        {
          title: "Pulp Fiction",
          year: 1994,
          rating: 8.9,
          genre: "Crime",
          image:
            "https://alternativemovieposters.com/wp-content/uploads/2021/04/RuizBurgos_PulpFiction.jpg",
        },
        {
          title: "The Godfather",
          year: 1972,
          rating: 9.2,
          genre: "Crime",
          image:
            "https://m.media-amazon.com/images/M/MV5BMDIxMzBlZDktZjMxNy00ZGI4LTgxNDEtYWRlNzRjMjJmOGQ1XkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "The Matrix",
          year: 1999,
          rating: 8.7,
          genre: "Sci-Fi",
          image:
            "https://play-lh.googleusercontent.com/c-9-NNgQWxdKa7O01p9PHSd3W2eoGoZuO5gAfE_keFgm2xkEUvSLsaYs8L8C2TiELQgp-A=w240-h480-rw",
        },
        {
          title: "Parasite",
          year: 2019,
          rating: 8.5,
          genre: "Thriller",
          image:
            "https://images.squarespace-cdn.com/content/v1/5a4488a6ace864a5558b6738/1575653762434-4HIFKWKBP8W893A50I95/p16965677_v_v8_aa.jpg",
        },
        {
          title: "Interstellar",
          year: 2014,
          rating: 8.6,
          genre: "Sci-Fi",
          image:
            "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
        },
        {
          title: "Fight Club",
          year: 1999,
          rating: 8.8,
          genre: "Drama",
          image:
            "https://images.moviesanywhere.com/46107eaa3f3912a1b0b6e181d8967257/15551ffc-4a96-4e6c-a024-511417656c7e.jpg?h=375&resize=fit&w=250",
        },
        {
          title: "Goodfellas",
          year: 1990,
          rating: 8.7,
          genre: "Crime",
          image:
            "https://m.media-amazon.com/images/M/MV5BN2E5NzI2ZGMtY2VjNi00YTRjLWI1MDUtZGY5OWU1MWJjZjRjXkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "The Shawshank Redemption",
          year: 1994,
          rating: 9.3,
          genre: "Drama",
          image:
            "https://musicart.xboxlive.com/7/e0ee5100-0000-0000-0000-000000000002/504/image.jpg",
        },
        {
          title: "Forrest Gump",
          year: 1994,
          rating: 8.8,
          genre: "Drama",
          image:
            "https://m.media-amazon.com/images/I/81VsuWC+K+L._AC_UF1000,1000_QL80_.jpg",
        },
        {
          title: "The Silence of the Lambs",
          year: 1991,
          rating: 8.6,
          genre: "Thriller",
          image:
            "https://m.media-amazon.com/images/M/MV5BNDdhOGJhYzctYzYwZC00YmI2LWI0MjctYjg4ODdlMDExYjBlXkEyXkFqcGc@._V1_.jpg",
        },
      ],
      new: [
        {
          title: "Dune",
          year: 2021,
          rating: 8.0,
          genre: "Sci-Fi",
          image:
            "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "No Time to Die",
          year: 2021,
          rating: 7.3,
          genre: "Action",
          image:
            "https://pics.filmaffinity.com/No_Time_to_Die-525355918-large.jpg",
        },
        {
          title: "The Batman",
          year: 2022,
          rating: 7.9,
          genre: "Action",
          image:
            "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        },
        {
          title: "Top Gun: Maverick",
          year: 2022,
          rating: 8.3,
          genre: "Action",
          image:
            "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",
        },
        {
          title: "Everything Everywhere All at Once",
          year: 2022,
          rating: 8.0,
          genre: "Sci-Fi",
          image:
            "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Everything_Everywhere_All_at_Once.jpg/250px-Everything_Everywhere_All_at_Once.jpg",
        },
        {
          title: "The Northman",
          year: 2022,
          rating: 7.1,
          genre: "Action",
          image:
            "https://m.media-amazon.com/images/M/MV5BYzgwM2JiY2MtNWQ5OC00NDc1LWExMjYtYmY2YjViZmViYWM5XkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "Nope",
          year: 2022,
          rating: 6.9,
          genre: "Horror",
          image:
            "https://www.uphe.com/sites/default/files/styles/scale__344w_/public/2022/09/NOPE_DVD_PosterArt_191329226124.jpg?itok=WoQtY0uY",
        },
        {
          title: "Black Panther: Wakanda Forever",
          year: 2022,
          rating: 6.8,
          genre: "Action",
          image:
            "https://lumiere-a.akamaihd.net/v1/images/pp_disney_blackpanther_wakandaforever_1289_d3419b8f.jpeg",
        },
        {
          title: "Avatar: The Way of Water",
          year: 2022,
          rating: 7.7,
          genre: "Sci-Fi",
          image:
            "https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        },
      ],
      region: [
        {
          title: "Parasite",
          year: 2019,
          rating: 8.5,
          genre: "Thriller",
          image:
            "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "Drive My Car",
          year: 2021,
          rating: 7.6,
          genre: "Drama",
          image:
            "https://play-lh.googleusercontent.com/uw3BFeccaH-jYlE66BmDcj8eUb1czqNOk1VPEijko_0R_cREk7W2nZ6CGo4mXb_TN7DXNRAv4YrXtCO6YqHV",
        },
        {
          title: "RRR",
          year: 2022,
          rating: 7.8,
          genre: "Action",
          image:
            "https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        },
        {
          title: "Pan's Labyrinth",
          year: 2006,
          rating: 8.2,
          genre: "Fantasy",
          image:
            "https://m.media-amazon.com/images/M/MV5BOTc1NTAxMWItMWFlNy00MmU2LTkwMTMtNzMwOTg5OTQ5YTFiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        },
        {
          title: "The Northman",
          year: 2022,
          rating: 7.1,
          genre: "Action",
          image:
            "https://m.media-amazon.com/images/M/MV5BYzgwM2JiY2MtNWQ5OC00NDc1LWExMjYtYmY2YjViZmViYWM5XkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "Nope",
          year: 2022,
          rating: 6.9,
          genre: "Horror",
          image:
            "https://www.uphe.com/sites/default/files/styles/scale__344w_/public/2022/09/NOPE_DVD_PosterArt_191329226124.jpg?itok=WoQtY0uY",
        },
        {
          title: "Black Panther: Wakanda Forever",
          year: 2022,
          rating: 6.8,
          genre: "Action",
          image:
            "https://lumiere-a.akamaihd.net/v1/images/pp_disney_blackpanther_wakandaforever_1289_d3419b8f.jpeg",
        },
        {
          title: "Avatar: The Way of Water",
          year: 2022,
          rating: 7.7,
          genre: "Sci-Fi",
          image:
            "https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        },
      ],
    },
    series: {
      trending: [
        {
          title: "Inception",
          year: 2010,
          rating: 8.8,
          genre: "Sci-Fi",
          image:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
        },
        {
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          genre: "Action",
          image:
            "https://images.moviesanywhere.com/bd47f9b7d090170d79b3085804075d41/c6140695-a35f-46e2-adb7-45ed829fc0c0.jpg",
        },
        {
          title: "Pulp Fiction",
          year: 1994,
          rating: 8.9,
          genre: "Crime",
          image:
            "https://alternativemovieposters.com/wp-content/uploads/2021/04/RuizBurgos_PulpFiction.jpg",
        },
        {
          title: "The Godfather",
          year: 1972,
          rating: 9.2,
          genre: "Crime",
          image:
            "https://m.media-amazon.com/images/M/MV5BMDIxMzBlZDktZjMxNy00ZGI4LTgxNDEtYWRlNzRjMjJmOGQ1XkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "The Matrix",
          year: 1999,
          rating: 8.7,
          genre: "Sci-Fi",
          image:
            "https://play-lh.googleusercontent.com/c-9-NNgQWxdKa7O01p9PHSd3W2eoGoZuO5gAfE_keFgm2xkEUvSLsaYs8L8C2TiELQgp-A=w240-h480-rw",
        },
        {
          title: "Parasite",
          year: 2019,
          rating: 8.5,
          genre: "Thriller",
          image:
            "https://images.squarespace-cdn.com/content/v1/5a4488a6ace864a5558b6738/1575653762434-4HIFKWKBP8W893A50I95/p16965677_v_v8_aa.jpg",
        },
      ],
      new: [
        {
          title: "Dark",
          year: 2017,
          rating: 8.7,
          genre: "Sci-Fi",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT02dPL6fiPxGmMNqfOqG7OEJqdzv3fhQJgBA&s",
        },
        {
          title: "Narcos",
          year: 2015,
          rating: 8.8,
          genre: "Crime",
          image:
            "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11993086_b_v12_af.jpg",
        },
        {
          title: "Elite",
          year: 2018,
          rating: 7.4,
          genre: "Drama",
          image:
            "https://pics.filmaffinity.com/Elite_TV_Series-329447208-large.jpg",
        },
        {
          title: "Squid Game",
          year: 2021,
          rating: 8.0,
          genre: "Thriller",
          image:
            "https://resizing.flixster.com/pEBczBamx-gHmTasBaajPymDTN0=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvNjdhNjc3MDMtMThlNS00MTdmLWI5MGYtNjFkMjViZjJlZmFkLmpwZw==",
        },
        {
          title: "Money Heist",
          year: 2017,
          rating: 8.2,
          genre: "Crime",
          image:
            "https://resizing.flixster.com/ITt1FPrFePNR6FSqZrZK7BocG2U=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vUlRUVjEwMTMyOTMud2VicA==",
        },
      ],
      region: [
        {
          title: "Squid Game",
          year: 2021,
          rating: 8.0,
          genre: "Thriller",
          image:
            "https://resizing.flixster.com/pEBczBamx-gHmTasBaajPymDTN0=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvNjdhNjc3MDMtMThlNS00MTdmLWI5MGYtNjFkMjViZjJlZmFkLmpwZw==",
        },
        {
          title: "Money Heist",
          year: 2017,
          rating: 8.2,
          genre: "Crime",
          image:
            "https://resizing.flixster.com/ITt1FPrFePNR6FSqZrZK7BocG2U=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vUlRUVjEwMTMyOTMud2VicA==",
        },
        {
          title: "Dark",
          year: 2017,
          rating: 8.7,
          genre: "Sci-Fi",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT02dPL6fiPxGmMNqfOqG7OEJqdzv3fhQJgBA&s",
        },
        {
          title: "Narcos",
          year: 2015,
          rating: 8.8,
          genre: "Crime",
          image:
            "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11993086_b_v12_af.jpg",
        },
        {
          title: "Elite",
          year: 2018,
          rating: 7.4,
          genre: "Drama",
          image:
            "https://pics.filmaffinity.com/Elite_TV_Series-329447208-large.jpg",
        },
        {
          title: "Kingdom",
          year: 2019,
          rating: 8.3,
          genre: "Horror",
          image:
            "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Kingdom_2025_Film_Poster.jpg/220px-Kingdom_2025_Film_Poster.jpg",
        },
        {
          title: "Lupin",
          year: 2021,
          rating: 7.5,
          genre: "Crime",
          image:
            "https://m.media-amazon.com/images/M/MV5BYTIwMjkwYTQtMmQzMC00NGExLTk3ZGQtNTViMGY4ZTZjOGI3XkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "The Rain",
          year: 2018,
          rating: 6.8,
          genre: "Sci-Fi",
          image:
            "https://m.media-amazon.com/images/M/MV5BMzgwMGVlNjUtMGY4MC00MzBlLWE5YWUtY2NmODZmMmY1ZGEzXkEyXkFqcGc@._V1_.jpg",
        },
        {
          title: "3%",
          year: 2016,
          rating: 7.4,
          genre: "Thriller",
          image:
            "https://hips.hearstapps.com/hmg-prod/images/716riayrvwl-ac-sl1500-1595956613.jpg",
        },
      ],
    },
  };

  // Get current content based on selections
  const currentContent =
    content[contentType as keyof typeof content][
      category as keyof typeof content.movies
    ];

  // Reset selected movie when changing content type or category
  useEffect(() => {
    setSelectedMovie(0);
    // Reset scroll position
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [contentType, category]);

  // Category label mapping
  const categoryLabels = {
    trending: "Trending",
    new: "New Release",
    region: "In Your Region",
  };

  return (
    <div className='w-full h-full bg-card backdrop-blur-xl text-text rounded-[16px] overflow-hidden shadow-lg border border-border '>
      {/* iOS-style widget header with segmented control */}
      <div className='px-3 pt-3 pb-2'>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-sm font-semibold'>Entertainment</h2>
          <div className='text-[10px] text-text font-medium'>
            {categoryLabels[category as keyof typeof categoryLabels]}
          </div>
        </div>

        {/* iOS-style segmented control for Movies/Series */}
        <div className='flex bg-hover rounded-lg p-0.5 mb-2'>
          <button
            className={`flex-1 text-[10px] font-medium py-1 rounded-md transition-all duration-200 ${
              contentType === "movies"
                ? "bg-background backdrop-blur-sm text-text"
                : "text-text hover:bg-background"
            }`}
            onClick={() => setContentType("movies")}
          >
            Movies
          </button>
          <button
            className={`flex-1 text-[10px] font-medium py-1 rounded-md transition-all duration-200 ${
              contentType === "series"
                ? "bg-background backdrop-blur-sm text-text"
                : "text-text hover:bg-background"
            }`}
            onClick={() => setContentType("series")}
          >
            Series
          </button>
        </div>

        {/* iOS-style category selector */}
        <div className='flex space-x-1.5 mb-1 overflow-x-auto ios-scrollbar-hide'>
          <button
            className={`text-[9px] px-2 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
              category === "trending"
                ? "bg-background backdrop-blur-sm text-text font-medium"
                : "bg-hover text-text"
            }`}
            onClick={() => setCategory("trending")}
          >
            Trending
          </button>
          <button
            className={`text-[9px] px-2 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
              category === "new"
                ? "bg-background backdrop-blur-sm text-text font-medium"
                : "bg-hover text-text"
            }`}
            onClick={() => setCategory("new")}
          >
            New Release
          </button>
          <button
            className={`text-[9px] px-2 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
              category === "region"
                ? "bg-background backdrop-blur-sm text-text font-medium"
                : "bg-hover text-text"
            }`}
            onClick={() => setCategory("region")}
          >
            In Your Region
          </button>
        </div>
      </div>

      {/* iOS-style scrollable grid with improved scroll UI */}
      <div className='px-3 pb-3 h-[190px] overflow-hidden relative'>
        {/* Scroll container with iOS-style scrollbar */}
        <ScrollArea className='h-full overflow-y-auto pr-3 pb-4 '>
          <div className='grid grid-cols-3 gap-2 pt-2 '>
            {currentContent.map((item, index) => (
              <div
                key={index}
                className='relative cursor-pointer transition-all duration-200 group'
                onClick={() => setSelectedMovie(index)}
              >
                <div
                  className={`relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300 
                group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] 
                group-hover:scale-[1.03] 
                group-hover:z-10 ${
                  selectedMovie === index ? "ring-2 ring-white/70" : ""
                }`}
                >
                  {/* Background glow effect on hover */}
                  <div className='absolute -inset-1 bg-white/0 rounded-xl group-hover:bg-white/5 group-hover:blur-md transition-all duration-300 z-0'></div>

                  {/* Image with hover effect */}
                  <div className='relative z-10 w-full h-full overflow-hidden rounded-xl'>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className='object-cover transition-all duration-300 group-hover:brightness-110 group-hover:contrast-[1.02]'
                    />

                    {/* iOS-style overlay with hover effect */}
                    <div
                      className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                    transition-opacity duration-300 group-hover:opacity-80'
                    ></div>

                    {/* Rating badge - iOS style with hover effect */}
                    <div
                      className='absolute top-1.5 right-1.5 bg-card backdrop-blur-md px-1.5 py-0.5 rounded-full 
                    text-[8px] font-medium flex items-center transition-all duration-300 
                     group-hover:backdrop-blur-lg'
                    >
                      <svg
                        className='w-2 h-2 mr-0.5 transition-transform duration-300 group-hover:scale-110'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                      </svg>
                      {item.rating}
                    </div>

                    {/* Title and year - iOS style with hover effect */}
                    <div className='absolute bottom-0 w-full p-1.5 transition-all duration-300 group-hover:pb-2'>
                      <div
                        className='text-[9px] font-medium leading-tight line-clamp-2 transition-all duration-300 
                      group-hover:text-white group-hover:font-semibold'
                      >
                        {item.title}
                      </div>
                      <div className='flex items-center justify-between mt-0.5'>
                        <span
                          className='text-[8px] text-gray-300 font-medium transition-colors duration-300 
                        group-hover:text-white/90'
                        >
                          {item.year}
                        </span>
                        <span
                          className='text-[7px] bg-white/20 backdrop-blur-sm px-1.5 rounded-full text-white/90 
                        transition-all duration-300 group-hover:bg-white/30'
                        >
                          {item.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* iOS-style scroll indicator - fade gradient at bottom */}
        {canScrollDown && (
          <div className='absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-black/30 to-transparent z-10'></div>
        )}

        {/* iOS-style scroll indicator - subtle down arrow */}
        {canScrollDown && (
          <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none z-20 opacity-70'>
            <svg
              className='w-4 h-4  animate-bounce'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* iOS-style widget footer */}
      <div className='absolute bottom-0 inset-x-0 h-6 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-3'>
        <div className='text-[10px] text-text font-semibold'>
          Updated just now
        </div>
        <div className='flex items-center'>
          <svg
            className='w-3 h-3 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
