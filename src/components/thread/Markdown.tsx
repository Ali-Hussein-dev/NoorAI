import ReactMarkdown from "react-markdown";
import { type Language } from "prism-react-renderer";
import { useMantineTheme } from "@mantine/core";
import remarkGfm from "remark-gfm";
import * as React from "react";
import dynamic from "next/dynamic";

const Prism = dynamic(() => import("@mantine/prism").then((c) => c.Prism), {
  ssr: false,
});

//======================================
export const Markdown = ({ content }: { content: string }) => {
  const theme = useMantineTheme();
  return (
    <div
      style={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.gray[6]
            : theme.colors.gray[7],
      }}
      className="prose w-full max-w-[40rem] overflow-hidden"
    >
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "language-js");
            const codeValue = String(children).replace(/\n$/, "");
            return !inline && match ? (
              <Prism withLineNumbers language={match[1] as Language}>
                {codeValue}
              </Prism>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
