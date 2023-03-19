import { BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useMarkedPrompts, useStore } from "../hooks";
import {
  ScrollArea,
  Button,
  ActionIcon,
  Tabs,
  Text,
  Badge,
  Spoiler,
  Paper,
  Card,
  MultiSelect,
  Loader,
  Textarea,
  Collapse,
} from "@mantine/core";
import { MdContentCopy, MdOutlineDelete, MdSend } from "react-icons/md";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { TiStarOutline } from "react-icons/ti";
import { InfoModal, OpenaiConfig } from ".";
import * as React from "react";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { useDisclosure } from "@mantine/hooks";

const ChatHistory = dynamic(() => import(".").then((a) => a.ChatHistory), {
  ssr: false,
});

const useFetchPrompts = () => {
  const [filterQuery, setFilterQuery] = React.useState<never[] | string[]>([]);
  const tags = api.prompts.tags.useQuery(undefined, {
    cacheTime: 60 * 60 * 24,
    staleTime: 60 * 60,
  });

  const res = api.prompts.prompts.useMutation();
  const { mutate } = res;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ prompts: filterQuery });
  };
  return { filterQuery, setFilterQuery, ...res, onSubmit, tags: tags.data };
};
//======================================
const PromptsLib = () => {
  const { filterQuery, setFilterQuery, data, onSubmit, status, tags } =
    useFetchPrompts();
  const { push } = useMarkedPrompts();
  return (
    <div className="h-full">
      <form onSubmit={onSubmit} className="gap-2 flex-row-start">
        <MultiSelect
          value={filterQuery}
          onChange={setFilterQuery}
          data={tags || []}
          placeholder="Search by tags"
          className="grow"
          searchable
          rightSection={
            !filterQuery || filterQuery.length > 0 ? (
              <ActionIcon type="submit" size="md">
                {status == "loading" ? (
                  <Loader variant="dots" size="sm" />
                ) : (
                  <MdSend />
                )}
              </ActionIcon>
            ) : undefined
          }
        />
      </form>
      <ScrollArea h="70vh" scrollHideDelay={500} className="pt-2 pb-8">
        <div className="h-full space-y-2">
          <Text italic>Prompts Found: {data?.length}</Text>
          {data?.map(
            ({
              text,
              tags,
              id,
            }: {
              id: string;
              text: string;
              tags: { name: string }[];
            }) => (
              <Card key={text} p="xl" shadow="sm">
                <Card.Section className="text-left">
                  <Spoiler
                    maxHeight={52}
                    showLabel="Show more"
                    hideLabel="Hide"
                  >
                    <Text>{text}</Text>
                  </Spoiler>
                </Card.Section>
                <Card.Section className="gap-x-2 pt-1 pb-2 flex-row-start">
                  {tags.map((obj, i) => (
                    <Badge
                      key={i}
                      variant="filled"
                      color="gray"
                      radius="xs"
                      py="sm"
                      px={4}
                    >
                      {obj.name}
                    </Badge>
                  ))}
                </Card.Section>
                <Card.Section withBorder className="gap-2 pr-1 flex-row-end">
                  <ActionIcon
                    onClick={() => {
                      push({ text, tags, id });
                      notifications.show({
                        message: "Prompt Saved for later use",
                        withCloseButton: true,
                        color: "lime",
                      });
                    }}
                  >
                    <TiStarOutline />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      if ("clipboard" in navigator) {
                        navigator.clipboard.writeText(text);
                      }
                      notifications.show({
                        message: "Prompt Copied",
                        withCloseButton: true,
                        color: "lime",
                      });
                    }}
                  >
                    <MdContentCopy />
                  </ActionIcon>
                </Card.Section>
              </Card>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
const CreatePromptForm = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const create = useMarkedPrompts((s) => s.create);
  const [form, setForm] = React.useState<{
    text: string;
    tags: Array<{ value: string; label: string }>;
  }>({ text: "", tags: [] });
  const [tags, setTags] = React.useState<Array<string>>([]);
  return (
    <div className="mb-3">
      <Button
        onClick={toggle}
        className="mb-2 w-full"
        variant="default"
        color="gray"
      >
        {opened ? "X" : "Create Prompt"}
      </Button>
      <div>
        <Collapse in={opened} className="">
          <Paper className="space-y-2 px-2 pt-3 pb-1" withBorder>
            <Textarea
              required
              autosize
              placeholder="Your Prompt..."
              minRows={2}
              maxRows={5}
              value={form.text}
              onChange={(e) =>
                setForm({ ...form, text: e.currentTarget.value })
              }
            />
            <MultiSelect
              searchable
              creatable
              clearable
              data={form.tags}
              value={tags}
              onChange={setTags}
              placeholder="Add tags"
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setForm((prv) => ({
                  text: prv.text,
                  tags: [...prv.tags, item],
                }));
                return item;
              }}
            />
            <div className="gap-2 flex-row-between">
              <Button
                color="dark"
                variant="filled"
                className="w-full"
                onClick={() => setForm({ text: "", tags: [] })}
                size="xs"
              >
                Reset
              </Button>
              <Button
                color="dark"
                disabled={!form.text}
                variant="filled"
                className="w-full"
                onClick={() => {
                  create(
                    form.text,
                    form.tags.map((t) => ({ name: t.value as string }))
                  );
                  setForm({ text: "", tags: [] });
                  setTags([]);
                }}
                size="xs"
              >
                Save
              </Button>
            </div>
          </Paper>
        </Collapse>
      </div>
    </div>
  );
};

