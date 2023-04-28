import Head from "next/head";
import clsx from "clsx";
import { AppShell, Navbar, useMantineTheme, Paper } from "@mantine/core";
import * as React from "react";
import { useRouter } from "next/router";
import { useStore } from "../hooks";
import { Header, PromptArea, Sidebar } from "@/components";
import { useDidUpdate } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { useFetchFormCtx, FormProv } from "@/hooks";

const Chats = dynamic(() => import("../components").then((c) => c.Chats), {
  ssr: false,
});

//======================================
const ChatPage = () => {
  const [opened, setOpened] = React.useState(false);
  const theme = useMantineTheme();
  const { query, push } = useRouter();
  const conversations = useStore((s) => s.conversations);
  useDidUpdate(() => {
    const hasId = conversations.some((con) => con.id === query.chatId);
    if (!hasId) {
      push(`/${conversations[0]?.id || "chat"}`);
    }
  }, [conversations, push, query.chatId]);
  const methods = useFetchFormCtx();
  return (
    <>
      <Head>
        <title>{"Chat Page"}</title>
      </Head>
      <FormProv {...methods}>
        <AppShell
          padding={0}
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[9]
                  : theme.colors.gray[2],
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[2]
                  : theme.colors.gray[6],
            },
          }}
          navbar={
            <Navbar
              py="md"
              px={6}
              hiddenBreakpoint="sm"
              hidden={!opened}
              width={{ sm: 200, lg: 300 }}
              className=""
            >
              <Sidebar />
            </Navbar>
          }
          footer={undefined}
          header={<Header opened={opened} setOpened={setOpened} />}
        >
          {/* Content */}
          <div className="flex h-full w-full flex-col px-2 md:px-4">
            <div className="mx-auto w-full max-w-3xl grow">
              <React.Suspense fallback={<div>Loading...</div>}>
                <Chats />
              </React.Suspense>
            </div>
            <Paper
              p={0}
              radius={0}
              className={clsx(
                "sticky bottom-0 z-10 flex w-full items-start justify-center backdrop-blur-sm",
                theme.colorScheme === "dark"
                  ? "bg-[#101113]/40"
                  : `bg-[#E9ECEF]/30`
              )}
            >
              <PromptArea />
            </Paper>
          </div>
        </AppShell>
      </FormProv>
    </>
  );
};
export default ChatPage;
