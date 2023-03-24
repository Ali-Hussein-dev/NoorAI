import { Button } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useStore } from "~/hooks";
const Home: NextPage = () => {
  const conversations = useStore((state) => state.conversations);
  return (
    <>
      <Head>
        <title>Your ChatGPT</title>
        <meta name="description" content="Your ChatGPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid min-h-screen place-items-center">
        <div className="flex-col-center">
          <h1>Experimental Project</h1>
          <Link
            href={
              conversations?.[0]?.id ? `/${conversations?.[0].id}` : "/chat"
            }
          >
            <Button>Start chating</Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
