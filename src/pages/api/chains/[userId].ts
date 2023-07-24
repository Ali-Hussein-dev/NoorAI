import { env } from "@/env.mjs";
import {
  ChatMessageHistory,
  ChatOpenaiParams,
  getChain,
  getModel,
} from "@/utils";
import { PromptTemplate } from "langchain/prompts";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

interface ExtendedRequest extends NextApiRequest {
  body: {
    messages: { content: string; role: string }[];
    template: string;
    configs: {
      max_tokens: number;
      temperature: number;
    };
  };
}

const handler = async (req: ExtendedRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json("Login to upload.");
  }
  if (req.method !== "POST") {
    console.log("🚀 method:", req.method);
    res.status(400).send("method is not allowed");
  }
  const parsedBody = req.body;
  // streaming...
  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Transfer-Encoding": "chunked",
  });
  // chaining...
  const prompt =
    PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI.
    Current conversation:
    {chat_history}
    Human: {input}
    AI:`);
  const chatHistoryList = parsedBody.messages;
  const configs = parsedBody.configs;
  const lastMessage = chatHistoryList.at(-1)?.content;

  try {
    const chatHistory = new ChatMessageHistory();
    for (const o of chatHistoryList) {
      const { content, role } = o;
      if (role === "user") {
        chatHistory.addUserMessage(content);
      } else if (role === "assistant") {
        chatHistory.addAIChatMessage(content);
        // rest: system
      } else {
        chatHistory.SystemChatMessage(content);
      }
    }
    const callbacks = [
      {
        handleLLMNewToken(token: string) {
          // process.stdout.write(token);
          res.write(token);
        },
      },
    ];
    const chatOpenAIParams: ChatOpenaiParams = [
      {
        modelName: "gpt-3.5-turbo",
        streaming: true,
        openAIApiKey: env.OPENAI_API_KEY,
        timeout: 2500,
        ...configs,
      },
    ];
    const chain = await getChain({
      llm: getModel({
        model: "gpt-3.5-turbo",
        params: chatOpenAIParams,
      }),
      conversationChain: {
        prompt,
      },
      memory: {
        chatHistory,
      },
    });
    await chain.call({ input: lastMessage }, callbacks);

    res.end();
  } catch (error) {
    console.log(`🚀 ~ api/chains/${req.query.userId} handler ~ error:`, error);
    res.end();
  }
};

export default handler;
