import { create } from "zustand";
import { devtools } from "zustand/middleware";
import promptBlocks from "../content/prompt-blocks.json";
type Item =
  | {
      value: string;
      label: string;
    }
  | string;
type blockstypeT =
  | "actions"
  | "tones"
  | "roles"
  | "outputs"
  | "audience"
  | "maxWords";
const sort = (item1: { label: string }, item2: { label: string }) =>
  item1.label < item2.label ? -1 : item1.label > item2.label ? 1 : 0;
type StorePromptBuilderT = {
  promptBlocks: {
    start: string;
    actions?: string;
    tones?: string[];
    audience?: string;
    roles?: string;
    outputs?: string;
    maxWords?: string;
  };
  prompt: string;
  setPrompt: (block: string | string[], type: blockstypeT) => void;
  actions: Item[];
  tones: Item[];
  roles: Item[];
  audience: Item[];
  outputs: Item[];
  maxWords: Item[];
  // reset: () => void;
  //   addItem: (item: Item, type: blockstypeT) => void;
};
export const usePromptBuilder = create<StorePromptBuilderT>()(
  devtools(
    // persist(
    (set) => {
      const initialPromptBlocks = {
        start: "Follow the guidelines strictly:\n",
      };
      const { actions, tones, roles, audience, outputs } = promptBlocks;
      return {
        prompt: "",
        promptBlocks: initialPromptBlocks,
        roles: roles.sort(sort),
        actions: actions.sort(sort),
        tones: tones.sort(sort),
        audience: audience.sort(sort),
        outputs: outputs.sort(sort),
        // reset: () =>
        //   set(
        //     () => {
        //       return { prompt: "", promptBlocks: initialPromptBlocks };
        //     },
        //     false,
        //     "reset prompt"
        //   ),
        setPrompt: (block, type) =>
          set(
            (s) => {
              let blockValue;
              switch (type) {
                case "actions":
                  blockValue = !!block ? `* ${block} ...\n` : "";
                  break;
                case "tones":
                  if (block.length > 0) {
                    blockValue = `* **Writing style**: ${(
                      block as string[]
                    ).join(", ")} \n`;
                  } else {
                    blockValue = "";
                  }
                  break;
                case "roles":
                  blockValue = !!block ? `* Act as ${block}\n` : "";
                  break;
                case "outputs":
                  blockValue = !!block
                    ? `* The output should be ${block}\n`
                    : "";
                  break;
                case "audience":
                  blockValue = !!block
                    ? `* **Target audience**: ${block}\n`
                    : "";
                  break;
                case "maxWords":
                  blockValue = !!block
                    ? `* Limit your response to a maximum of ${block}\n`
                    : "";
                  break;
                default:
              }
              const promptBlocks = s.promptBlocks;
              // @ts-expect-error igonore for now
              promptBlocks[type] = blockValue;

              const prompt = [
                promptBlocks.start,
                promptBlocks.actions,
                promptBlocks.roles,
                promptBlocks.tones,
                promptBlocks.outputs,
                promptBlocks.audience,
                promptBlocks.maxWords,
              ].join("");

              return {
                ...s,
                promptBlocks,
                prompt,
              };
            },
            false,
            "setPrompt"
          ),
      };
    },
    //   { name: "prompt-blocks", storage: createJSONStorage(() => localStorage) }
    // ),
    {}
  )
);
