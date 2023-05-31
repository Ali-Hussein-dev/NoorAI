import { useForm } from "react-hook-form";
import { useModelConfigs, useStore } from ".";
import { useRouter } from "next/router";
import React from "react";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { fetcher } from "@/utils";

interface FormData {
  promptText: string;
}
export const useRegenerate = () => {
  const drop = useStore((s) => s.dropLastTheardElement);
  const conversations = useStore((s) => s.conversations);
  const { query } = useRouter();
  const { onSubmit, stopStreaming } = useFetchForm();
  const regenerate = () => {
    const prompt =
      conversations.find((o) => o.id === query.chatId)?.thread.at(-1)?.input ||
      "";
    drop(query.chatId as string);
    useStore.persist.rehydrate();
    onSubmit({ promptText: prompt });
  };
  return { regenerate, stopStreaming };
};
export const useFetchForm = (param?: { promptText: string }) => {
  const methods = useForm<FormData>({
    defaultValues: { promptText: param?.promptText },
  });

  const { query } = useRouter();
  const { reset } = methods;
  const conversationId = query.chatId as string;
  const conversations = useStore((s) => s.conversations);
  const push = useStore((s) => s.push);
  const updateStatus = useStore((s) => s.updateStatus);

  const { temperature, maxLength } = useModelConfigs((s) => s.configs);
  const systemInstruction = useModelConfigs((s) => s.systemInstruction);

  const conversation = conversations.find((o) => o.id === conversationId) || {
    thread: [],
    template: {
      role: "user",
      content: "",
      htmlContent: "",
    },
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
  const fetchingManager = async (input: string) => {
    updateStatus("loading");
    reset({ promptText: "" });
    const abortController = new AbortController();
    setController(abortController);
    // eslint-disable-next-line prefer-const
    let threadIndex = conversation.thread.length;
    const template = conversation?.template?.content;
    // if users use template, don't send messages history (LLM will be confused)
    const messagesHistory = !!template
      ? []
      : [
          ...conversation?.thread.map((o) => ({
            content: o.input,
            role: o?.message?.role || "user",
          })),
        ];

    const body = {
      messages: [
        ...messagesHistory,
        {
          role: "user",
          content: input,
        },
      ],
      template,
      max_tokens: maxLength,
      temperature,
      systemInstruction,
    };
    // fetching...
    await fetcher({
      url: "api/openai-stream",
      options: {
        signal: abortController.signal,
        body: JSON.stringify(body),
        method: "POST",
      },
      stream: true,
      onStream(chunkValue) {
        push(
          conversationId,
          {
            input: input,
            message: { role: "user", content: chunkValue },
          },
          threadIndex
        );
      },
      onStreamFinished() {
        threadIndex += 1;
        updateStatus("success");
      },
    });
  };
  const onSubmit = async ({ promptText: input }: FormData) => {
    if (!sessionData?.user) {
      notifications.show({
        title: "Login required",
        message: "You have to log in to continue using the app",
        withCloseButton: true,
        color: "red",
      });
      return;
    }
    await fetchingManager(input.trim());
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  return { methods, onSubmit, stopStreaming };
};

const FormCtx = React.createContext<ReturnType<typeof useFetchForm>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any
);

export const FormProv: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <FormCtx.Provider value={useFetchForm()}> {children} </FormCtx.Provider>;

export const useFetchFormCtx = () => React.useContext(FormCtx);
