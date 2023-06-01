import {
  openaiStreamParser,
  type OpenAIStreamPayload,
} from "../../utils/openai-stream-parser";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const {
    messages,
    configs,
    systemInstruction = "",
    template,
  } = await req.json();
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",

        content: systemInstruction + "\n" + template || "",
      },
      ...messages,
    ],
    stream: true,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    ...configs,
  };

  const stream = await openaiStreamParser(payload);
  return new Response(stream);
};

export default handler;
