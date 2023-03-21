import {
  openaiStreamParser,
  type OpenAIStreamPayload,
} from "../../utils/openai-stream-parser";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { messages } = await req.json();

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Before you response, follow these instructions:\n 1.  be concise with your answer\n 2.  don't repeat what I say.\n 3.  If you are unsure, or don't know, just say 'Sorry, I don't know'.",
      },
      ...messages,
    ],
    // messages: [{ role: "user", content: prompt }],
    stream: true,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    // max_tokens: 200,
    n: 1,
  };

  const stream = await openaiStreamParser(payload);
  return new Response(stream);
};

export default handler;
