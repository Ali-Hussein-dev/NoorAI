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
  const { messages, model = "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5" } =
    await req.json();
  console.info(req.url);
  // Initialize a text-generation stream using the Hugging Face Inference SDK
  const response = Hf.textGenerationStream({
    model,
    inputs: experimental_buildOpenAssistantPrompt(messages),
    // inputs: messages.at(-1).content,
    parameters: {
      max_new_tokens: 200,
      // @ts-expect-error (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  // Convert the async generator into a friendly text-stream
  const stream = HuggingFaceStream(response);

  // Respond with the stream, enabling the client to consume the response
  return new StreamingTextResponse(stream);
}

export default hfHandler;
