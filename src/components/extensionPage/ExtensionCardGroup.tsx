// "use client";

// import type React from "react";
// import { useState } from "react";
// import type { Card } from "@/types/TabCardType";
// import CardRenderer from "../bookmarkPage/thumbnails/CardRenderer";
// import { usePageContext } from "@/context/PageContext";
// import InfiniteScrollSentinel from "../InfiniteScrollSentinel";
// import { useExtensionContext } from "@/context/ExtensionContext";

// interface ExtensionCardsGroupProps {
//   cards: Card[];
//   isListView: boolean;
//   setActiveTab: (tab: number) => void;
//   favoriteExe: Card[];
//   setFavoriteExe: React.Dispatch<React.SetStateAction<Card[]>>;
// }

// const CARDS_PER_LOAD = 20;

// export default function ExtensionCardsGroup({
//   isListView,
//   favoriteExe,
//   setFavoriteExe,
// }: ExtensionCardsGroupProps) {
//   const { filteredExtensions } = useExtensionContext();

//   const { page } = usePageContext();
//   const [visibleCardsCount, setVisibleCardsCount] = useState(CARDS_PER_LOAD);

//   const loadMoreCards = () => {
//     setVisibleCardsCount((prevCount) =>
//       Math.min(prevCount + CARDS_PER_LOAD, filteredExtensions.length)
//     );
//   };

//   const visibleCards = filteredExtensions.slice(0, visibleCardsCount);
//   const hasMoreCards = visibleCardsCount < filteredExtensions.length;
//   const isDownloadPage = page === "downloads";

//   return (
//     <>
//       <div
//         className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-4`}
//       >
//         {visibleCards.map((card) => (
//           <CardRenderer
//             isDownloadPage={isDownloadPage}
//             key={card.id}
//             data={card}
//             isListView={isListView}
//             isExtensionsPage={true}
//             favoriteExe={favoriteExe}
//             setFavoriteExe={setFavoriteExe}
//           />
//         ))}
//       </div>
//       <InfiniteScrollSentinel
//         onLoadMore={loadMoreCards}
//         hasMore={hasMoreCards}
//       />
//     </>
//   );
// }
