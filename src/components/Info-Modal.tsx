import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Modal,
  Accordion,
  Paper,
  Divider,
  Title,
  Anchor,
  Text,
} from "@mantine/core";
import * as React from "react";
import { BsInfoCircle } from "react-icons/bs";
import whatsnewContent from "../content/whatsnew.json";
import { HiBadgeCheck } from "react-icons/hi";
const list = [
  {
    q: "How it works?",
    a: "The web application is static and does not possess a backend server. Your API key is stored safely and locally on your browser once entered. The API requests are directly transmitted from your browser to the OpenAI server to communicate with ChatGPT. In a sense, it acts as an HTTP client for your ChatGPT API, but with several useful features.",
  },
  // {
  //   q: "How is the API key handled?",
  //   a: "The API you're using is secure and saved on your device. This is a fixed application, so it doesn't have a server-side component. All information is kept in the local storage of your browser, and requests to Open AI's API are sent straight from your current browser. You can verify this by checking the Network tab in your console.",
  // },
  {
    q: "Which model is used?",
    a: "gpt-3.5-turbo. according to OpenAI it is	most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.",
  },
];
//======================================
export const Faqs = () => {
  return (
    <section className="w-full">
      <Title order={3} className="mb-2 pl-1 text-left">
        FAQs
      </Title>
      <Accordion variant="separated">
        {list.map((o, i) => (
          <Accordion.Item value={o.q} key={i} className="">
            <Accordion.Control>{o.q}</Accordion.Control>
            <Accordion.Panel>{o.a}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
};

const features = [
  "Prompts history search",
  "Prompt library",
  "Favorite prompts",
  "create your own prompts for later use",
  "Store data on browser",
  "... and more soon",
];
interface WhatsnewProps {
  date: string;
  list: {
    title: string;
    description: string;
  }[];
}
//======================================
export const Whatsnew = ({ content }: { content: WhatsnewProps }) => {
  return (
    <div className="w-full">
      <Title order={3} className="mb-2">
        What{"'"}s new{" "}
      </Title>
      <Text color="dimmed" className="italic">
        Date: {content.date}
      </Text>
      <ul>
        {content.list.map((o, i) => (
          <li key={i} className="">
            <Text color="dimmed">
              <b>{o.title}:</b> {o.description}
            </Text>
          </li>
        ))}
      </ul>
      <Divider mt="sm" />
    </div>
  );
};

//======================================
export const InfoModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal.Root opened={opened} onClose={close} size="auto">
        <Modal.Overlay />
        <Modal.Content radius="lg">
          <Modal.Body>
            <Paper className="grid w-full max-w-xl place-items-start space-y-4 pb-4 pt-10">
              <Whatsnew content={whatsnewContent[0] as WhatsnewProps} />
              <Title order={3}>What you should expect</Title>
              <ul className="mb-4 grid grid-cols-1 gap-y-3 md:grid-cols-2">
                {features.map((st) => (
                  <li key={st} className="gap-x-2 flex-row-start">
                    <HiBadgeCheck size="20" />
                    {st}
                  </li>
                ))}
              </ul>
              <Divider mt="sm" />
              <Faqs />
              <div>
                <Text className="pt-3 text-center">
                  Do you have feedback? You can send me a DM on{" "}
                  <Anchor
                    href="https://twitter.com/AliHussein_20"
                    color="blue"
                    className="link"
                  >
                    Twitter
                  </Anchor>
                </Text>
              </div>
            </Paper>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Button
        variant="default"
        leftIcon={<BsInfoCircle size="17" />}
        onClick={open}
        className="w-full"
      >
        <Text>Info</Text>
      </Button>
    </>
  );
};
