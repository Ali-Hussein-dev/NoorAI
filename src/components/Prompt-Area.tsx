import { Textarea, Button } from "@mantine/core";
import * as React from "react";
import { MdSend } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mb-2 w-full max-w-3xl gap-2 rounded flex-row-between"
    >
      <Textarea
        {...register("promptText")}
        placeholder="Enter your prompt here..."
        minRows={1}
        maxRows={4}
        className="w-full grow resize-none text-lg shadow-lg focus:border-neutral-300"
        onKeyDown={queryStatus === "loading" ? undefined : onKeyPress}
      />
      <Button
        disabled={!watch("promptText") || queryStatus === "loading"}
        className="h-11 bg-transparent"
        color="gray"
      >
        {queryStatus === "loading" ? (
          <AiOutlineLoading3Quarters size="19" className="animate-spin" />
        ) : (
          <MdSend size="19" />
        )}
      </Button>
    </form>
  );
};
