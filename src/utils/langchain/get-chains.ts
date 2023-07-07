import { OpenAI } from "langchain/llms/openai";
import {
  ConversationSummaryMemory,
  ConversationSummaryMemoryInput,
} from "langchain/memory";
import { ConversationChain, LLMChainInput } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseChatMessage, BaseChatMessageHistory } from "langchain/dist/schema";
import { Optional } from "langchain/dist/types/type-utils";
import { BaseLanguageModel } from "langchain/dist/base_language";

const modelName = "gpt-3.5-turbo";

const prompt =
  PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

  Current conversation:
  {chat_history}
  Human: {input}
  AI:`);

export class ChatMessageHistory implements BaseChatMessageHistory {
  private messages: BaseChatMessage[] = [];

  constructor(initialMessages: BaseChatMessage[] = []) {
    this.messages = initialMessages;
  }

  async getMessages(): Promise<BaseChatMessage[]> {
    return this.messages;
  }
  async addUserMessage(text: string): Promise<void> {
    const messageType = "human";
    this.messages.push({
      text,
      _getType: () => messageType,
      toJSON: () => {
        return {
          data: {
            content: text,
            role: "user",
          },
          type: messageType,
        };
      },
    });
  }
  async addAIChatMessage(text: string): Promise<void> {
    const messageType = "ai";
    this.messages.push({
      text,
      _getType: () => messageType,
      toJSON: () => {
        return {
          data: {
            content: text,
            role: "assistant",
          },
          type: messageType,
        };
      },
    });
  }
  async SystemChatMessage(text: string): Promise<void> {
    const messageType = "system";
    this.messages.push({
      text,
      _getType: () => messageType,
      toJSON: () => {
        return {
          data: {
            content: text,
            role: "system",
          },
          type: messageType,
        };
      },
    });
  }
  async clear(): Promise<void> {
    this.messages = [];
  }
}

/**
 * @description
 * it runs ChatOpenAI, ConversationSummary, LLM
 *
 */
type GetChainParams = {
  llm: BaseLanguageModel;
  memory?: Partial<ConversationSummaryMemoryInput>;
  conversationChain?: Partial<Optional<LLMChainInput, "prompt">>;
};

export const getChain = async ({
  llm,
  conversationChain,
  memory,
}: GetChainParams) => {
  const memoryInput = {
    memoryKey: "chat_history",
    llm: new OpenAI({
      modelName,
      temperature: 0.1,
    }),
    ...memory,
  };
  const memoryInstance = new ConversationSummaryMemory(memoryInput);
  return new ConversationChain({
    prompt,
    ...conversationChain,
    memory: memoryInstance,
    llm,
  });
};
