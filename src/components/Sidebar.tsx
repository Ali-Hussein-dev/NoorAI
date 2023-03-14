import { BsMoonStarsFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useStore } from "../hooks";
import {
  ScrollArea,
  Button,
  ActionIcon,
  useMantineColorScheme,
  Tabs,
} from "@mantine/core";
import { FaSun } from "react-icons/fa";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { ApiKeyModal } from ".";
const ChatHistory = dynamic(() => import(".").then((a) => a.ChatHistory), {
  ssr: false,
});

export function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      size="lg"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <FaSun size="1.1rem" /> : <BsMoonStarsFill size="1.1rem" />}
    </ActionIcon>
  );
}
function PromptsTabs() {
  return (
    <Tabs defaultValue="1">
      <Tabs.List grow>
        <Tabs.Tab value="1" icon={<AiOutlineHistory />}>
          History
        </Tabs.Tab>
        <Tabs.Tab value="2" icon={<HiOutlineRectangleStack />}>
          Libray
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="1">
        {" "}
        <ScrollArea className="h-full max-h-[75vh] pt-2">
          <ChatHistory />
        </ScrollArea>
      </Tabs.Panel>
      <Tabs.Panel value="2">
        <ScrollArea className="h-full max-h-[75vh] pt-2">
          <p className="pt-2 text-center">Coming soon...</p>
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}
//======================================
export const Sidebar = () => {
  const createConversation = useStore((s) => s.createConversation);
  const { push } = useRouter();

  return (
    <div className="h-full w-full gap-y-2 flex-col-center">
      <div className="h-full w-full space-y-2">
        <Button
          variant="default"
          color="gray"
          // size="md"
          type="button"
          onClick={() => {
            const id = crypto.randomUUID();
            createConversation(id);
            push(`/${id}`);
          }}
          className="w-full"
        >
          <BsPlus size="18" />
          <span>New Chat</span>
        </Button>
        <PromptsTabs />
      </div>
      <div className="sticky bottom-0 w-full gap-2 border-t border-neutral-500 pb-2 pt-3 flex-row-center">
        <ToggleTheme />
        <ApiKeyModal />
      </div>
    </div>
  );
};
