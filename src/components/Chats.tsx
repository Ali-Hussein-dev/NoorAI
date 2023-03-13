import { useStore, type ConversationT } from "~/hooks";
import { useRouter } from "next/router";
import { BsRobot } from "react-icons/bs";
import { MdDelete, MdInfo } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { type Language } from "prism-react-renderer";
import {
  Skeleton,
  Title,
  ActionIcon,
  Avatar,
  Text,
  Paper,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import remarkGfm from "remark-gfm";

const list = [
  {
    prefix: "Be Specific & Clear: ",
    p: "Be specific and clear: ask a well-defined question",
  },
  {
    prefix: "Use Proper Grammar: ",
    p: "Write complete sentences and use appropriate grammar.",
  },
  {
    prefix: "Use Keywords ",
    p: " Include relevant keywords that are relevant to your prompt.",
  },
  {
    prefix: "Be Brief: ",
    p: "Avoid asking too many questions in one prompt and keep your questions short and straightforward.",
  },
  {
    prefix: "Proofread: ",
    p: "Before submitting, double-check your prompt to ensure that it is well-written and grammatically correct.",
  },
  {
    prefix: "Give Context: ",
    p: "If your question pertains to a particular subject. such as programming, healthy care, ...etc",
  },
];
//======================================
export const PromptTips = () => {
  return (
    <div className="prose max-w-full p-1">
      <Title
        order={2}
        className="mb-4 gap-2 text-2xl text-teal-300 flex-row-center"
      >
        <MdInfo size="30" />
        Prompt Tips For Better Results
      </Title>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((o, i) => (
          <Paper key={i} className="rounded-sm " p="sm">
            <Title order={4} className="mb-1">
              {o.prefix}
            </Title>
            <Text size="lg">{o.p}</Text>
          </Paper>
        ))}
      </div>
    </div>
  );
};

//======================================
const SkeletonBlock = () => {
  return (
    <div className="space-y-3 p-1 pt-4">
      <Skeleton height={10} width="60%" radius="xl" />
      <Skeleton height={10} width="70%" radius="xl" />
      <Skeleton height={10} width="100%" radius="xl" />
      <Skeleton height={10} width="100%" radius="xl" />
      <Skeleton height={10} width="100%" radius="xl" />
      <Skeleton height={10} width="80%" radius="xl" />
    </div>
  );
};
//======================================
export const Markdown = ({ content }: { content: string }) => {
  return (
    <div className="w-full max-w-full pr-12 sm:text-[18px]">
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={content}
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "language-js");
            const codeValue = String(children).replace(/\n$/, "");
            return !inline && match ? (
              <div className="py-4">
                <Prism withLineNumbers language={match[1] as Language}>
                  {codeValue}
                </Prism>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}{" "}
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
  const { query } = useRouter();
  const conversation = conversations.find(
    (o) => o.id === query.chatId
  ) as ConversationT;
  const thread = conversation?.thread || [];

  return (
    <section className="w-full py-10 px-2">
      {thread.length > 0 ? (
        <>
          <h3 className="mb-3 text-center italic">
            Total Messages: {thread.length}
          </h3>
          <div className="gap-4 flex-col-center">
            {thread.map((o, i) => (
              <div key={i} className=" w-full">
                <div className="group w-full gap-x-2 px-2 py-3 flex-row-start">
                  <Avatar radius="xl">{i + 1}</Avatar>
                  <p className="grow text-lg">{o.input}</p>
                  <div className="tooltip" data-tip="Remove unrelated chat">
                    <ActionIcon
                      radius="xl"
                      size="lg"
                      onClick={() => delChatPair(i, conversation.id)}
                      className="ml-0 opacity-0 group-hover:opacity-100"
                    >
                      <MdDelete size="20" className="text-red-700" />
                    </ActionIcon>
                  </div>
                </div>
                <Paper
                  radius="sm"
                  className="flex items-start gap-x-2 py-4 px-2"
                >
                  <Avatar radius="xl">
                    <BsRobot />
                  </Avatar>
                  {typeof o.message?.content === "string" && (
                    <Markdown content={o.message?.content} />
                  )}
                </Paper>
              </div>
            ))}
          </div>
          {status === "loading" && <SkeletonBlock />}
        </>
      ) : (
        <PromptTips />
      )}
    </section>
  );
};
