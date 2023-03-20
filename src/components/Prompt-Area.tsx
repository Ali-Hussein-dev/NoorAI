import { ActionIcon, Textarea, Loader } from "@mantine/core";
import * as React from "react";
import { MdSend } from "react-icons/md";
import { useFetchForm, useStore } from "../hooks";

//======================================prompt-area
export const PromptArea = () => {
  const {
    methods: { watch, handleSubmit, register },
    onSubmit,
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
          rightSection={
            <ActionIcon
              type="submit"
              disabled={!watch("promptText") || queryStatus === "loading"}
              className="grid h-11 w-11 place-items-center pr-2"
              unstyled
            >
              {queryStatus == "loading" ? (
                <Loader color="gray" variant="dots" size="sm" />
              ) : (
                <MdSend size="19" />
              )}
            </ActionIcon>
          }
        />
      </form>
    </div>
  );
};
