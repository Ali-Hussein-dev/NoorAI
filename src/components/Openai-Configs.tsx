import {
  Select,
  SegmentedControl,
  Divider,
  Button,
  Paper,
  Drawer,
  Text,
} from "@mantine/core";
import * as React from "react";
import { RiSettings3Line } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import languages from "../content/languages.json";
import { useStore } from "~/hooks";

//======================================
export const SelectModel = () => {
  const whisperLang = useStore((state) => state.whisperLang);
  const setWhisperLang = useStore((state) => state.setWhisperLang);
  const [value, setValue] = React.useState<string | null>(whisperLang);
  return (
    <Select
      placeholder="Recording Language"
      label="Recording Language"
      searchable
      data={Object.keys(languages)}
      rightSection={<IoChevronDown size="1rem" />}
      value={value}
      onChange={(value) => {
        setValue(value);
        setWhisperLang(value as keyof typeof languages);
      }}
      dropdownPosition="bottom"
      className="mb-1"
    />
  );
};

//======================================
export const RecordingMode = () => {
  const recordingMode = useStore((state) => state.recordingMode);
  const setRecordingMode = useStore((state) => state.setRecordingMode);
  const [value, setValue] = React.useState(recordingMode);
  return (
    <div className="space-y-1 pt-2">
      <Text size="md">Choose Recording mode</Text>
      <SegmentedControl
        value={value}
        onChange={(value: "transcriptions" | "translations") => {
          setValue(value);
          setRecordingMode(value);
        }}
        data={[
          { label: "Transcripe", value: "transcriptions" },
          { label: "Translate into English", value: "translations" },
        ]}
      />
    </div>
  );
};
//======================================
export const Content = () => {
  return (
    <Paper className="h-full space-y-4 md:w-[200px] lg:w-[270px]">
      <div className="min-h-[400px]">
        <Divider my="xs" label="Recording Settings" labelPosition="center" />
        <SelectModel />
        <RecordingMode />
        <Divider my="sm" />
      </div>
    </Paper>
  );
};
//======================================
export const OpenaiConfig = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer title="Settings" opened={opened} onClose={close} size="auto">
        <Content />
      </Drawer>
      <Button
        variant="default"
        color="gray"
        onClick={open}
        leftIcon={<RiSettings3Line size="17" />}
        className="w-full"
      >
        Settings
      </Button>
    </>
  );
};
