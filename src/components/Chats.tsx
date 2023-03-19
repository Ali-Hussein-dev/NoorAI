import { useStore, type ConversationT } from "~/hooks";
import { useRouter } from "next/router";
import {
  BsFillEmojiFrownFill,
  BsFillEmojiSmileFill,
  BsRobot,
} from "react-icons/bs";
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
  Drawer,
  Card,
  Divider,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import remarkGfm from "remark-gfm";
import { useDisclosure } from "@mantine/hooks";
import * as React from "react";
import clsx from "clsx";
import { HiArrowSmRight } from "react-icons/hi";

const list = [
  {
    title: "Start with a verb",
    description:
      "You don’t have to be polite, you can start with a verb explain, summarize …etc. Don't ask yes/no questions.",
    g: "Compare and contrast the advantages and disadvantages of studying abroad.",
    b: "I was wondering if you could maybe discuss the pros and cons of going to college in another country if that's okay with you? (not starting with a verb and using overly polite language)",
  },
  {
    title: "Be Specific & Clear",
    description:
      "Ask a well-defined question, avoid asking too many questions in one prompt & delete the questions that are not relevant to the whole conversation",
    g: "What are the best practices for creating a successful email marketing campaign?",
    b: "Can you tell me everything there is to know about digital marketing? Also, what's the best way to increase website traffic and how do I make sure my social media posts are effective? (grammatical error - should be 'were' instead of 'was')",
  },
  {
    title: "Proofread",
    description:
      "Before submitting, double-check your prompt to ensure that it is well-written and grammatically correct.",
    g: "Describe a time when you faced a difficult challenge and how you overcame it.",
    b: "Tell me about a time when you was doing something difficult.",
  },
  {
    title: "Provide Context",
    description:
      "Include not just relevant but more specific keywords that helps identify the context of what you are ask for. and avoid using broad keywords with broad meaning and context.",
    g: "What are the most effective ways to reduce stress and anxiety among college students during exams? (specific keywords - stress, anxiety, college students, exams)",
    b: "How can we improve mental health in society? (broad keywords with broad context - mental health, society)",
  },
  {
    title: "Few-shot",
    description:
      "Provide an Example of what you are expecting, This approach is very effective especially if you expect complex and unusual results and can save you a lot of time and typing.",
    g: "Based on the following format ..., write an article with same format about something",
    b: "Write an article about something",
  },
];
//======================================
export const PromptTips = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerChildren, setdrawerChildren] = React.useState(<div></div>);
  return (
    <div className="prose max-w-full">
      <Title
        order={2}
        className="mb-4 gap-2 text-2xl text-teal-300 flex-row-center"
      >
        <MdInfo size="30" />
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
        {list.map((o, i) => (
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
    <div className="prose w-full max-w-full pr-2 text-lg md:pr-12">
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
  const { query } = useRouter();
  const conversation = conversations.find(
    (o) => o.id === query.chatId
  ) as ConversationT;
  const thread = conversation?.thread || [];

  return (
    <section className="w-full py-10">
      {thread.length > 0 ? (
        <>
          <Title order={2} className="mb-3 text-center italic">
            Total Messages: {thread.length}
          </Title>
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
