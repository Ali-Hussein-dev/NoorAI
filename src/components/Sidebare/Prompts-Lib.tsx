import { MdContentCopy, MdSend } from "react-icons/md";
import { TiStarOutline } from "react-icons/ti";
import * as React from "react";
import { notifications } from "@mantine/notifications";
import { api } from "@/utils/api";
import { useMarkedPrompts } from "@/hooks";
import {
  ScrollArea,
  ActionIcon,
  Text,
  Spoiler,
  Card,
  MultiSelect,
  Loader,
  Box,
  useMantineTheme,
} from "@mantine/core";

const Badge = ({ children = "" }) => (
  <Box
    sx={({ colorScheme, colors }) => ({
      backgroundColor: colors.dark[colorScheme === "dark" ? 7 : 1],
      color: colors[colorScheme === "dark" ? "dark" : "gray"][1],
    })}
    className=" rounded px-2 pb-[2px] text-sm"
  >
    {children}
  </Box>
);

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
    mutate({ tags: filterQuery });
  };
  return { filterQuery, setFilterQuery, ...res, onSubmit, tags: tags.data };
};

//======================================
const InitialView = () => {
  return (
    <div className="w-full pt-3 flex-col-start">
      <Text weight="bold" mb="xs">
        Prompts Library
      </Text>
      <div>
        {[
          "Get inspired",
          "Learn from others",
          "Prompts library is updated regularly",
        ].map((s) => (
          <Text key={s} color="dimmed" size="lg">
            {s}
          </Text>
        ))}
      </div>
    </div>
  );
};
type PromptT = {
  id: string;
  text: string;
  popularity: number;
  tags: string[];
};
//======================================
export const PromptsLib = () => {
  const { filterQuery, setFilterQuery, data, onSubmit, status, tags } =
    useFetchPrompts();
  const { push } = useMarkedPrompts();
  const { mutate } = api.prompts.popularity.useMutation();
  const { colors } = useMantineTheme();
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
      <ScrollArea h="70vh" scrollHideDelay={500} className="py-1 ">
        <div className="h-full space-y-2">
          {!data && <InitialView />}
          <Text hidden={!data} color="dimmed">
            Result: {data?.length}
          </Text>
          {data?.map(({ text, tags, id, popularity }: PromptT) => (
            <Card key={text} p="xl" shadow="sm">
              <Card.Section className="mb-1 text-left">
                <Spoiler
                  maxHeight={52}
                  showLabel="Show more"
                  hideLabel="Hide"
                  styles={{
                    control: {
                      color: colors.gray[4],
                      fontWeight: 600,
                    },
                  }}
                >
                  <Text color="dimmed">{text}</Text>
                </Spoiler>
              </Card.Section>
              <Card.Section className="flex-wrap gap-2 pb-2 pt-1 flex-row-start">
                {tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Card.Section>
              <Card.Section withBorder className="gap-2 pr-1 flex-row-end">
                <Text size="sm" color="dimmed" className="w-full">
                  {popularity > 0
                    ? `Used ${popularity} ${popularity > 1 ? "times" : "time"}`
                    : ""}
                </Text>
                <ActionIcon
                  onClick={() => {
                    push({
                      text,
                      tags: tags.map((s) => ({ name: s })),
                      id,
                    });
                    notifications.show({
                      message: "Prompt Saved for later use",
                      withCloseButton: true,
                      color: "lime",
                    });
                    mutate({ id });
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
                    mutate({ id });
                  }}
                >
                  <MdContentCopy />
                </ActionIcon>
              </Card.Section>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
