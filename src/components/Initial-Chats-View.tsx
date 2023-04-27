import { Divider, Text, Paper, Button } from "@mantine/core";
import * as React from "react";
import { BsGithub, BsTwitter } from "react-icons/bs";
import { api } from "@/utils";

const cta = [
  {
    label: "Follow on Twitter",
    href: "https://twitter.com/noorai_io",
    icon: <BsTwitter size="15" />,
  },
  {
    label: "Support on GitHub",
    href: "https://github.com/Ali-Hussein-dev/NoorAI",
    icon: <BsGithub size="15" />,
  },
  {
    label: "Suggest a feature",
    href: "https://twitter.com/noorai_io",
    icon: undefined,
  },
];
//======================================
export const CallToActions = () => {
  return (
    <div className="gap-2 flex-row-start">
      {cta.map((o, i) => (
        <a key={i} href={o.href} target="_blank">
          <Button key={i} leftIcon={o.icon} variant="default">
            {o.label}
          </Button>
        </a>
      ))}
    </div>
  );
};
//======================================
export const Whatsnew = () => {
  const { data } = api.main.whatsnew.useQuery(undefined, {});
  return data ? (
    <Paper p="md" className="w-full">
      <div className="mb-3">
        <h2 className="m-0 font-bold ">What{"'"}s new</h2>
      </div>
      <div className="space-y-3">
        {data.map((o, i) => (
          <div key={i} className="">
            <div className="flex-row-between">
              <Text size="lg">
                <b>{o.title}</b>
              </Text>
            </div>
            <Text color="dimmed" size="lg">
              {o.description}
            </Text>
          </div>
        ))}
      </div>
      {/* <Divider my="sm" />
      <div>
        <Text size="lg">
          <b>+100 prompts in library</b>
        </Text>
      </div> */}
      <Divider my="sm" />
      <CallToActions />
    </Paper>
  ) : null;
};
//======================================
export const InitialChatsView = () => {
  return (
    <div className="pb-12 pt-8">
      <Whatsnew />
    </div>
  );
};
