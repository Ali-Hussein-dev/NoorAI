import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { ChatCompletionResponseMessage } from "openai";
import { type FetchStatus, type QueryStatus } from "@tanstack/react-query";
import type languages from "../content/languages.json";

/**
 **Request
 * [{role,content(prompt)}]
 *
 **Response
 * [{message:{content:string, role}}]
 *
 **Store
 * thread: [{input,content,role}]
 *
 **UI
 *
 *
 */

export interface ChatPairT {
  /**
   * @description user prompt
   *
   */
  input: string;
  /**
   * @description
   * content string,
   * role "user"| "assistent" | "system"
   */
  message?: ChatCompletionResponseMessage;
}

export interface ConversationT {
  id: string | string;
  name?: string;
  createdAt: number;
  thread: ChatPairT[];
}

export type ConversationsT = ConversationT[];
// const langCodes= Object.values(languages) as const;
type ValueOf<T> = T[keyof T];
type LangCodeT = ValueOf<typeof languages>;
// type LangCodeT = (typeof languages)[keyof typeof languages];

export interface StoreStateT {
  id: number;
  filtered: ConversationsT | never[];
  conversations: ConversationsT;
  // model: OpenaiModelsT;
  // setModel: (model: OpenaiModelsT) => void;
  /**
   * @required
   */
  status: QueryStatus | FetchStatus;
  updateStatus: (s: QueryStatus | FetchStatus) => void;
  // Whisper configs
  whisperLang: LangCodeT;
  setWhisperLang: (lang: LangCodeT) => void;
  recordingMode: "transcriptions" | "translations";
  setRecordingMode: (mode: "transcriptions" | "translations") => void;
  //------------------------------
  /**
   * @required push
   * @params id: conversation id from router
   * @param chatPair { input: string, response: {text:string}[] }
   */
  push: (id: number | string, chatPair: ChatPairT, threadIndex: number) => void;
  /**
   * @required
   * create an empty conversation when creating a new chat (new chat button)
   */
  createConversation: (id: string) => void;
  /**
   * @required
   */
  deleteConversation: (id: string) => void;
  /**
   * @required search for prompts in conversations
   *
   */
  //  search: () => void;
  renameConversation: (id: string, name: string) => void;
  /**
   * @required filter prompts
   */
  filter: (input: string) => void;
  /**
   * @required
   *
   */
  delChatPair: (index: number, conversationId: string) => void;
}

const localStorageKey = "yourchatgpt";

export const useStore = create<StoreStateT>()(
  devtools(
    persist(
      (set) => {
        return {
          id: new Date().getTime(),
          status: "idle",
          filtered: [],
          conversations: [
            {
              id: "chat",
              name: "First Chat",
              thread: [],
              createdAt: new Date().getTime(),
            },
          ],
          whisperLang: "en",
          setWhisperLang: (lang) =>
            set(() => ({ whisperLang: lang }), false, "setWhisperLang"),
          recordingMode: "transcriptions",
          setRecordingMode: (mode) =>
            set(() => ({ recordingMode: mode }), false, "setRecordingMode"),
          push: (id, chatPair, threadIndex) => {
            return set(
              (state) => {
                const { conversations } = state;

                const index = state.conversations.findIndex((o) => o.id === id);

                if (index >= -1) {
                  const thread = conversations[index]?.thread;
                  const currentChatpair = thread?.[threadIndex];

                  const meregedChatPair = {
                    ...chatPair,
                    message: {
                      content:
                        (currentChatpair?.message?.content || "") +
                          chatPair.message?.content || "",
                      role: chatPair?.message?.role || "user",
                    },
                  };
                  (thread || [])[threadIndex] = meregedChatPair;
                } else {
                  console.warn("push action: index is not found", {
                    index,
                    conversationId: id,
                  });
                }

                return {
                  ...state,
                  conversations,
                } as StoreStateT;
              },
              false,
              "push"
            );
          },
          createConversation: (id) =>
            set(
              (s) =>
                ({
                  conversations: [
                    {
                      id,
                      created: new Date().getTime(),
                      thread: [],
                    },
                    ...s.conversations,
                  ],
                } as StoreStateT),
              false,
              "createConversation"
            ),
          deleteConversation: (id) =>
            set(
              (s) => {
                const { conversations } = s;
                const index = conversations.findIndex((o) => o.id === id);
                if (index > -1) {
                  conversations.splice(index, 1);
                }
                return s;
              },
              false,
              "deleteConversation"
            ),
          renameConversation: (id, name) =>
            set(
              (s) => {
                const { conversations } = s;
                const index = conversations.findIndex((o) => o.id === id);
                if (index > -1) {
                  const conversation = {
                    ...conversations[index],
                    name,
                  } as ConversationT;
                  console.log(index);
                  conversations.splice(index, 1, conversation);
                }
                return { conversations };
              },
              false,
              "renameConversation"
            ),
          filter: (input) =>
            set((s) => {
              const { conversations } = s;
              const filtered = [];
              const lowerCaseInput = input.toLowerCase();
              for (const con of conversations) {
                if (con.name?.toLowerCase().includes(lowerCaseInput)) {
                  filtered.push(con);
                } else {
                  const hasInput = con.thread.some((chatPair) =>
                    chatPair.input.toLowerCase().includes(lowerCaseInput)
                  );
                  if (hasInput) {
                    filtered.push(con);
                  }
                }
              }
              return { filtered };
            }),
          updateStatus: (status) => set(() => ({ status: status })),
          delChatPair: (index, conversationId) =>
            set((s) => {
              const { conversations } = s;
              const conversation = conversations.find(
                (o) => o.id === conversationId
              );
              conversation?.thread.splice(index, 1);
              return {
                ...s,
              };
            }),
        };
      },
      { name: localStorageKey, storage: createJSONStorage(() => localStorage) }
    ),
    { enabled: false }
  )
);
