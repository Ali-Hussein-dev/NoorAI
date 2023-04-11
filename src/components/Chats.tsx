import { useStore, type ConversationT, useRegenerate } from "~/hooks";
import { useRouter } from "next/router";
import {
  BsFillEmojiFrownFill,
  BsFillEmojiSmileFill,
  BsRobot,
  BsStopFill,
} from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { MdDelete, MdInfo } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { type Language } from "prism-react-renderer";
import {
  Title,
  ActionIcon,
  Avatar,
  Text,
  Paper,
  Drawer,
  Card,
  Divider,
  Tooltip,
  useMantineTheme,
  Badge,
  Spoiler,
  Button,
} from "@mantine/core";
import remarkGfm from "remark-gfm";
import { useDisclosure } from "@mantine/hooks";
import * as React from "react";
import clsx from "clsx";
import { HiArrowSmRight } from "react-icons/hi";
import dynamic from "next/dynamic";
import promptTips from "~/content/prompt-tips.json";
import verbs from "~/content/verbs.json";
import tones from "~/content/tones.json";

const Prism = dynamic(() => import("@mantine/prism").then((c) => c.Prism), {
  ssr: false,
});

//======================================
export const PromptTips = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerChildren, setdrawerChildren] = React.useState(<div></div>);
  return (
    <>
      <div className="prose max-w-full">
        <Title order={2} className="gap-2 flex-row-center">
          <MdInfo size="24" />
          Prompt Tips & Tricks
        </Title>
        <Drawer
          opened={opened}
          onClose={close}
          title={""}
          overlayProps={{
            opacity: 0.2,
          }}
          position="right"
          size="sm"
        >
          {drawerChildren}
        </Drawer>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {promptTips.map((o, i) => (
            <div
              key={i}
              className={clsx(
                i < 3 && "lg:col-span-2",
                i == 3 && "lg:col-span-3",
                i == 4 && "col-span-full lg:col-span-3"
              )}
            >
              <Card
                component="button"
                onClick={() => {
                  open();
                  setdrawerChildren(
                    <div className="space-y-3">
                      <Title order={4} color="dimmed">
                        {o.title}
                      </Title>
                      <Text size="lg">{o.description}</Text>
                      <Divider />
                      <Title order={5}>Examples:</Title>
                      <div className="flex flex-col items-start gap-y-2">
                        <BsFillEmojiFrownFill size="28" />
                        <Text size="lg" color="dimmed">
                          {o.b}
                        </Text>
                      </div>
                      <div className="flex flex-col items-start gap-y-2">
                        <BsFillEmojiSmileFill size="28" />
                        <Text size="lg" color="dimmed">
                          {o.g}
                        </Text>
                      </div>
                    </div>
                  );
                }}
                p="xs"
                h="100%"
                w="100%"
                className="group"
              >
                <div className="flex-col-start">
                  <div className="w-full gap-x-2 flex-row-between">
                    <Title order={4}>{o.title}</Title>
                    <HiArrowSmRight className="mt-5 hidden group-hover:inline-block" />
                  </div>
                  <Text size="lg" color="dimmed" ta="left">
                    {o.description}
                  </Text>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-10 pb-10">
        <div>
          <Title ta="center" order={3} mb={24}>
            Tone Of Voice Examples
          </Title>
          <Spoiler
            maxHeight={80}
            showLabel="Show more"
            hideLabel="Hide"
            styles={{ control: { width: "100%" } }}
          >
            <div className="grid grid-cols-3 gap-y-5 gap-x-3 sm:grid-cols-5 md:grid-cols-6">
              {tones.map((o, i) => (
                <Badge key={i} color="gray" size="lg">
                  <Text color="dimmed" tt="none">
                    {o.name}
                  </Text>
                </Badge>
              ))}
            </div>
          </Spoiler>
        </div>
        <div>
          <Title ta="center" order={3} mb={24}>
            Verbs Examples
          </Title>
          <Spoiler
            maxHeight={80}
            showLabel="Show more"
            hideLabel="Hide"
            styles={{ control: { width: "100%" } }}
          >
            <div className="grid grid-cols-3 gap-y-5 gap-x-3 sm:grid-cols-5 md:grid-cols-6">
              {verbs.map((o, i) => (
                <Badge color="gray" key={i} size="lg">
                  <Text color="dimmed" tt="none">
                    {o.name}
                  </Text>
                </Badge>
              ))}
            </div>
          </Spoiler>
        </div>
      </div>
    </>
  );
};

//======================================
export const Markdown = ({ content }: { content: string }) => {
  const theme = useMantineTheme();
  return (
    <div
      style={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.gray[6]
            : theme.colors.gray[7],
      }}
      className="prose w-full max-w-full overflow-hidden pr-2 md:pr-12"
    >
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={content}
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "language-js");
            const codeValue = String(children).replace(/\n$/, "");
            return !inline && match ? (
              <Prism withLineNumbers language={match[1] as Language}>
                {codeValue}
              </Prism>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};
//======================================
export const Chats = () => {
  const { conversations, delChatPair, status } = useStore();
  const { regenerate } = useRegenerate();
  const { query } = useRouter();
  const conversation = conversations.find(
    (o) => o.id === query.chatId
  ) as ConversationT;
  const thread = conversation?.thread || [];

  const theme = useMantineTheme();

  if (thread.length < 1) return <PromptTips />;

  return (
    <section className="w-full pb-5">
      <Title order={4} className="mb-3 text-center">
        Total messages: {thread.length}
      </Title>
      <div className="gap-4 flex-col-center">
        {thread.map((o, i) => (
          <div key={i} className=" w-full">
            <div className="group flex w-full items-start gap-x-2 px-2 py-3">
              <Avatar radius="xl">{i + 1}</Avatar>
              <Text color="dimmed" className="mt-1 grow">
                {o?.input}
              </Text>
              <Tooltip label="Remove unrelated chat" withArrow position="left">
                <ActionIcon
                  color="red"
                  radius="xl"
                  size="lg"
                  disabled={status == "loading"}
                  onClick={() => delChatPair(i, conversation.id)}
                  className="ml-0 opacity-0 group-hover:opacity-100"
                >
                  <MdDelete size="20" />
                </ActionIcon>
              </Tooltip>
            </div>
            <Paper
              style={{
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[1],
              }}
              radius="sm"
              className="flex items-start gap-x-2 px-2 pt-5"
            >
              <Avatar radius="xl">
                <BsRobot />
              </Avatar>
              {typeof o?.message?.content === "string" && (
                <Markdown content={o.message?.content} />
              )}
            </Paper>
          </div>
        ))}
        {thread.length > 0 && (
          <Button
            leftIcon={status == "loading" ? <BsStopFill /> : <TbReload />}
            variant="default"
            type="button"
            onClick={() => {
              regenerate();
            }}
          >
            {status === "loading" ? "Stop" : "Regenerate"}
          </Button>
        )}
      </div>
    </section>
  );
};
