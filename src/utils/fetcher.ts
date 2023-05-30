type ConditionalParams = {
  /**
   * run a callback fn while streaming data
   */
  onStream: (chunkValue: string) => void;
  /**
   * run a callback fn when streaming is done
   */
  onStreamFinished: () => void;
};

interface RequiredParams {
  stream: boolean;
  url: string;
  /**
   * fetch options
   */
  options: RequestInit;
}

type FetcherParams = RequiredParams &
  (
    | {
        stream: false;
      }
    | ({
        stream: true;
      } & ConditionalParams)
  );

export const fetcher = async (params: FetcherParams) => {
  const { url, options, stream } = params;
  const res = await fetch(url, options);
  if (stream) {
    const { onStream, onStreamFinished } = params;
    // This data is a ReadableStream
    const data = res.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    // streaming...
    while (!done) {
      try {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        if (chunkValue) {
          onStream(chunkValue);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: unknown | any) {
        if (error?.name === "AbortError") {
          console.log("Stream stopped by user");
        } else {
          console.error("Error in reading stream:", error);
        }
        break;
      }
    }
    // streaming done!
    if (done) {
      onStreamFinished();
      return;
    }
  } else {
    return res;
  }
};
