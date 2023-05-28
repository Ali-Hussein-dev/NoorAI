import Head from "next/head";
import clsx from "clsx";
import {
  AppShell,
  Navbar,
  useMantineTheme,
  Paper,
  TypographyStylesProvider,
} from "@mantine/core";
import * as React from "react";
import { useRouter } from "next/router";
import { useStore } from "../hooks";
import { Header, PromptArea, Sidebar } from "@/components";
import { useDidUpdate } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { useFetchFormCtx, FormProv } from "@/hooks";
import { appRouter } from "@/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { StoreCtxProv, type StoreCtxT } from "@/context/store-ctx";

const Chats = dynamic(() => import("../components").then((c) => c.Chats), {
  ssr: false,
});

//======================================
const ChatPage = (props: StoreCtxT) => {
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
      <TypographyStylesProvider>
        <FormProv {...methods}>
          <StoreCtxProv value={props}>
            <AppShell
              padding={0}
              navbar={
                <Navbar
                  py={0}
                  px={6}
                  hiddenBreakpoint="sm"
                  hidden={!opened}
                  width={{ sm: 280, lg: 300 }}
                  bg={
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.colors.gray[2]
                  }
                  color={
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[2]
                      : theme.colors.gray[6]
                  }
                  styles={{}}
                  withBorder={false}
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
          </StoreCtxProv>
        </FormProv>
      </TypographyStylesProvider>
    </>
  );
};
export default ChatPage;

export const getStaticProps = async ({}) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { session: null },
  });
  const tags = await ssg.prompts.tags.fetch();
  const whatsnew = await ssg.main.whatsnew.fetch();

  return {
    props: {
      tags: tags,
      whatsnew: whatsnew || null,
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};
