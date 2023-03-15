import { BsMoonStarsFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useStore } from "../hooks";
import {
  ScrollArea,
  Button,
  ActionIcon,
  useMantineColorScheme,
  Tabs,
  Text,
  Badge,
  Spoiler,
  Paper,
  Card,
  MultiSelect,
  Loader,
} from "@mantine/core";
import { FaSun } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { ApiKeyModal } from ".";
import * as React from "react";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";

const ChatHistory = dynamic(() => import(".").then((a) => a.ChatHistory), {
  ssr: false,
});

export function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      size="lg"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <FaSun size="1.1rem" /> : <BsMoonStarsFill size="1.1rem" />}
    </ActionIcon>
  );
}

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
  return (
    <div className="h-full pt-2 ">
      <form onSubmit={onSubmit} className="gap-2 flex-row-start">
        <MultiSelect
          value={filterQuery}
          onChange={setFilterQuery}
          data={tags || []}
          placeholder="Search by tags"
          className="grow"
        />
        <ActionIcon
          type="submit"
          disabled={!filterQuery || filterQuery.length < 1}
          size="lg"
        >
          {status == "loading" ? (
            <Loader variant="dots" size="sm" />
          ) : (
            <MdSend />
          )}
        </ActionIcon>
      </form>
      <ScrollArea h="70vh" scrollHideDelay={500} className="pt-2">
        <div className="h-full space-y-2">
          <Text italic>Prompts Found: {data?.length}</Text>
          {data?.map(
            ({ text, tags }: { text: string; tags: { name: string }[] }) => (
              <Card key={text} className="group" p="xl" shadow="sm">
                <Card.Section
                  component="button"
                  onClick={() => {
                    if ("clipboard" in navigator) {
                      navigator.clipboard.writeText(text);
                    }
                    notifications.show({
                      message: "Prompt Copied",
                      withCloseButton: true,
                      color: "cyan",
                    });
                  }}
                  className="text-left"
                >
                  <Spoiler
                    maxHeight={52}
                    showLabel="Show more"
                    hideLabel="Hide"
                  >
                    <Text>{text}</Text>
                  </Spoiler>
                </Card.Section>
                <Card.Section className="gap-x-2 pt-1 flex-row-start">
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
              </Card>
            )
          )}
        </div>
        <div className="h-10 w-full" />
      </ScrollArea>
    </div>
  );
};
function PromptsTabs() {
  return (
    <Tabs defaultValue="1">
      <Tabs.List grow>
        <Tabs.Tab value="1" icon={<AiOutlineHistory />}>
          History
        </Tabs.Tab>
        <Tabs.Tab value="2" icon={<HiOutlineRectangleStack />}>
          Libray
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="1">
        {" "}
        <ScrollArea scrollHideDelay={50} className="h-full max-h-[70vh] pt-2">
          <ChatHistory />
        </ScrollArea>
      </Tabs.Panel>
      <Tabs.Panel value="2">
        <PromptsLib />
      </Tabs.Panel>
    </Tabs>
  );
}
//======================================
export const Sidebar = () => {
  const createConversation = useStore((s) => s.createConversation);
  const { push } = useRouter();

  return (
    <div className="h-full w-full gap-y-2 flex-col-center">
      <div className="h-full w-full space-y-2">
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
          <BsPlus size="18" />
          <span>New Chat</span>
        </Button>
        <PromptsTabs />
      </div>
      <Paper
        radius={0}
        className="sticky bottom-0 w-full gap-2 border-t border-neutral-500 pb-2 pt-3 flex-row-center"
      >
        <ToggleTheme />
        <ApiKeyModal />
      </Paper>
    </div>
  );
};
