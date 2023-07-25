import {
  Select,
  // SegmentedControl,
  Divider,
  Button,
  Paper,
  Drawer,
  Text,
  Slider,
  NumberInput,
  Textarea,
} from "@mantine/core";
import * as React from "react";
import { RiSettings3Line } from "react-icons/ri";
import { useDisclosure } from "@mantine/hooks";
import { IoChevronDown } from "react-icons/io5";
import languages from "../content/languages.json";
import { useModelConfigs, useWhisper } from "@/hooks";
import models from "../content/models.json";

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
export const SelectWhisperLanguage = () => {
  const whisperLang = useWhisper((state) => state.whisperLang);
  const setWhisperLang = useWhisper((state) => state.setWhisperLang);
  const [value, setValue] = React.useState<string | null>(getName(whisperLang));
  return (
    <Select
      label={<Text color="dimmed"> Recording Language</Text>}
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
  const temperature = useModelConfigs((state) => state.configs.temperature);
  const setTemperature = useModelConfigs((state) => state.setConfigs);
  const [value, setValue] = React.useState(temperature);
  return (
    <div className="pb-4">
      <Text className="mb-1" color="dimmed">
        Deterministic to creative ({temperature})
      </Text>
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={(value: number) => {
          const temperature = +value.toFixed(1);
          setValue(temperature);
          setTemperature({ temperature });
        }}
        label={null}
        // marks={marks}
        color="gray"
        size="md"
      />
    </div>
  );
};

const OutputLength = () => {
  const max_tokens = useModelConfigs((state) => state.configs.max_tokens);
  const setConfigs = useModelConfigs((state) => state.setConfigs);
  const [value, setValue] = React.useState(max_tokens);
  const handleChange = (value: number) => {
    setValue(value);
    setConfigs({ max_tokens: value });
  };
  return (
    <div className="pb-4">
      <div className="mb-2 w-full gap-x-2 flex-row-between ">
        <Text color="dimmed">Output Length</Text>
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

const SystemInstruction = () => {
  const systemInstructions = useModelConfigs(
    (state) => state.systemInstruction
  );
  const setSystemInstruction = useModelConfigs(
    (state) => state.setSystemInstruction
  );
  return (
    <Textarea
      label={
        <Text color="dimmed" ml={2}>
          System Intstructions
        </Text>
      }
      value={systemInstructions}
      minRows={3}
      maxRows={8}
      autosize
      onChange={(e) => {
        setSystemInstruction(e.currentTarget.value);
      }}
    />
  );
};

const Model = () => {
  const model = useModelConfigs((state) => state.configs.model);
  const setModel = useModelConfigs((state) => state.setModel);
  return (
    <Select
      value={model}
      data={models.map((o) => ({
        value: o.modelId,
        label: o.model,
        group: o.provider,
      }))}
      onChange={(model: string) => {
        setModel(model);
      }}
      label={
        <Text color="dimmed" ml={2}>
          Model
        </Text>
      }
    />
  );
};
//======================================
export const Content = () => {
  const url = useModelConfigs((state) => state.url);
  return (
    <Paper className="h-full md:w-[200px] lg:w-[270px]">
      {url}
      <Divider label="Text Generation" labelPosition="center" />
      <Model />
      <Temperature />
      <OutputLength />
      <SystemInstruction />

      <Divider
        label="Audio Generation"
        labelPosition="center"
        mb="xs"
        mt="lg"
      />
      <SelectWhisperLanguage />
      {/* <RecordingMode /> */}
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
