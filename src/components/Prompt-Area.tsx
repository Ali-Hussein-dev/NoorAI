import { ActionIcon, Textarea, Loader, Popover, Button } from "@mantine/core";
import * as React from "react";
import { MdSend } from "react-icons/md";
import { TiStarOutline } from "react-icons/ti";
import {
  type PromptT,
  useFetchFormCtx,
  useMarkedPrompts,
  useStore,
} from "../hooks";
import { BsCommand, BsStopFill } from "react-icons/bs";
import { PromptBuilder, Mic } from ".";
import {
  useWatch,
  type UseFormSetFocus,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { useClickOutside, useMediaQuery } from "@mantine/hooks";

//-----------------------------------------------------useFocus
const useFocus = (setFocus: UseFormSetFocus<{ promptText: string }>) => {
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();

        setFocus("promptText", { shouldSelect: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setFocus]);
};
//-----------------------------------------------------usePopover
const useSuggestions = ({
  control,
  setValue,
}: {
  control: Control<{ promptText: string }>;
  setValue: UseFormSetValue<{ promptText: string }>;
}) => {
  const userPromps = useMarkedPrompts((s) => s.list);
  const [promptsSuggestions, setPromptsSuggestions] =
    React.useState<PromptT[]>();
  const prompt = useWatch({ name: "promptText", control });

  React.useEffect(() => {
    const promptText = (prompt || "").toLowerCase();

    if (prompt) {
      const suggestions = userPromps.filter((p) =>
        p.text.toLowerCase().startsWith(promptText)
      );

      suggestions.length > 0
        ? setPromptsSuggestions(suggestions)
        : setPromptsSuggestions(undefined);
    } else {
      setPromptsSuggestions(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);
  const onPromptSuggestionSelect = (prompt: PromptT) => {
    // the space is to filter the prompt out and cause the popover to close
    setValue("promptText", prompt.text + " ");
    setPromptsSuggestions(undefined);
  };
  const ref = useClickOutside(() => setPromptsSuggestions(undefined));

  return {
    ref,
    promptsSuggestions,
    onPromptSuggestionSelect,
    promptText: prompt,
  };
};
//======================================prompt-area
export const PromptArea = () => {
  const {
    methods: { handleSubmit, register, setValue, setFocus, control },
    onSubmit,
    stopStreaming,
    recorderControls,
  } = useFetchFormCtx();
  const onKeyPress: React.KeyboardEventHandler = (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };
  const { status: queryStatus, updateStatus } = useStore();
  useFocus(setFocus);
  React.useEffect(() => {
    updateStatus("idle");
  }, [updateStatus]);
  const { ref, promptsSuggestions, onPromptSuggestionSelect, promptText } =
    useSuggestions({ control, setValue });

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl shadow-lg md:mb-8" ref={ref}>
      <Popover
        width="target"
        position="top"
        withArrow={false}
        opened={!!promptsSuggestions}
      >
        <Popover.Target>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              {...register("promptText")}
              placeholder="Send message"
              minRows={1}
              maxRows={isMobile ? 4 : 24}
              autosize
              className="w-full grow"
              size="lg"
              onKeyDown={queryStatus === "loading" ? undefined : onKeyPress}
              styles={{ icon: { pointerEvents: "all" } }}
              icon={
                <div className="flex h-full flex-col items-center justify-end p-2 pb-3">
                  {queryStatus === "loading" ? (
                    <ActionIcon type="button" onClick={stopStreaming}>
                      <BsStopFill className="z-10 text-red-700" size="20" />
                    </ActionIcon>
                  ) : (
                    <PromptBuilder setValue={setValue} />
                  )}
                </div>
              }
              rightSectionWidth="auto"
              rightSection={
                <div className="flex h-full flex-col items-center justify-end p-2 pb-3">
                  {!promptText ? (
                    <div className="gap-3 flex-row-start">
                      <div className="gap-3 border-r border-zinc-700 pr-4 flex-row-start">
                        <BsCommand /> K
                      </div>
                      <Mic {...recorderControls} />
                    </div>
                  ) : (
                    <ActionIcon
                      type="submit"
                      size="md"
                      disabled={queryStatus === "loading"}
                      variant="transparent"
                    >
                      {queryStatus == "loading" ? (
                        <Loader color="orange" variant="dots" size="sm" />
                      ) : (
                        <MdSend size="17" />
                      )}
                    </ActionIcon>
                  )}
                </div>
              }
            />
          </form>
        </Popover.Target>
        <Popover.Dropdown className="space-y-2" px="xs">
          {promptsSuggestions?.map((prompt) => (
            <Button
              key={prompt.id}
              type="button"
              variant="default"
              leftIcon={<TiStarOutline className="text-zinc-400" />}
              onClick={() => onPromptSuggestionSelect(prompt)}
              styles={{
                root: {
                  width: "100%",
                },
                inner: {
                  justifyContent: "start",
                },
                label: {
                  height: "auto",
                  display: "block",
                  textOverflow: "ellipsis",
                },
              }}
            >
              {prompt.text}
            </Button>
          ))}
          {/* <Text className="text-ellipsis">
              </Text> */}
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};
