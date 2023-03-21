import { useForm } from "react-hook-form";
import { useStore } from ".";
import { useRouter } from "next/router";
// import {
//   type ChatCompletionRequestMessage,
//   type CreateChatCompletionRequest,
//   type CreateChatCompletionResponse,
// } from "openai";
// import { useMutation } from "@tanstack/react-query";
// import { notifications } from "@mantine/notifications";
// import React from "react";

interface FormData {
  promptText: string;
}
// type OpenaiFetcherParams = {
//   apiKey: string;
//   body: CreateChatCompletionRequest;
// };

// const openaiFetcher = ({
//   apiKey,
//   body,
// }: OpenaiFetcherParams): Promise<CreateChatCompletionResponse> => {
//   const customBody = {
//     ...body,
//   };
//   return fetch("https://api.openai.com/v1/chat/completions", {
//     method: "post",
//     headers: {
//       authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(customBody),
//   })
//     .then((r) => r.json())
//     .catch((e) => console.error(e));
// };

export const useFetchForm = () => {
  const methods = useForm<FormData>();

  const { query } = useRouter();
  // const { getValues } = methods;
  const conversationId = query.chatId as string;
  const { push, conversations, updateStatus } = useStore();
  const conversation = conversations.find((o) => o.id === conversationId) || {
    thread: [],
  };
  // const threadLength = conversation.thread.length;
  // const [threadIndex, setThreadIndex] = React.useState(
  //   threadLength === 0 ? 0 : threadLength - 1
  // );
  //------------------------------OpenAI
  // const openAPI = useMutation(
  //   ["openai"],
  //   (d: OpenaiFetcherParams) => openaiFetcher(d),
  //   {
  //     onSuccess: (d) => {
  //       if (d?.choices) {
  //         updateStatus("success");
  //         push(
  //           conversationId,
  //           {
  //             input: getValues("promptText"),
  //             message: d.choices.reduce(
  //               (acc, { message }) => ({
  //                 ...acc,
  //                 role: message?.role,
  //                 content: message?.content,
  //               }),
  //               {}
  //             ) as ChatCompletionRequestMessage,
  //           },
  //           threadIndex
  //         );
  //         setThreadIndex((prv) => prv + 1);
  //       } else {
  //         console.warn(d);
  //       }
  //       window.scrollTo({
  //         top: document.body.scrollHeight,
  //         behavior: "smooth",
  //       });
  //     },
  //     onError: () => {
  //       updateStatus("error");
  //     },
  //   }
  // );
  const fetchStreaming = async (input: string) => {
    updateStatus("loading");
    // eslint-disable-next-line prefer-const
    let threadIndex = conversation.thread.length;
    const res = await fetch("api/openai-stream", {
      method: "POST",
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
    // if (!apiKey) {
    //   notifications.show({
    //     title: "API key is Required",
    //     message: "Please add your API key!",
    //     withCloseButton: true,
    //     color: "orange",
    //   });
    // }

    // if (apiKey) {
    //   updateStatus("loading");
    //   // get and store previous messages
    //   openAPI.mutate({
    //     apiKey,
    //     body: {
    //       messages: [
    //         ...(conversation?.thread.map((o) => ({
    //           content: o.input,
    //           role: o?.message?.role || "user",
    //         })) || []),
    //         {
    //           role: "user",
    //           content: input.trim(),
    //         },
    //       ],
    //       model: "gpt-3.5-turbo",
    //     },
    //   });
    // }
    await fetchStreaming(input.trim());
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  return { methods, onSubmit };
};
