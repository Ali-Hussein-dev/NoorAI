import { create } from "zustand";
import { persist } from "zustand/middleware";

const systemInstruction =
  "Before you response, follow these instructions:\n - Be concise with your answer\n, - Don't repeat what I say\n";

type Configs = {
  model: string;
  temperature: number;
  maxLength: number;
};
interface ModelConfigsState {
  configs: Configs;
  systemInstruction: string;
  setConfigs: (configs: Partial<Configs>) => void;
  setSystemInstruction: (v: string) => void;
}
const localStorageKey = "noorai-model-configs";

export const useModelConfigs = create<ModelConfigsState>()(
  persist(
    (set) => {
      return {
        configs: {
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          maxLength: 250,
        },
        systemInstruction,
        setSystemInstruction: (systemInstruction) => set({ systemInstruction }),
        setConfigs: (configs) =>
          set((s) => ({ configs: { ...s.configs, ...configs } })),
      };
    },
    {
      name: localStorageKey,
    }
  )
);