const MarkedPrompts = () => {
  const userPrompts = useMarkedPrompts((s) => s.list);
  const drop = useMarkedPrompts((s) => s.drop);
  return (
    <ScrollArea h="70vh" scrollHideDelay={50} className="pt-1">
      <CreatePromptForm />
      <div className="h-full space-y-2">
        {userPrompts.map(({ tags, text, id }, i) => (
          <Card key={i} shadow="sm" p="xl" pb="md">
            <Card.Section className="mb-2 text-left">
              <Spoiler maxHeight={52} showLabel="Show more" hideLabel="Hide">
                <Text>{text}</Text>
              </Spoiler>
            </Card.Section>
            <Card.Section className="gap-x-2 pt-1 pb-2 flex-row-start">
              {tags.map((obj, i) => (
                <Badge
                  key={i}
                  variant="filled"
                  color="gray"
                  radius="xs"
                  py="sm"
                  px={4}
                >
                  {obj.name}
                </Badge>
              ))}
            </Card.Section>
            <Card.Section className="gap-x-2 pb-1 pr-2 flex-row-end" withBorder>
              <ActionIcon
                onClick={() => {
                  drop(id);
                  notifications.show({
                    message: "Prompt has been removed",
                    withCloseButton: true,
                    color: "orange",
                  });
                }}
              >
                <MdOutlineDelete />
              </ActionIcon>
              {/* <ActionIcon
                onClick={() => {
                  console.log("...");
                }}
              >
                <MdOutlineEdit />
              </ActionIcon> */}
              <ActionIcon
                onClick={() => {
                  if ("clipboard" in navigator) {
                    navigator.clipboard.writeText(text);
                  }
                  notifications.show({
                    message: "Prompt Copied",
                    withCloseButton: true,
                    color: "lime",
                  });
                }}
              >
                <MdContentCopy />
              </ActionIcon>
            </Card.Section>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
function PromptsTabs() {
  const createConversation = useStore((s) => s.createConversation);
  const { push } = useRouter();
  return (
    <Tabs defaultValue="1">
      <Tabs.List grow>
        <Tabs.Tab value="1" icon={<AiOutlineHistory />}>
          History
        </Tabs.Tab>
        <Tabs.Tab value="2" icon={<HiOutlineRectangleStack />}>
          Library
        </Tabs.Tab>
        <Tabs.Tab value="3" icon={<TiStarOutline />}>
          Saved
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="1" className="pt-2">
        <Button
          variant="default"
          color="gray"
          type="button"
          onClick={() => {
            const id = crypto.randomUUID();
            createConversation(id);
            push(`/${id}`);
          }}
          className="w-full"
        >
          <BsPlus size="17" />
          <span>New Chat</span>
        </Button>
        <ScrollArea scrollHideDelay={50} h="70vh" className="pt-1">
          <ChatHistory />
        </ScrollArea>
      </Tabs.Panel>
      <Tabs.Panel value="2" className="pt-2">
        <PromptsLib />
      </Tabs.Panel>
      <Tabs.Panel value="3" className="pt-2">
        <MarkedPrompts />
      </Tabs.Panel>
    </Tabs>
  );
}
//======================================
export const Sidebar = () => {
  return (
    <div className="h-full w-full gap-y-2 flex-col-center">
      <div className="w-full grow space-y-2">
        <PromptsTabs />
      </div>
      <div className="sticky bottom-0 w-full gap-2 border-t border-neutral-600 pb-2 pt-3 flex-row-center">
        <OpenaiConfig />
        <InfoModal />
      </div>
    </div>
  );
};
