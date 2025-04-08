"use client"

import { SpeechRecognition, SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from "@/types/speech-recognition-types"
import { useState, useEffect, useRef } from "react"


export interface SpeechRecognitionHookResult {
  isListening: boolean
  isSupported: boolean
  transcript: string
  toggleListening: () => void
  startListening: () => void
  stopListening: () => void
  
}

export function useSpeechRecognition(): SpeechRecognitionHookResult {
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSupported, setIsSupported] = useState<boolean>(true)
  const [transcript, setTranscript] = useState<string>("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if SpeechRecognition is supported
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      setIsSupported(false)
      return
    }
    

    // Initialize SpeechRecognition
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognitionConstructor()

    if (recognitionRef.current) {
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript
        setTranscript(text)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = (): void => {
    if (!recognitionRef.current || !isSupported) return

    setTranscript("")
    recognitionRef.current.start()
    setIsListening(true)
  }

  const stopListening = (): void => {
    if (!recognitionRef.current || !isSupported) return

    recognitionRef.current.stop()
    setIsListening(false)
  }

  const toggleListening = (): void => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return {
    isListening,
    isSupported,
    transcript,
    toggleListening,
    startListening,
    stopListening,
  }
}

