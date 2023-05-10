import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@mantine/core";
import { useStore } from "@/hooks";
import { useRouter } from "next/router";
import * as React from "react";
import { notifications } from "@mantine/notifications";

const RichtEditor = () => {
  const { query } = useRouter();
  const textContent =
    useStore(
      (s) =>
        s.conversations.find((c) => c.id === query.chatId)?.template
          ?.htmlContent
    ) || "";

  const setTemplate = useStore((s) => s.setTemplate);
  const [isDirty, setIsDirty] = React.useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Your template" }),
    ],
    content: textContent,
    onUpdate: ({ editor }) => {
      const editorContent = editor?.getText() || "";
      if (editorContent !== textContent) {
        setIsDirty(true);
      } else {
        setIsDirty(false);
      }
    },
  });

  const onSave = () => {
    console.log(editor?.getText());
    setTemplate(query.chatId as string, {
      content: editor?.getText() || "",
      htmlContent: editor?.getHTML(),
    });
    notifications.show({
      message: "Template Saved!",
      withCloseButton: false,
      color: "dark",
      autoClose: 500,
    });
  };
  return (
    <>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            {/* <RichTextEditor.Highlight /> */}
            <RichTextEditor.Code />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
      <div className="pt-1 flex-row-start">
        {isDirty ? (
          <Button type="button" variant="default" onClick={onSave}>
            Save
          </Button>
        ) : null}
      </div>
    </>
  );
};
export const TemplateEditor = () => {
  return (
    <div className="prose max-w-full">
      <RichtEditor />
    </div>
  );
};
