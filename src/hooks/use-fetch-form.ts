import { useForm } from "react-hook-form";
import { useStore } from ".";
import { useRouter } from "next/router";
import {
  type ChatCompletionRequestMessage,
  type CreateChatCompletionRequest,
  type CreateChatCompletionResponse,
} from "openai";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

interface FormData {
  promptText: string;
}
type OpenaiFetcherParams = {
  apiKey: string;
  body: CreateChatCompletionRequest;
};

const openaiFetcher = ({
  apiKey,
  body,
}: OpenaiFetcherParams): Promise<CreateChatCompletionResponse> => {
  const customBody = {
    ...body,
  };
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customBody),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

export const useFetchForm = () => {
  const methods = useForm<FormData>();

  const { query } = useRouter();
  const push = useStore((s) => s.push);
  const apiKey = useStore((s) => s.apiKey);
  const { getValues } = methods;
  const conversationId = query.chatId as string;
  //------------------------------OpenAI
  const openAPI = useMutation(
    ["openai"],
    (d: OpenaiFetcherParams) => openaiFetcher(d),
    {
      onSuccess: (d) => {
        if (d?.choices) {
          updateStatus("success");
          push(conversationId, {
            input: getValues("promptText"),
            message: d.choices.reduce(
              (acc, { message }) => ({
                ...acc,
                role: message?.role,
                content: message?.content,
              }),
              {}
            ) as ChatCompletionRequestMessage,
          });
        } else {
          console.warn(d);
        }
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      },
      onError: () => {
        updateStatus("error");
      },
    }
  );
  const updateStatus = useStore((s) => s.updateStatus);

  const conversation = useStore((s) => s.conversations).find(
    (o) => o.id === conversationId
  );

  // const { mutate } = res;
  const onSubmit = async ({ promptText: input }: FormData) => {
    if (!apiKey) {
      notifications.show({
        title: "API key is Required",
        message: "Please add your API key!",
        withCloseButton: true,
        color: "orange",
      });
    }

    if (apiKey) {
      updateStatus("loading");
      // get and store previous messages
      openAPI.mutate({
        apiKey,
        body: {
          messages: [
            ...(conversation?.thread.map((o) => ({
              content: o.input,
              role: o?.message?.role || "user",
            })) || []),
            {
              role: "user",
              content: input.trim(),
            },
          ],
          model: "gpt-3.5-turbo",
        },
      });
    }
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    // save status in store
    // mutate({ promptText: input.trim() });
  };
  return { methods, onSubmit };
};
