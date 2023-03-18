import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

type TagT = { name: string };
interface PromptT {
  id: string;
  text: string;
  tags: TagT[];
}
interface StoreMarkedPromptsT {
  list: PromptT[];
  drop: (id: string) => void;
  push: (prompt: PromptT) => void;
  create: (prompt: string, tags: TagT[]) => void;
  //   edit: (id: string, text: string, tags: string[]) => void;
}

export const useMarkedPrompts = create<StoreMarkedPromptsT>()(
  devtools(
    persist(
      (set) => {
        return {
          list: [],
          drop: (id) =>
            set(
              (s) => {
                const { list } = s;
                const index = list.findIndex((o) => o.id === id);
                return {
                  list: [...list.slice(0, index), ...list.slice(index + 1)],
                };
              },
              false,
              "edit drop prompt"
            ),
          push: (prompt) =>
            set((s) => ({ list: [...s.list, prompt] }), false, "push prompt"),
          create: (prompt, tags) =>
            set(
              (s) => {
                const userPrompt: PromptT = {
                  id: new Date().getTime().toString(),
                  text: prompt,
                  tags,
                };
                return { list: [userPrompt, ...s.list] };
              },
              false,
              "Create prompt"
            ),
          //   edit: (id) => set((s) => ({}), false, "edit marked prompt"),
        };
      },
      { name: "markedPrompts", storage: createJSONStorage(() => localStorage) }
    ),
    {}
  )
);
