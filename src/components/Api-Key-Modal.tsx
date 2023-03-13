import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Modal,
  Accordion,
  PasswordInput,
  Paper,
  Badge,
  Title,
  Anchor,
  Text,
} from "@mantine/core";
import * as React from "react";
import { useStore } from "../hooks";
import { HiBadgeCheck } from "react-icons/hi";

const list = [
  {
    q: "How it works?",
    a: "The web application is static and does not possess a backend server. Your API key is stored safely and locally on your browser once entered. The API requests are directly transmitted from your browser to the OpenAI server to communicate with ChatGPT. In a sense, it acts as an HTTP client for your ChatGPT API, but with several useful features.",
  },
  {
    q: "How is the API key handled?",
    a: "The API you're using is secure and saved on your device. This is a fixed application, so it doesn't have a server-side component. All information is kept in the local storage of your browser, and requests to Open AI's API are sent straight from your current browser. You can verify this by checking the Network tab in your console.",
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
  "Prompts History Search",
  "Intuitive user interface",
  "Use your own API key",
  "Store data locally on browser",
  "No login required",
  "... and more soon",
];
//======================================
export const ApiKeyModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const saveApiKey = useStore((s) => s.saveApiKey);
  const apiKey = useStore((s) => s.apiKey);
  const [form, setForm] = React.useState({
    input: apiKey,
    submitted: false,
  });
  return (
    <>
      <Modal.Root opened={opened} onClose={close} size="auto">
        <Modal.Overlay />
        <Modal.Content className="" radius="lg">
          <Modal.Body>
            <Paper className="grid w-full max-w-xl place-items-center space-y-4 pb-4 pt-10">
              <Title order={1}>
                Your ChatGPT <Badge color="gray">beta</Badge>
              </Title>
              <ul className="mb-4 grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-8">
                {features.map((st) => (
                  <li key={st} className="gap-x-2 text-xl flex-row-start">
                    <HiBadgeCheck size="24" />
                    {st}
                  </li>
                ))}
              </ul>
              <div className="w-full gap-2 flex-col-start ">
                <div className="flex w-full items-end justify-between gap-1">
                  <PasswordInput
                    type="password"
                    variant="filled"
                    value={form.input}
                    onChange={(e) => {
                      setForm({ submitted: false, input: e.target.value });
                    }}
                    placeholder="Your API key"
                    className="input w-full"
                    description=" API is required to use the app"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setForm((prv) => ({ ...prv, submitted: true }));
                      saveApiKey(form.input);
                    }}
                    className="btn normal-case"
                  >
                    {form.submitted ? "Saved" : "save"}
                  </Button>
                </div>
                <Anchor
                  href="https://platform.openai.com/account/api-keys"
                  className="link px-1"
                  target="_blank"
                >
                  Get API key from OpenAI
                </Anchor>
              </div>
              <Faqs />
              <div>
                <Text className="pt-3 text-center">
                  Do you have feedback? You can send a DM on{" "}
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
        onClick={open}
        className="btn mx-auto w-full rounded bg-transparent normal-case"
      >
        Add Your API Key
      </Button>
    </>
  );
};
