import { MdContentCopy, MdSend } from "react-icons/md";
import { TiStarOutline } from "react-icons/ti";
import * as React from "react";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { useMarkedPrompts } from "~/hooks";
import {
  ScrollArea,
  ActionIcon,
  Text,
  Badge,
  Spoiler,
  Card,
  MultiSelect,
  Loader,
} from "@mantine/core";

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
export const PromptsLib = () => {
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
                <Card.Section className="mb-1 text-left">
                  <Spoiler
                    maxHeight={52}
                    showLabel="Show more"
                    hideLabel="Hide"
                  >
                    <Text color="dimmed">{text}</Text>
                  </Spoiler>
                </Card.Section>
                <Card.Section className="flex-wrap gap-2 pt-1 pb-2 flex-row-start">
                  {tags.map((obj, i) => (
                    <Badge key={i} variant="filled" color="gray">
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
