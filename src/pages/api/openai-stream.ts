import {
  openaiStreamParser,
  type OpenAIStreamPayload,
} from "../../utils/openai-stream-parser";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { model, messages } = await req.json();

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model,
    messages,
    // messages: [{ role: "user", content: prompt }],
    stream: true,
    // temperature: 0.7,
    // top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
    // max_tokens: 200,
    // n: 1,
  };

  const stream = await openaiStreamParser(payload);
  return new Response(stream);
};

export default handler;
