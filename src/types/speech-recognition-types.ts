
export interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
  }
  
  export interface SpeechRecognitionResult {
    isFinal: boolean
    [index: number]: SpeechRecognitionAlternative
  }
  
  export interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
  
  export interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }
  
  export interface SpeechRecognitionEvent extends Event {
    resultIndex: number
    results: SpeechRecognitionResultList
  }
  
  export interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
    start(): void
    stop(): void
    abort(): void
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: SpeechRecognitionErrorEvent) => void
    onend: () => void
  }
  
  // Update the global declaration
  declare global {
    interface Window {
      SpeechRecognition: {
        new (): SpeechRecognition
      }
      webkitSpeechRecognition: {
        new (): SpeechRecognition
      }
    }
  }
  
  