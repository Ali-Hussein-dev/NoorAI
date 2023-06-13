import { HiMicrophone } from "react-icons/hi";
import { ActionIcon, Tooltip, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { BsStopFill } from "react-icons/bs";
import * as React from "react";
import { useAudio } from "../hooks";

type MicProps = ReturnType<typeof useAudio>;
//======================================
export const Mic = ({
  isRecording,
  startRecording,
  stopRecording,
  isSubmitting,
}: MicProps) => {
  const { data: sessionData } = useSession();
  return (
    <Tooltip label="Start recording, Lang: En" position="left" withArrow>
      <ActionIcon
        type="button"
        variant={isRecording ? "default" : "transparent"}
        disabled={isSubmitting}
        onClick={
          isRecording
            ? stopRecording
            : () => {
                if (!sessionData?.user) {
                  notifications.show({
                    title: "Login required",
                    message: "You have to login to continue using the app",
                    withCloseButton: true,
                    color: "red",
                  });
                } else {
                  startRecording();
                }
              }
        }
      >
        {isRecording ? (
          <BsStopFill className="z-10 text-red-700" size="20" />
        ) : isSubmitting ? (
          <Loader size="sm" color="gray" />
        ) : (
          <HiMicrophone size="17" />
        )}
      </ActionIcon>
    </Tooltip>
  );
};
