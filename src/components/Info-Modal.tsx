import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Modal,
  Accordion,
  Paper,
  Divider,
  Title,
  Text,
} from "@mantine/core";
import * as React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
const list = [
  {
    q: "How it works?",
    a: "The web application is static and does not possess a backend server. Your API key is stored safely and locally on your browser once entered. The API requests are directly transmitted from your browser to the OpenAI server to communicate with ChatGPT. In a sense, it acts as an HTTP client for your ChatGPT API, but with several useful features.",
  },
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
  "Top user experience",
  "Prompts history search",
  "Growing prompts library",
  "Favorite prompts",
  "Store data on browser",
  "... and more soon",
];

//======================================
export const InfoModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal.Root opened={opened} onClose={close} size="lg">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <Paper className="mx-auto grid w-full max-w-2xl place-items-start space-y-4 pb-4 pt-10">
              <Title order={3}>Why NoorAI?</Title>
              <ul className="mb-4 grid w-full grid-cols-1 gap-y-3 md:grid-cols-2">
                {features.map((st) => (
                  <li key={st} className="gap-x-2 flex-row-start">
                    <HiBadgeCheck size="20" />
                    {st}
                  </li>
                ))}
              </ul>
              <Divider mt="sm" />
              <Faqs />
            </Paper>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Button
        variant="default"
        leftIcon={<BsInfoCircle size="17" />}
        onClick={open}
        className="w-full shadow"
      >
        <Text>Info</Text>
      </Button>
    </>
  );
};
