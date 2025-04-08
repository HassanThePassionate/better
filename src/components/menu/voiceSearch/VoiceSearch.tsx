"use client";

import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useState, useEffect, type FormEvent, JSX } from "react";
import SearchInput from "./SearchInput";

export default function VoiceSearch(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    isListening,
    isSupported,
    transcript,
    toggleListening,
    stopListening,
    startListening,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      stopListening();
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;
      window.open(googleSearchUrl, "_blank");
    }
    if (searchQuery === "") {
      startListening();
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <form onSubmit={handleSubmit} className='relative'>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onVoiceToggle={toggleListening}
          isListening={isListening}
          isVoiceSupported={isSupported}
        />
      </form>

      {!isSupported && (
        <p className='text-sm text-muted-foreground mt-2'>
          Voice search is not supported in your browser.
        </p>
      )}

      {/* <SearchResults query={searchQuery} /> */}
    </div>
  );
}
