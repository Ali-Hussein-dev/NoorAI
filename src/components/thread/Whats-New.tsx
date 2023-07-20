import { Divider, Text, Button, Title } from "@mantine/core";
import * as React from "react";
import { BsGithub, BsTwitter } from "react-icons/bs";
import { useStoreCtx } from "@/context/store-ctx";

const cta = [
  {
    label: "Follow on Twitter",
    href: "https://twitter.com/NoorAI_APP",
    icon: <BsTwitter size="15" />,
  },
  {
    label: "Support on GitHub",
    href: "https://github.com/Ali-Hussein-dev/NoorAI",
    icon: <BsGithub size="15" />,
  },
  {
    label: "Suggest a feature",
    href: "https://twitter.com/NoorAI_APP",
    icon: undefined,
  },
];
//======================================
export const CallToActions = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      {cta.map((o, i) => (
        <a key={i} href={o.href} target="_blank">
          <Button key={i} leftIcon={o.icon} variant="default" size="sm">
            {o.label}
          </Button>
        </a>
      ))}
    </div>
  );
};
//======================================
export const Whatsnew = () => {
  const store = useStoreCtx();
  return store.whatsnew?.length || 0 > 0 ? (
    <div className="w-full">
      <Title order={2} mb="sm">
        What{"'"}s New
      </Title>
      <div className="space-y-3">
        {store.whatsnew?.map((o, i) => (
          <div key={i}>
            <div className="flex-row-between">
              <Text size="lg" fw="700">
                {o.title}
              </Text>
            </div>
            <Text size="lg" color="dimmed">
              {o.description}
            </Text>
          </div>
        ))}
      </div>
      <Divider my="sm" />
      <CallToActions />
    </div>
  ) : null;
};
