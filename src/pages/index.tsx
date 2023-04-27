import { AppShell, Button } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useStore } from "@/hooks";
import { Footer, Header } from "@/components";
import * as React from "react";
const Home: NextPage = () => {
  const conversations = useStore((state) => state.conversations);
  const [opened, setOpened] = React.useState(false);

  return (
    <>
      <Head>
        <title>NoorAI</title>
        <meta name="description" content="NoorAI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        footer={<Footer />}
        header={<Header opened={opened} setOpened={setOpened} />}
      >
        <main className="grid min-h-screen place-items-center">
          <div className="pb-32 flex-col-center">
            {/* <h1 className="font-extrabold text-5xl">Intuitive UI to ChatGPT</h1> */}
            <Link
              href={
                conversations?.[0]?.id ? `/${conversations?.[0].id}` : "/chat"
              }
            >
              <Button size="lg">Start chating</Button>
            </Link>
          </div>
        </main>
      </AppShell>
    </>
  );
};

export default Home;
