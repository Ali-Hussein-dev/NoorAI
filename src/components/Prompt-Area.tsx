import { ActionIcon, Textarea, Loader } from "@mantine/core";
import * as React from "react";
import { MdSend } from "react-icons/md";
import { useFetchForm, useStore } from "../hooks";
import { BsStopFill } from "react-icons/bs";
import { PromptBuilder } from ".";

//======================================prompt-area
export const PromptArea = () => {
  const {
    methods: { watch, handleSubmit, register, setValue },
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

  React.useEffect(() => {
    updateStatus("idle");
  }, [updateStatus]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mb-2 w-full max-w-3xl shadow-lg md:mb-8"
    >
      <Textarea
        {...register("promptText")}
        placeholder="What do you want to know?"
        minRows={1}
        maxRows={3}
        autosize
        className="w-full grow resize-none"
        size="md"
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
