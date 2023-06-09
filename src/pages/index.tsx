import { type NextPage } from "next";
import Head from "next/head";
import { Footer, Header, Hero } from "@/components";
import * as React from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NoorAI</title>
        <meta name="description" content="NoorAI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="flex min-h-screen flex-col">
          <Hero />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
