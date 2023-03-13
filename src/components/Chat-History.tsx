import { useStore } from "../hooks";
import { useRouter } from "next/router";
import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
import { MdClear, MdDelete, MdDriveFileRenameOutline } from "react-icons/md";
import { HiCheck } from "react-icons/hi2";

const ConversationLink = ({ id, name }: { id: string; name: string }) => {
  const { push, query } = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [input, setInput] = React.useState(name);
  const { renameConversation, deleteConversation, conversations } = useStore();

  return (
    <div
      className={clsx(
        "mx-w-fit group relative w-full cursor-pointer gap-3 overflow-hidden text-ellipsis rounded-sm px-1 py-3 text-lg  flex-row-between",
        !editing && "hover:pr-4",
        query.chatId === id && "bg-base-300 font-semibold"
      )}
    >
      {editing ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-base-content/30 w-10/12 border-b bg-transparent focus:outline-none"
          />
          <div className="flex items-center gap-x-3">
            {/* //------------------------------CONVERIM RENAMING BUTTON */}
            <button
              type="button"
              onClick={() => {
                renameConversation(id, input);
                setEditing(false);
              }}
              className="btn-xs btn"
            >
              {/* // save new name */}
              <HiCheck size="20" />
            </button>
            {/* //------------------------------CANCEL RENAMING BUTTON */}
            <button
              type="button"
              className="btn-xs btn "
              onClick={() => {
                setInput(name);
                setEditing(false);
              }}
            >
              <MdClear size="20" />
            </button>
          </div>
        </>
      ) : (
        <>
          <Link href={`/${id}`} className="w-full pl-1 capitalize">
            {input}
          </Link>
          <div className="flex gap-x-3">
            {/* //------------------------------RENAME BUTTON */}
            <button
              type="button"
              className="btn-xs btn hidden group-hover:block"
              onClick={() => setEditing((prev) => !prev)}
            >
              {/* // save new name */}
              <MdDriveFileRenameOutline size="20" />
            </button>
            {/* //------------------------------DELETE BUTTON */}
            <button
              type="button"
              className="btn-xs btn hidden group-hover:block"
              onClick={() => {
                deleteConversation(id);
                push(`/${conversations.at(-1)?.id || "chat"}`);
              }}
            >
              <MdDelete size="20" />
            </button>
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
      <div className="border-base-content/10 bg-base-200 focus-within:border-base-content/30 group mb-1 w-full gap-x-1 border-b p-2 flex-row-between">
        <input
          value={input}
          placeholder="Search prompts"
          className="w-full bg-transparent text-lg focus:outline-none"
          onChange={(e) => {
            setInput(e.target.value);
            filter(e.target.value);
          }}
        />
        {input && (
          <button
            onClick={() => setInput("")}
            type="button"
            className="focus:outline-none"
          >
            <MdClear size="20" />
          </button>
        )}
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
