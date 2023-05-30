import {
  // Select,
  // SegmentedControl,
  Divider,
  Button,
  Paper,
  Drawer,
  Text,
  Slider,
  NumberInput,
} from "@mantine/core";
import * as React from "react";
import { RiSettings3Line } from "react-icons/ri";
import { useDisclosure } from "@mantine/hooks";
// import { IoChevronDown } from "react-icons/io5";
// import languages from "../content/languages.json";
import { useStore } from "@/hooks";

/**
 * label: lang name
 * whisper: lang code
 * langauges object: label: code
 */
// type langKeyT = keyof typeof languages;

// const getCode = (label: langKeyT) => {
//   for (const [key, code] of Object.entries(languages)) {
//     if (key === label) {
//       return code;
//     }
//   }
//   return null;
// };
// const getName = (code: string) => {
//   for (const [key, value] of Object.entries(languages)) {
//     if (value === code) {
//       return key;
//     }
//   }
//   return null;
// };
// //======================================
// export const SelectModel = () => {
//   const whisperLang = useStore((state) => state.whisperLang);
//   const setWhisperLang = useStore((state) => state.setWhisperLang);
//   const [value, setValue] = React.useState<string | null>(getName(whisperLang));
//   return (
//     <Select
//       placeholder="Recording Language"
//       label="Recording Language"
//       searchable
//       data={Object.keys(languages)}
//       rightSection={<IoChevronDown size="1rem" />}
//       value={value}
//       onChange={(langName: langKeyT) => {
//         setValue(langName);
//         const code = getCode(langName);
//         code && setWhisperLang(code);
//       }}
//       dropdownPosition="bottom"
//       className="mb-1"
//     />
//   );
// };

// //======================================
// export const RecordingMode = () => {
//   const recordingMode = useStore((state) => state.recordingMode);
//   const setRecordingMode = useStore((state) => state.setRecordingMode);
//   const [value, setValue] = React.useState(recordingMode);
//   return (
//     <div className="space-y-1 pt-2">
//       <Text size="md">Choose Recording mode</Text>
//       <SegmentedControl
//         value={value}
//         onChange={(value: "transcriptions" | "translations") => {
//           setValue(value);
//           setRecordingMode(value);
//         }}
//         data={[
//           { label: "Transcripe", value: "transcriptions" },
//           { label: "Translate into English", value: "translations" },
//         ]}
//       />
//     </div>
//   );
// };
const Temperature = () => {
  const temperature = useStore((state) => state.temperature);
  const setTemperature = useStore((state) => state.setTemperature);
  const [value, setValue] = React.useState(temperature);
  return (
    <div className="pb-4">
      <Text className="mb-1">Deterministic to creative</Text>
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={(value: number) => {
          setValue(value);
          setTemperature(value);
        }}
        label={(value) => value.toFixed(1)}
        // marks={marks}
        color="gray"
        size="md"
      />
    </div>
  );
};
const ResponseLength = () => {
  const maxLength = useStore((s) => s.maxLength);
  const setMaxLength = useStore((s) => s.setMaxLength);
  const [value, setValue] = React.useState(maxLength);
  const handleChange = (value: number) => {
    setValue(value);
    setMaxLength(value);
  };
  return (
    <div className="pb-4">
      <div className="mb-2 w-full gap-x-2 flex-row-between ">
        <Text className="">Response Length</Text>
        <NumberInput
          value={value}
          onChange={handleChange}
          size="xs"
          className="max-w-[3.5em]"
          hideControls
        />
      </div>
      <Slider
        min={10}
        max={3500}
        step={5}
        value={value}
        onChange={handleChange}
        color="gray"
        size="md"
        label={null}
      />
    </div>
  );
};
//======================================
export const Content = () => {
  return (
    <Paper className="h-full space-y-4 md:w-[200px] lg:w-[270px]">
      <div className="min-h-[400px]">
        <Divider label="Text Settings" labelPosition="center" />
        <Temperature />
        <ResponseLength />
        {/* <Divider label="Recording Settings" labelPosition="center" />
        <SelectModel />
        <RecordingMode /> */}
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
        onClick={open}
        leftIcon={<RiSettings3Line size="17" />}
        className="w-full shadow"
      >
        Settings
      </Button>
    </>
  );
};
