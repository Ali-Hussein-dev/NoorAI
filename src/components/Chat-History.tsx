import { useStore } from "../hooks";
import { useRouter } from "next/router";
import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  MdClear,
  MdDelete,
  MdDriveFileRenameOutline,
  MdSearch,
} from "react-icons/md";
import { HiCheck } from "react-icons/hi2";
import { useMantineTheme, ActionIcon, Text, TextInput } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

const ConversationLink = ({ id, name }: { id: string; name: string }) => {
  const { push, query } = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [input, setInput] = React.useState(name);
  const { renameConversation, deleteConversation, conversations } = useStore();
  const theme = useColorScheme();
  const { colors } = useMantineTheme();
  return (
    <div
      className={clsx(
        "mx-w-fit group relative w-full cursor-pointer gap-2 rounded-sm py-2 text-lg flex-row-between ",
        query.chatId === id && "bg-zinc-700/20"
      )}
    >
      {editing ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-10/12 border-b bg-transparent focus:outline-none"
          />
          <div className="flex items-center gap-x-3">
            {/* //------------------------------CONVERIM RENAMING BUTTON */}
            <ActionIcon
              onClick={() => {
                renameConversation(id, input);
                setEditing(false);
              }}
            >
              {/* // save new name */}
              <HiCheck size="20" />
            </ActionIcon>
            {/* //------------------------------CANCEL RENAMING BUTTON */}
            <ActionIcon
              onClick={() => {
                setInput(name);
                setEditing(false);
              }}
            >
              <MdClear size="20" />
            </ActionIcon>
          </div>
        </>
      ) : (
        <>
          <Link href={`/${id}`} className="w-full pl-1 capitalize">
            <Text
              c={theme === "dark" ? colors.gray[6] : colors.gray[7]}
              truncate="end"
            >
              {input.split(" ").splice(0, 5).join(" ")}{" "}
              {/* {input.split(" ").length > 4 ? "..." : ""} */}
            </Text>
          </Link>
          <div className="flex gap-x-3">
            {/* //------------------------------RENAME BUTTON */}
            <ActionIcon
              className="hidden group-hover:block"
              onClick={() => setEditing((prev) => !prev)}
            >
              {/* // save new name */}
              <MdDriveFileRenameOutline size="20" />
            </ActionIcon>
            {/* //------------------------------DELETE BUTTON */}
            <ActionIcon
              className="hidden group-hover:block"
              onClick={() => {
                deleteConversation(id);
                if (id === query.chatId) {
                  push(`/${conversations.at(-1)?.id || "chat"}`);
                } else {
                  push(`/${query.chatId}`);
                }
              }}
            >
              <MdDelete size="20" />
            </ActionIcon>
          </div>
        </>
      )}
    </div>
  );
};
//---------------------------------------------------
export const ChatHistory = () => {
  const conversations = useStore((s) => s.conversations);
  const filter = useStore((s) => s.filter);
  const filtered = useStore((s) => s.filtered);
  const [input, setInput] = React.useState("");
  const list = input ? filtered : conversations;
  return (
    <div className="h-full grow">
      <div className="group mb-1 w-full gap-x-1 flex-row-between">
        <TextInput
          value={input}
          placeholder="Search prompts history"
          className="w-full"
          onChange={(e) => {
            setInput(e.target.value);
            filter(e.target.value);
          }}
          icon={<MdSearch size="20" />}
          rightSection={
            input ? (
              <ActionIcon onClick={() => setInput("")} size="md">
                <MdClear size="20" />
              </ActionIcon>
            ) : undefined
          }
        />
      </div>
      <div className="w-full">
        {list.map(({ id, name = null, thread }, i: number) => (
          <ConversationLink
            key={i}
            id={id}
            name={name || thread?.[0]?.input || "new chat"}
          />
        ))}
      </div>
    </div>
  );
};
