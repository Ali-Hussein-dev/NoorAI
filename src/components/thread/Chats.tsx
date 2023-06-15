import { useRouter } from "next/router";
import { BsCheckSquare, BsStars, BsStopFill } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { MdDelete, MdOutlineContentCopy } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { TbReload } from "react-icons/tb";
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
  Accordion,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import * as React from "react";
import { FiEdit3 } from "react-icons/fi";
import { franc } from "franc";
import { useSession } from "next-auth/react";
import {
  useStore,
  type ConversationT,
  useRegenerate,
  useFetchForm,
} from "@/hooks";
import { Whatsnew, Markdown, TemplateEditor } from "@/components";

export const ThreadContainer = () => {
  const list = [
    {
      value: "What's New",
      icon: <BsStars />,
      comp: <Whatsnew />,
    },
    {
      value: "Template Editor (Expermintal)",
      icon: <FiEdit3 />,
      comp: <TemplateEditor />,
    },
  ];
  const { query } = useRouter();
  return (
    <Accordion
      defaultValue="whatsnew"
      className="pb-12"
      variant="filled"
      transitionDuration={500}
      key={query.chatId as string}
    >
      {list.map((o, i) => (
        <Accordion.Item key={i} value={o.value} className="border-none">
          <Accordion.Control
            chevron={<HiPlus size="1rem" />}
            icon={o.icon}
            className="text-xl"
          >
            {o.value}
          </Accordion.Control>
          <Accordion.Panel>{o.comp}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
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
                onClick={() => {
                  delChatPair(i, conversationId);
                  useStore.persist.rehydrate();
                }}
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
  const [dir, setDir] = React.useState({ input: "ltr", output: "ltr" });
  React.useEffect(() => {
    const langs = ["arb", "heb", "pes", "prs", "zlm"];
    const inputDir = langs.includes(franc(input)) ? "rtl" : "ltr";
    const outputDir = langs.includes(franc(content)) ? "rtl" : "ltr";
    setDir({ input: inputDir, output: outputDir });
  }, [input, content]);

  const clipboard = useClipboard({ timeout: 1000 });
  const { data: sessionData } = useSession();

  return (
    <div className="w-full">
      <div
        dir={dir.input}
        className="group flex w-full items-start gap-x-2 px-2 py-4"
      >
        <Avatar radius="xl" src={sessionData?.user.image}>
          <Text color="dimmed">{i + 1}</Text>
        </Avatar>
        <UserMsgEdit input={input} i={i} conversationId={conversationId} />
      </div>
      <Paper
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[0],
        })}
        radius="sm"
        className="group flex items-start gap-x-2 px-3 pb-2 pt-5 md:pr-4"
        dir={dir.output}
      >
        <Avatar radius="xl">
          <Text>N</Text>
        </Avatar>
        <div className="grow">
          <Markdown content={content} />
        </div>
        <ActionIcon
          variant="default"
          size="lg"
          onClick={() => clipboard.copy(content)}
          className="opacity-0 group-hover:opacity-100"
        >
          {clipboard.copied ? (
            <BsCheckSquare size="17" />
          ) : (
            <MdOutlineContentCopy size="17" />
          )}
        </ActionIcon>
      </Paper>
    </div>
  );
};
//======================================
export const Chats = () => {
  const status = useStore((s) => s.status);
  const { query } = useRouter();
  const conversation = useStore((s) =>
    s.conversations.find((o) => o.id === query.chatId)
  ) as ConversationT;
  const { regenerate } = useRegenerate();
  const thread = conversation?.thread || [];
  return (
    <section className="w-full pb-5">
      <ThreadContainer />
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
              const lastPrompt = thread.at(-1)?.input;
              lastPrompt && regenerate(lastPrompt);
            }}
          >
            {status === "loading" ? "Stop" : "Regenerate"}
          </Button>
        )}
      </div>
    </section>
  );
};
