import { create } from "zustand";
import { persist } from "zustand/middleware";
import models from "../content/models.json";

const systemInstruction =
  "Before you respond, follow these instructions:\n - Be concise with your answer,\n - Don't repeat what I say";

type Configs = {
  model: string;
  temperature: number;
  max_tokens: number;
};
interface ModelConfigsState {
  configs: Configs;
  systemInstruction: string;
  url: string;
  setConfigs: (configs: Partial<Configs>) => void;
  setSystemInstruction: (v: string) => void;
  setModel: (m: string) => void;
}
const localStorageKey = "noorai-model-configs";

export const useModelConfigs = create<ModelConfigsState>()(
  persist(
    (set) => {
      return {
        configs: {
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 250,
        },
        url: "api/openai",
        systemInstruction,
        setSystemInstruction: (systemInstruction) => set({ systemInstruction }),
        setConfigs: (configs) =>
          set((s) => ({ configs: { ...s.configs, ...configs } })),
        setModel: (model) =>
          set((s) => ({
            configs: { ...s.configs, model },
            url:
              models.find((m) => m.modelId === model)?.url || "model-not-found",
          })),
      };
    },
    {
      name: localStorageKey,
    }
  )
);
