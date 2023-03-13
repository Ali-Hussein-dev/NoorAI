import { BsMoonStarsFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useStore } from "../hooks";
import {
  ScrollArea,
  Button,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { FaSun } from "react-icons/fa";
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
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <FaSun size="1.1rem" /> : <BsMoonStarsFill size="1.1rem" />}
    </ActionIcon>
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
          variant="outline"
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
        <ScrollArea className="h-full max-h-[75vh] pt-2">
          <ChatHistory />
        </ScrollArea>
      </div>
      <div className="sticky bottom-0 w-full border-t border-neutral-700 pb-2 pt-3 flex-row-center">
        <ApiKeyModal />
      </div>
      {/* <ToggleTheme /> */}
    </div>
  );
};
