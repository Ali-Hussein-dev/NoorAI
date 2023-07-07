import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseLanguageModel } from "langchain/dist/base_language";

export type ChatOpenaiParams = ConstructorParameters<typeof ChatOpenAI>;

type OpenAIModels = "gpt-3.5-turbo" | "gpt-4";

export type GetModelParams = {
  model: OpenAIModels;
  params: ChatOpenaiParams;
};

export const getModel = ({
  model,
  params,
}: GetModelParams): BaseLanguageModel => {
  switch (model) {
    case "gpt-3.5-turbo":
    case "gpt-4":
      return new ChatOpenAI(...params);
    default:
      throw new Error(`getModel: model ${model} is not supported `);
  }
};
