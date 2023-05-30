import {
  openaiStreamParser,
  type OpenAIStreamPayload,
} from "../../utils/openai-stream-parser";

export const config = {
  runtime: "edge",
};
const instructions = [
  "Before you response, follow these instructions:",
  "1. Be concise with your answer",
  "2. Don't repeat what I say",
].join("\n");
const handler = async (req: Request): Promise<Response> => {
  const {
    messages,
    temperature = 0.7,
    max_tokens = 200,
    template,
  } = await req.json();

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: instructions + "\n" + template || "",
      },
      ...messages,
    ],

    stream: true,
    temperature,
    max_tokens,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  };

  const stream = await openaiStreamParser(payload);
  return new Response(stream);
};

export default handler;
