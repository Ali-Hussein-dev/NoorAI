import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
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
          <Link href="/chat">start chating..</Link>
        </div>
      </main>
    </>
  );
};

export default Home;
