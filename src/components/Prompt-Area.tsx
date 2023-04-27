import { ActionIcon, Textarea, Loader } from "@mantine/core";
import * as React from "react";
import { MdSend } from "react-icons/md";
import { useFetchForm, useStore } from "../hooks";
import { BsStopFill } from "react-icons/bs";
import { PromptBuilder } from ".";
import { type UseFormSetFocus } from "react-hook-form";
import { useMediaQuery } from "@mantine/hooks";

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
//======================================prompt-area
export const PromptArea = () => {
  const {
    methods: { watch, handleSubmit, register, setValue, setFocus },
    onSubmit,
    stopStreaming,
  } = useFetchForm();
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
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mb-2 w-full max-w-3xl shadow-lg md:mb-8"
    >
      <Textarea
        {...register("promptText")}
        placeholder="What do you want to know?"
        minRows={1}
        maxRows={isMobile ? 4 : 24}
        autosize
        className="w-full grow resize-none"
        size="lg"
        onKeyDown={queryStatus === "loading" ? undefined : onKeyPress}
        styles={{ icon: { pointerEvents: "all" } }}
        icon={
          queryStatus === "loading" ? (
            <ActionIcon type="button" onClick={stopStreaming}>
              <BsStopFill className="z-10 text-red-700" size="20" />
            </ActionIcon>
          ) : (
            <PromptBuilder setValue={setValue} />
          )
        }
        rightSection={
          <ActionIcon
            type="submit"
            size="md"
            disabled={!watch("promptText") || queryStatus === "loading"}
            variant="transparent"
          >
            {queryStatus == "loading" ? (
              <Loader color="orange" variant="dots" size="sm" />
            ) : (
              <MdSend size="17" />
            )}
          </ActionIcon>
        }
      />
    </form>
  );
};
