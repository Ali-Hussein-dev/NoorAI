import dynamic from "next/dynamic";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { TiStarOutline } from "react-icons/ti";
import { InfoModal } from "..";
import { ScrollArea, Tabs } from "@mantine/core";
import { PromptsLib } from "./Prompts-Lib";

const MarkedPrompts = dynamic(
  () => import("./Marked-Prompts").then((a) => a.MarkedPrompts),
  { ssr: false }
);
const ChatHistory = dynamic(() => import("..").then((a) => a.ChatHistory), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center text-xl">
      Loading...
    </div>
  ),
});

function PromptsTabs() {
  return (
    <Tabs defaultValue="1">
      <Tabs.List grow>
        {[
          { icon: <AiOutlineHistory />, label: "History" },
          { icon: <HiOutlineRectangleStack />, label: "Library" },
          { icon: <TiStarOutline />, label: "Saved" },
        ].map((tab, i) => (
          <Tabs.Tab key={i} value={`${i + 1}`} icon={tab.icon}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      <Tabs.Panel value="1" className="pt-2">
        <ScrollArea scrollHideDelay={50} h="70vh" className="pt-1">
          <ChatHistory />
        </ScrollArea>
      </Tabs.Panel>
      <Tabs.Panel value="2" className="pt-2">
        <PromptsLib />
      </Tabs.Panel>
      <Tabs.Panel value="3" className="pt-2">
        <ScrollArea h="70vh" scrollHideDelay={50} className="pt-1">
          <MarkedPrompts />
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}
//======================================
export const Sidebar = () => {
  return (
    <div className="h-full w-full gap-y-2 flex-col-center">
      <div className="w-full grow space-y-2">
        <PromptsTabs />
      </div>
      <div className="sticky bottom-0 w-full gap-2 border-t border-neutral-600 pb-2 pt-3 flex-row-center">
        {/* <OpenaiConfig /> */}
        <InfoModal />
      </div>
    </div>
  );
};
