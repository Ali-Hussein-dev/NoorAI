import { env } from "@/env.mjs";
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";

// Create a new Hugging Face Inference instance
const Hf = new HfInference(env.HF_API_KEY);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

async function hfHandler(req: Request) {
  // Extract the `messages`,`model` from the body of the request
  const { messages, configs, template = "" } = await req.json();
  // Initialize a text-generation stream using the Hugging Face Inference SDK
  const prompt = template
    ? experimental_buildOpenAssistantPrompt([
        { content: template, role: "user" },
      ])
    : experimental_buildOpenAssistantPrompt(messages);
  const response = Hf.textGenerationStream({
    model: configs.model,
    inputs: prompt,
    parameters: {
      max_new_tokens: configs.max_tokens,
      temperature: configs.temperature,
      // @ts-expect-error (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: true,
    },
  });

  // Convert the async generator into a friendly text-stream
  const stream = HuggingFaceStream(response);

  // Respond with the stream, enabling the client to consume the response
  return new StreamingTextResponse(stream);
}

export default hfHandler;
