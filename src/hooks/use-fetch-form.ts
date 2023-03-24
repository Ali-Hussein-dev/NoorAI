import { useForm } from "react-hook-form";
import { useStore } from ".";
import { useRouter } from "next/router";
import React from "react";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";

interface FormData {
  promptText: string;
}

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
  console.log(sessionData);
  const onSubmit = async ({ promptText: input }: FormData) => {
    if (!sessionData?.user) {
      notifications.show({
        title: "Login required",
        message: "You have to login to continue use the app",
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
  return { methods, onSubmit, stopStreaming };
};
