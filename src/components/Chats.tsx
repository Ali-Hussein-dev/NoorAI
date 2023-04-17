import {
  useStore,
  type ConversationT,
  useRegenerate,
  useFetchForm,
} from "~/hooks";
import { useRouter } from "next/router";
import {
  BsFillEmojiFrownFill,
  BsFillEmojiSmileFill,
  BsRobot,
  BsStopFill,
} from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { MdDelete, MdInfo, MdOutlineContentCopy } from "react-icons/md";
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
  Textarea,
} from "@mantine/core";
import remarkGfm from "remark-gfm";
import { useDisclosure, useClipboard } from "@mantine/hooks";
import * as React from "react";
import clsx from "clsx";
import { HiArrowSmRight } from "react-icons/hi";
import dynamic from "next/dynamic";
import promptTips from "~/content/prompt-tips.json";
import verbs from "~/content/verbs.json";
import tones from "~/content/tones.json";
import { FiEdit3 } from "react-icons/fi";
import { franc } from "franc";

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
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5 md:grid-cols-6">
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
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5 md:grid-cols-6">
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
      className="prose w-full max-w-full overflow-hidden"
    >
      <ReactMarkdown
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
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export const UserMsgEdit = ({ input = "", i = 0 }) => {
  const {
    methods: { register, getValues },
    onSubmit,
  } = useFetchForm({ promptText: input });
  const sliceThread = useStore((s) => s.sliceThread);
  const { query } = useRouter();
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="grow">
      {editing ? (
        <div className="">
          <Textarea
            {...register("promptText")}
            className="w-full"
            styles={{ input: { background: "transparent" } }}
          />
          <div className="w-full gap-4 pt-2 flex-row-end">
            <Button
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setEditing(false);
                const promptText = getValues("promptText");
                // update state: drop everything after index
                sliceThread(i, query.chatId as string);
                useStore.persist.rehydrate();
                void onSubmit({ promptText });
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <div className="grow gap-2 flex-row-between">
          <Text
            onClick={() => setEditing(true)}
            color="dimmed"
            className="mt-1 grow hover:cursor-pointer"
          >
            {input}
          </Text>
          {/* <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
            {input}
          </ReactMarkdown> */}
          <Tooltip
            label="click to on the text to edit"
            withArrow
            position="left"
          >
            <ActionIcon
              size="lg"
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100"
            >
              <FiEdit3 size="17" />
            </ActionIcon>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
const ChatPair = ({
  i = 0,
  content,
  input,
  conversationId,
}: {
  content: string;
  input: string;
  i: number;
  conversationId: string;
}) => {
  const status = useStore((s) => s.status);
  const delChatPair = useStore((s) => s.delChatPair);
  const [dir, setDir] = React.useState("ltr");
  React.useEffect(() => {
    const lang = franc(input);
    console.log("LANG:", lang);
    const dir = ["arb", "heb", "pes", "prs", "zlm"].includes(lang)
      ? "rtl"
      : "ltr";
    setDir(dir);
  }, [input]);
  const clipboard = useClipboard();
  return (
    <div key={i} className="w-full" dir={dir}>
      <div className="group flex w-full items-start gap-x-2 px-2 py-4">
        <Avatar radius="xl">
          <Text color="dimmed">{i + 1}</Text>
        </Avatar>
        <UserMsgEdit input={input} i={i} />
        <Tooltip label="Remove unrelated chat" withArrow position="left">
          <ActionIcon
            color="red"
            size="lg"
            disabled={status == "loading"}
            onClick={() => delChatPair(i, conversationId)}
            className="ml-0 opacity-0 group-hover:opacity-100"
          >
            <MdDelete size="20" />
          </ActionIcon>
        </Tooltip>
      </div>
      <Paper
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[1],
        })}
        radius="sm"
        className="group flex items-start gap-x-2 px-3 pb-2 pt-5 md:pr-4"
        dir={dir}
      >
        <Avatar radius="xl">
          <Text color="dimmed">N</Text>
        </Avatar>
        <div
          onClick={() => clipboard.copy(content)}
          className="grow cursor-default"
        >
          <Markdown content={content} />
        </div>
        <ActionIcon
          variant="default"
          size="lg"
          onClick={() => clipboard.copy(content)}
          className="opacity-0 group-hover:opacity-100"
        >
          <MdOutlineContentCopy size="17" />
        </ActionIcon>
      </Paper>
    </div>
  );
};
//======================================
export const Chats = () => {
  const { conversations, status } = useStore();
  const { regenerate } = useRegenerate();
  const { query } = useRouter();
  const conversation = conversations.find(
    (o) => o.id === query.chatId
  ) as ConversationT;
  const thread = conversation?.thread || [];

  if (thread.length < 1 && status !== "loading") return <PromptTips />;

  return (
    <section className="w-full pb-5 pt-4">
      <div className="gap-4 flex-col-center">
        {thread.map((o, i) => (
          <ChatPair
            key={o.input + i}
            i={i}
            content={o?.message?.content || ""}
            input={o.input}
            conversationId={conversation.id}
          />
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
