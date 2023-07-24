import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

async function openaiHandler(req: Request) {
  const {
    messages,
    configs,
    systemInstruction = "",
    template,
  } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",

        content: `${systemInstruction}\n '${template}'`,
      },
      ...messages,
    ],
    ...configs,
  });
  // Transform the response into a readable stream
  const stream = OpenAIStream(response);
  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
}
export default openaiHandler;
