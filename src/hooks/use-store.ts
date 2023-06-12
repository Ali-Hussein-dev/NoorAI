import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
} from "openai";
import { type FetchStatus, type QueryStatus } from "@tanstack/react-query";
// import type languages from "../content/languages.json";
import { type HTMLContent } from "@tiptap/react";

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
type TemplateT = {
  role: "system";
  content: string;
  htmlContent?: HTMLContent;
};
export interface ConversationT {
  id: string | string;
  name?: string;
  createdAt: number;
  thread: ChatPairT[];
  template?: TemplateT;
}

export type ConversationsT = ConversationT[];
// const langCodes= Object.values(languages) as const;
// type ValueOf<T> = T[keyof T];
// type LangCodeT = ValueOf<typeof languages>;
// type LangCodeT = (typeof languages)[keyof typeof languages];
//------------------------------------------------------------Store-state
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
  // whisperLang: LangCodeT;
  // setWhisperLang: (lang: LangCodeT) => void;
  // recordingMode: "transcriptions" | "translations";
  // setRecordingMode: (mode: "transcriptions" | "translations") => void;
  //------------------------------
  // configs
  /**
   * @required push
   * @params id: conversation id from router
   * @param chatPair { input: string, response: {text:string}[] }
   */
  push: (params: {
    threadIndex: number;
    conversationIndex: number;
    role: ChatCompletionResponseMessageRoleEnum;
    chunkValue: string;
    input: string;
  }) => void;
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
   * @required filter prompts (search history)
   */
  filter: (input: string) => void;
  /**
   * @required
   *
   */
  delChatPair: (index: number, conversationId: string) => void;
  /**
   * used for regenerating last response
   */
  dropLastTheardElement: (conversationsId: string) => void;
  /**
   * used for editing prompts
   */
  sliceThread: (index: number, conversationId: string) => void;
  /**
   * @param conversationId
   * @param template template content
   */
  setTemplate: (
    conversationId: string,
    template: Omit<TemplateT, "role">
  ) => void;
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
              name: "Chat Title",
              thread: [],
              createdAt: new Date().getTime(),
            },
            {
              id: "template",
              name: "Dictionary template",
              thread: [],
              createdAt: new Date().getTime(),
              template: {
                role: "system",
                content:
                  "Act as dictionary, explain the following, give 2 examples and 2 synonyms.",
              },
            },
          ],
          // whisperLang: "en",
          // setWhisperLang: (lang) =>
          //   set(() => ({ whisperLang: lang }), false, "setWhisperLang"),
          // recordingMode: "transcriptions",
          // setRecordingMode: (mode) =>
          //   set(() => ({ recordingMode: mode }), false, "setRecordingMode"),
          //-------------------------------------------------------set-template
          setTemplate: (conversationId, content) => {
            return set((s) => {
              const { conversations } = s;
              const index = conversations.findIndex(
                (o) => o.id === conversationId
              );
              const conversation = conversations[index] as ConversationT;

              if (index >= -1) {
                const prvTemplate = conversations[index]?.template || {
                  role: "system",
                  content: "",
                };
                conversations[index] = {
                  ...conversation,
                  template: {
                    ...prvTemplate,
                    ...content,
                  },
                };
              }
              return {
                conversations,
              };
            });
          },
          //-------------------------------------------------------push
          push: ({
            threadIndex,
            conversationIndex,
            chunkValue,
            input,
            role,
          }) => {
            return set(
              (state) => {
                const conversations = state.conversations;
                const thread =
                  state.conversations[conversationIndex]?.thread || [];
                const currentContent =
                  thread[threadIndex]?.message?.content || "";
                const meregedChatPair = {
                  input,
                  message: {
                    content: currentContent + chunkValue,
                    role,
                  },
                };
                (thread || [])[threadIndex] = meregedChatPair;

                return {
                  ...state,
                  conversations,
                } as StoreStateT;
              },
              false,
              "push"
            );
          },
          //-------------------------------------------------------create-conversation
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
          //-------------------------------------------------------delete-conversation
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
          //-------------------------------------------------------rename-conversation
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
          //-------------------------------------------------------slice-thread
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
          //-------------------------------------------------------update-status
          updateStatus: (status) => set(() => ({ status: status })),
          //-------------------------------------------------------del-chat-pair
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
          //-------------------------------------------------------drop-last-chat-pair
          dropLastTheardElement: (id) =>
            set(
              (s) => {
                const { conversations } = s;
                const con = conversations.find((o) => o.id == id);
                con?.thread.pop();
                return s;
              },
              false,
              "regenerate"
            ),
          //-------------------------------------------------------slice-thread
          sliceThread: (index, conversationId) =>
            set(
              (s) => {
                const { conversations } = s;
                const conversation = conversations.find(
                  (o) => o.id === conversationId
                );
                if (conversation) {
                  const thread = conversation.thread;
                  conversation.thread = thread.slice(0, index);
                }
                return s;
              },
              false,
              "spliceThread"
            ),
        };
      },
      { name: localStorageKey, storage: createJSONStorage(() => localStorage) }
    ),
    { enabled: false }
  )
);
