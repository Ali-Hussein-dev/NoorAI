import Head from "next/head";
import clsx from "clsx";
import {
  MediaQuery,
  AppShell,
  Navbar,
  Header,
  Burger,
  useMantineTheme,
  Paper,
} from "@mantine/core";
import * as React from "react";
import { Chats, PromptArea, Sidebar } from "~/components";
import { useRouter } from "next/router";
import { useStore } from "../hooks";

//======================================
const ChatPage = () => {
  const [opened, setOpened] = React.useState(false);
  const theme = useMantineTheme();
  const { query, push } = useRouter();
  const conversations = useStore((s) => s.conversations);
  React.useEffect(() => {
    const hasId = conversations.some((con) => con.id === query.chatId);
    if (!hasId) {
      push(`/${conversations[0]?.id || "chat"}`);
    }
  }, [conversations, push, query.chatId]);
  return (
    <>
      <Head>
        <title>{"Chat Page"}</title>
      </Head>
      <AppShell
        padding={0}
        pt={36}
        px={0}
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[2],
            // color:
            //   theme.colorScheme === "dark"
            //     ? theme.colors.dark[2]
            //     : theme.colors.gray[5],
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
        header={
          <Header height={{ base: 60 }} p="md">
            <div className="flex-row-start">
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  mr="xl"
                />
              </MediaQuery>
              {/* <HeaderContent /> */}
            </div>
          </Header>
        }
      >
        {/* Content */}
        <div className="flex h-full w-full flex-col px-2 md:px-0">
          <div className="mx-auto w-full max-w-3xl grow ">
            <Chats />
          </div>
          <Paper
            p={0}
            radius={0}
            className={clsx(
              "sticky bottom-0 flex h-14 w-full items-start justify-center backdrop-blur-sm md:h-20",
              theme.colorScheme === "dark"
                ? "bg-[#101113]/40"
                : `bg-[#E9ECEF]/30`
            )}
          >
            <PromptArea />
          </Paper>
        </div>
      </AppShell>
    </>
  );
};
export default ChatPage;
