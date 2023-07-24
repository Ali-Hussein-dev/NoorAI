import { env } from "@/env.mjs";
import { StreamingTextResponse, CohereStream } from "ai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

async function cohereHandler(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, configs } = await req.json();
  const prompt = messages.at(-1).content;
  const body = JSON.stringify({
    prompt,
    model: "command-nightly",
    max_tokens: 300,
    stop_sequences: [],
    return_likelihoods: "NONE",
    stream: true,
    ...configs,
  });

  const response = await fetch("https://api.cohere.ai/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.COHERE_API_KEY}`,
    },
    body,
  });

  // Extract the text response from the Cohere stream
  const stream = CohereStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

export default cohereHandler;
