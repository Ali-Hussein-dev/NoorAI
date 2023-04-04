import {
  Anchor,
  Select,
  Button,
  Modal,
  Text,
  ActionIcon,
  Tooltip,
  Paper,
  MultiSelect,
  Slider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import * as React from "react";
import { HiCursorClick } from "react-icons/hi";
import { usePromptBuilder } from "~/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { ImInfo } from "react-icons/im";

//======================================
export const Action = () => {
  const actions = usePromptBuilder((s) => s.actions);
  const setPrompt = usePromptBuilder((s) => s.setPrompt);
  // const value = usePromptBuilder((s) => s.promptBlocks.actions);
  const [data, setData] = React.useState(actions);
  return (
    <Select
      label="Start with"
      placeholder="e.g explain, generate, describe, etc."
      data={data}
      dropdownPosition="bottom"
      variant="filled"
      searchable
      creatable
      clearable
      // value={value}
      onChange={(value: string) => {
        setPrompt(value, "actions");
      }}
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = query.trim();
        setData((current) => [...current, item]);
        return item;
      }}
    />
  );
};
//======================================
export const Output = () => {
  const outputs = usePromptBuilder((s) => s.outputs);
  const setPrompt = usePromptBuilder((s) => s.setPrompt);
  // const value = usePromptBuilder((s) => s.promptBlocks.outputs);
  const [data, setData] = React.useState(outputs);

  return (
    <Select
      label="Desired output"
      placeholder="e.g email, blog post, etc."
      data={data}
      // value={value}
      onChange={(value: string) => {
        setPrompt(value, "outputs");
      }}
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = query.trim();
        setData((current) => [...current, item]);
        return item;
      }}
      dropdownPosition="bottom"
      variant="filled"
      searchable
      creatable
      clearable
    />
  );
};

const MaxWords = () => {
  const setPrompt = usePromptBuilder((s) => s.setPrompt);
  const [maxwords, setMaxwords] = React.useState<number | undefined>();
  return (
    <div className="w-full">
      <Text
        className="mb-1"
        size="sm"
        weight="bold"
        classNames="flex-row-between"
      >
        Max words {maxwords ? " | " + maxwords : ""}
      </Text>
      <Slider
        color="gray"
        value={maxwords}
        onChange={(value: number) => {
          setMaxwords(value);
          setPrompt(value.toString(), "maxWords");
        }}
        min={0}
        max={4000}
        step={25}
        className="w-full "
      />
    </div>
  );
};
const Tone = () => {
  const tones = usePromptBuilder((s) => s.tones);
  const setPrompt = usePromptBuilder((s) => s.setPrompt);
  // const value = usePromptBuilder((s) => s.promptBlocks.tones);
  const [data, setData] = React.useState(tones);
  // todo should be composable: use multiple select
  return (
    <MultiSelect
      label="Tone of writing"
      placeholder="e.g formal, personal, friendly, etc."
      data={data}
      dropdownPosition="bottom"
      variant="filled"
      searchable
      creatable
      clearable
      // value={value}
      onChange={(value: string[]) => setPrompt(value, "tones")}
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = query.trim();
        setData((current) => [...current, item]);
        return item;
      }}
      // rightSection={<div></div>}
    />
  );
};
const TargetAudience = () => {
  const audience = usePromptBuilder((s) => s.audience);
  const setPrompt = usePromptBuilder((s) => s.setPrompt);
  // const value = usePromptBuilder((s) => s.promptBlocks.audience);

  const [data, setData] = React.useState(audience);
  return (
    <Select
      label="Target audience"
      placeholder="e.g 5 years old, not tech savvy, etc."
      data={data}
      // value={value}
      onChange={(value: string) => {
        setPrompt(value, "audience");
      }}
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = query.trim();
        setData((current) => [...current, item]);
        return item;
      }}
      dropdownPosition="bottom"
      variant="filled"
      searchable
      creatable
      clearable
    />
  );
};
const Role = () => {
  const roles = usePromptBuilder((s) => s.roles);
  const setPrompt = usePromptBuilder((s) => s.setPrompt);
  // const value = usePromptBuilder((s) => s.promptBlocks.roles);
  const [data, setData] = React.useState(roles);
  return (
    <Select
      label="Role"
      placeholder="e.g teacher, programmer, CEO, etc."
      data={data}
      // value={value}
      getCreateLabel={(query) => `+ Create ${query}`}
      onChange={(value: string) => {
        setPrompt(value, "roles");
      }}
      onCreate={(query) => {
        const item = query.trim();
        setData((current) => [...current, item]);
        return item;
      }}
      dropdownPosition="bottom"
      variant="filled"
      searchable
      creatable
      clearable
    />
  );
};

//======================================
export const PromptBuilder = <T,>({ setValue }: { setValue: T }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const prompt = usePromptBuilder((s) => s.prompt);
  // const reset = usePromptBuilder((s) => s.reset);
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Prompt Builder (beta)"
        size="xl"
        fullScreen={isMobile}
        keepMounted={true}
      >
        <Text color="dimmed" className="mb-1">
          The prompt builder should assist you in crafting the prompt that will
          produce the desired result with greater ease.
        </Text>
        <div className="grid max-w-3xl grid-cols-1 gap-4 lg:mb-8 lg:grid-cols-2">
          <div className="space-y-4 pt-1">
            <Action />
            <Role />
            <Tone />
            <Output />
            <TargetAudience />
            <MaxWords />
          </div>
          <div className="">
            <div className="mb-[1px] flex-row-between">
              <Text className="font-medium">Result</Text>
              <Tooltip
                label="Complete editing the prompt in the text field."
                withArrow
                multiline
              >
                <ActionIcon color="dark">
                  <ImInfo size="17" />
                </ActionIcon>
              </Tooltip>
            </div>
            <Paper withBorder p="sm" className="h-full">
              <ReactMarkdown
                // eslint-disable-next-line react/no-children-prop
                children={prompt}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                className="prose"
              />
            </Paper>
          </div>
        </div>
        <div className="w-full pt-4 flex-row-between">
          <Anchor
            href="https://twitter.com/AliHussein_20"
            color="blue"
            target="_blank"
          >
            Share your feedback
          </Anchor>
          <div className="flex w-full max-w-sm gap-2">
            <Button w="100%" color="gray" onClick={close}>
              Cancel
            </Button>
            <Button
              w="100%"
              variant="default"
              bg="orange"
              onClick={() => {
                // @ts-expect-error type is correct
                setValue("promptText", prompt.trim());
                // reset();
                close();
              }}
            >
              Use
            </Button>
          </div>
        </div>
      </Modal>
      <Tooltip label="Prompt builder" withArrow position="right">
        <ActionIcon onClick={open}>
          <HiCursorClick />
        </ActionIcon>
      </Tooltip>
    </>
  );
};
