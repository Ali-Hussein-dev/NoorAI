import audioBufferToWav from "audiobuffer-to-wav";
import * as React from "react";

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

const blobToAudioBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  // @ts-expect-error webkitAudio for Safari
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return await audioContext.decodeAudioData(arrayBuffer);
};

type UseAudioProps = {
  onSuccess: (transcription: string) => void;
  onError?: (e: unknown) => void;
};

export const useAudio = ({ onSuccess, onError }: UseAudioProps) => {
  const mediaRecorderRef = React.useRef<null | MediaRecorder>(null);
  const [state, setState] = React.useState({
    isRecording: false,
    isSubmitting: false,
    processingText: "",
    textResponse: "",
  });

  // helper-functions
  const updateState = (newState: Partial<typeof state>) => {
    setState((prv) => ({ ...prv, ...newState }));
  };
  const startRecording = async () => {
    updateState({ isRecording: true });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = isSafari() ? "audio/mp4" : "audio/webm";
      const options = { mimeType };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (e) {
      console.error(e);
    }
  };
  const stopRecording = async () => {
    updateState({ isRecording: false });
    if (!mediaRecorderRef.current) {
      console.error("MediaRecorder is not initialized.");
      updateState({ isRecording: false });
      return;
    }
    updateState({
      isRecording: false,
      processingText: "Processing...",
    });
    mediaRecorderRef.current.stop();

    const onDataAvailable = async (event: BlobEvent) => {
      await submitAudio(event.data);
      mediaRecorderRef.current?.removeEventListener(
        "dataavailable",
        onDataAvailable
      );
    };

    mediaRecorderRef.current.addEventListener("dataavailable", onDataAvailable);
  };

  const submitAudio = async (audioBlob: Blob) => {
    updateState({ isSubmitting: true });
    try {
      const audioBuffer = await blobToAudioBuffer(audioBlob);
      const wavArrayBuffer = audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });

      const formData = new FormData();
      formData.append("file", wavBlob, "audio.wav");

      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        onError &&
          onError(
            new Error(`API error: ${response.status} ${response.statusText}`)
          );
        return;
      }

      const data = await response.json();
      onSuccess(data.text);
      updateState({ textResponse: data.text, isSubmitting: false });
      console.log("--->", data.text);
    } catch (e: unknown) {
      onError && onError(e);
      console.error(e);
    }
  };
  return {
    isRecording: state.isRecording,
    startRecording,
    stopRecording,
    textResponse: state.textResponse,
    isSubmitting: state.isSubmitting,
  };
};
