import { useForm } from "react-hook-form";
import { useStore } from ".";
import { useRouter } from "next/router";
import React from "react";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useAudioRecorder } from "react-audio-voice-recorder";

interface FormData {
  promptText: string;
}
const useRecorder = (isAuthed: boolean) => {
  const fetcher = async (audioFile: Blob) => {
    const formData = new FormData();
    formData.append("file", audioFile, "audio.wav");
    return fetch("/api/whisper", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
  };
  const recorderControls = useAudioRecorder();
  const { startRecording, stopRecording, recordingBlob, isRecording } =
    recorderControls;
  const [transcript, setTranscript] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!isAuthed) {
      notifications.show({
        title: "Login required",
        message: "You have to login to continue using the app",
        withCloseButton: true,
        color: "red",
      });
    } else if (recordingBlob) {
      fetcher(recordingBlob)
        .then((res) => {
          setTranscript(res.text);
          return res;
        })
        .catch((err) => console.error(err));
    }
  }, [recordingBlob, isRecording, isAuthed]);
  return {
    startRecording,
    stopRecording,
    fetcher,
    isRecording,
    transcript,
  };
};
export const useFetchForm = () => {
  const methods = useForm<FormData>();
  const { query } = useRouter();
  const { reset } = methods;

  const conversationId = query.chatId as string;
  const { push, conversations, updateStatus } = useStore();
  const conversation = conversations.find((o) => o.id === conversationId) || {
    thread: [],
  };
  const [controller, setController] = React.useState<null | AbortController>(
    null
  );
  const { data: sessionData } = useSession();
  const recorderControls = useRecorder(!!sessionData?.user);
  // update textarea with transcript
  React.useEffect(() => {
    if (recorderControls.transcript) {
      reset({ promptText: recorderControls.transcript });
    }
  }, [recorderControls.transcript, reset]);
  const stopStreaming = () => {
    if (controller) {
      controller.abort();
      setController(null);
      updateStatus("success");
    }
  };
  const fetchStreaming = async (input: string) => {
    updateStatus("loading");
    reset({ promptText: "" });
    const abortController = new AbortController();
    setController(abortController);
    // eslint-disable-next-line prefer-const
    let threadIndex = conversation.thread.length;
    const res = await fetch("api/openai-stream", {
      method: "POST",
      signal: abortController.signal,
      body: JSON.stringify({
        messages: [
          ...conversation?.thread.map((o) => ({
            content: o.input,
            role: o?.message?.role || "user",
          })),
          {
            role: "user",
            content: input,
          },
        ],
        model: "gpt-4",
      }),
    });
    // This data is a ReadableStream
    const data = res.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      try {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        if (chunkValue) {
          push(
            conversationId,
            {
              input: input,
              message: { role: "user", content: chunkValue },
            },
            threadIndex
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: unknown | any) {
        if (error?.name === "AbortError") {
          console.log("Stream stopped by user");
        } else {
          console.error("Error in reading stream:", error);
        }
        break;
      }
    }
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    updateStatus("success");
    if (done) {
      threadIndex += 1;
      return;
    }
  };
  const onSubmit = async ({ promptText: input }: FormData) => {
    if (!sessionData?.user) {
      notifications.show({
        title: "Login required",
        message: "You have to login to continue using the app",
        withCloseButton: true,
        color: "red",
      });
      return;
    }
    await fetchStreaming(input.trim());
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  return { methods, onSubmit, stopStreaming, recorderControls };
};
