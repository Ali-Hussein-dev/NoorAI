import { ActionIcon, Textarea, Loader, Tooltip } from "@mantine/core";
import * as React from "react";
import { MdSend } from "react-icons/md";
import { useFetchForm, useStore } from "../hooks";
import { BsStopFill } from "react-icons/bs";
import { HiMicrophone } from "react-icons/hi";

//======================================prompt-area
export const PromptArea = () => {
  const {
    methods: { watch, handleSubmit, register },
    onSubmit,
    stopStreaming,
    recorderControls: { startRecording, stopRecording, isRecording },
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
    <div className="mx-auto mb-2 w-full max-w-3xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="gap-2 rounded flex-row-between"
      >
        <Textarea
          {...register("promptText")}
          placeholder="Enter your prompt here..."
          minRows={1}
          maxRows={3}
          autosize
          className="w-full grow resize-none  text-lg shadow-lg"
          onKeyDown={queryStatus === "loading" ? undefined : onKeyPress}
          styles={{ icon: { pointerEvents: "all" } }}
          icon={
            queryStatus === "loading" ? (
              <ActionIcon type="button" onClick={stopStreaming}>
                <BsStopFill className="z-10 text-red-700" size="20" />
              </ActionIcon>
            ) : undefined
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
        {/* recorder */}
        <Tooltip label="Start recording | Lang: En" withArrow position="left">
          <ActionIcon
            type="button"
            size="lg"
            radius="xl"
            variant={isRecording ? "default" : "transparent"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <BsStopFill className="z-10 text-red-700" size="20" />
            ) : (
              <HiMicrophone size="17" />
            )}
          </ActionIcon>
        </Tooltip>
      </form>
    </div>
  );
};
