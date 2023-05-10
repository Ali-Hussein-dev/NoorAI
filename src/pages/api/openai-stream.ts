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
  "3. present the answer in markdown",
  "4. If you are unsure, or don't know, just say 'Sorry, I do not know'",
].join("\n");
const handler = async (req: Request): Promise<Response> => {
  const {
    messages,
    temperature = 0.5,
    max_tokens = 100,
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
