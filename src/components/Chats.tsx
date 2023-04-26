import {
  useStore,
  type ConversationT,
  useRegenerate,
  useFetchForm,
} from "@/hooks";
import { useRouter } from "next/router";
import { BsStopFill } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { MdDelete, MdOutlineContentCopy } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { type Language } from "prism-react-renderer";
import {
  ActionIcon,
  Avatar,
  Text,
  Paper,
  Tooltip,
  useMantineTheme,
  Button,
  Textarea,
  Spoiler,
} from "@mantine/core";
import remarkGfm from "remark-gfm";
import { useClipboard } from "@mantine/hooks";
import * as React from "react";
import dynamic from "next/dynamic";
import { FiEdit3 } from "react-icons/fi";
import { franc } from "franc";
import { InitialChatsView } from "@/components";

const Prism = dynamic(() => import("@mantine/prism").then((c) => c.Prism), {
  ssr: false,
});

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
export const UserMsgEdit = ({ input = "", i = 0, conversationId = "" }) => {
  const {
    methods: { register, getValues },
    onSubmit,
  } = useFetchForm({ promptText: input });
  const sliceThread = useStore((s) => s.sliceThread);
  const { query } = useRouter();
  const [editing, setEditing] = React.useState(false);
  const status = useStore((s) => s.status);
  const delChatPair = useStore((s) => s.delChatPair);
  const theme = useMantineTheme();
  return (
    <div className="grow">
      {editing ? (
        <div className="">
          <Textarea
            {...register("promptText")}
            className="w-full"
            minRows={6}
            maxRows={8}
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
        <div className="flex grow items-start justify-between gap-2">
          <Spoiler
            style={{
              color: theme.colors.gray[theme.colorScheme === "dark" ? 7 : 6],
            }}
            className="prose w-full max-w-full grow overflow-hidden"
            maxHeight={155}
            showLabel="Show more"
            hideLabel="Hide"
            styles={{
              control: {
                color: theme.colors.gray[theme.colorScheme === "dark" ? 6 : 7],
                fontWeight: 600,
              },
            }}
          >
            <ReactMarkdown>{input}</ReactMarkdown>
          </Spoiler>
          <div className="gap-1 flex-row-start">
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
        <UserMsgEdit input={input} i={i} conversationId={conversationId} />
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

  if (thread.length < 1 && status !== "loading") return <InitialChatsView />;

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
