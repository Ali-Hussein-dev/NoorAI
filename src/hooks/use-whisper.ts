import { create } from "zustand";
import { persist } from "zustand/middleware";
import languages from "../content/languages.json";

// const langCodes = Object.values(languages) as const;

type ValueOf<T> = T[keyof T];
type LangCodeT = ValueOf<typeof languages>;
// type LangCodeT = (typeof languages)[keyof typeof languages];
type WhisperConfigs = {
  whisperLang: LangCodeT;
  setWhisperLang: (lang: LangCodeT) => void;
  // recordingMode: "transcriptions" | "translations";
  // setRecordingMode: (mode: "transcriptions" | "translations") => void;
};
export const useWhisper = create<WhisperConfigs>()(
  persist(
    (set) => {
      return {
        whisperLang: "en",
        setWhisperLang: (lang) => set(() => ({ whisperLang: lang }), false),
        // recordingMode: "transcriptions",
        // setRecordingMode: (mode) =>
        //   set(() => ({ recordingMode: mode }), false, "setRecordingMode"),
      };
    },
    {
      name: "noorai-whisper-configs",
    }
  )
);
