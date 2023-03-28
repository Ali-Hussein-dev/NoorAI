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

/**
 * label: lang name
 * whisper: lang code
 * langauges object: label: code
 */
type langKeyT = keyof typeof languages;

const getCode = (label: langKeyT) => {
  for (const [key, code] of Object.entries(languages)) {
    if (key === label) {
      return code;
    }
  }
  return null;
};
const getName = (code: string) => {
  for (const [key, value] of Object.entries(languages)) {
    if (value === code) {
      return key;
    }
  }
  return null;
};
//======================================
export const SelectModel = () => {
  const whisperLang = useStore((state) => state.whisperLang);
  const setWhisperLang = useStore((state) => state.setWhisperLang);
  const [value, setValue] = React.useState<string | null>(getName(whisperLang));
  return (
    <Select
      placeholder="Recording Language"
      label="Recording Language"
      searchable
      data={Object.keys(languages)}
      rightSection={<IoChevronDown size="1rem" />}
      value={value}
      onChange={(langName: langKeyT) => {
        setValue(langName);
        const code = getCode(langName);
        code && setWhisperLang(code);
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
