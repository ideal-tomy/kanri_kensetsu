"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface SimpleRecognitionEvent {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
  }
  interface SimpleRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SimpleRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  }
  interface Window {
    SpeechRecognition: new () => SimpleRecognition;
    webkitSpeechRecognition: new () => SimpleRecognition;
  }
}

type Props = { onResult: (text: string) => void };

export function VoiceInput({ onResult }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const recognitionRef = useRef<SimpleRecognition | null>(null);

  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: SimpleRecognitionEvent) => {
      onResult(event.results[0][0].transcript);
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
  }, [onResult, supported]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (recording) recognitionRef.current?.stop();
        else recognitionRef.current?.start();
        setRecording((prev) => !prev);
      }}
      className={`min-h-[60px] w-full rounded-xl px-4 text-lg font-bold text-white transition active:scale-95 ${
        recording ? "bg-red-600" : "bg-orange-500"
      }`}
    >
      {recording ? "話しおわったらもう一回押す" : "マイクで話す"}
    </button>
  );
}
