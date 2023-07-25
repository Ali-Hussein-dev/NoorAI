import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Modal, Text } from "@mantine/core";
import { useStore } from "@/hooks";
import { useRouter } from "next/router";
import * as React from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { FiEdit3 } from "react-icons/fi";

const RichtEditor = () => {
  const { query } = useRouter();
  const chatId = query.chatId as string;
  const savedTextContent =
    useStore(
      (s) => s.conversations.find((c) => c.id === chatId)?.template?.htmlContent
    ) || "";
  // const [defaultContent, setDefaultContent] = React.useState(textContent)
  const setTemplate = useStore((s) => s.setTemplate);
  const [isDirty, setIsDirty] = React.useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Your template" }),
    ],
    content: savedTextContent,
    onUpdate: ({ editor }) => {
      const editorContent = editor?.getText() || "";
      if (editorContent !== savedTextContent) {
        setIsDirty(true);
      } else {
        setIsDirty(false);
      }
    },
  });

  const onSave = () => {
    setTemplate(chatId, {
      content: editor?.getText() || "",
      htmlContent: editor?.getHTML(),
    });
    setIsDirty(false);
    notifications.show({
      message: "Template Saved!",
      withCloseButton: false,
      color: "dark",
      autoClose: 2000,
    });
  };
  // const onCancel = () => {
  //   setTemplate(chatId, {
  //     content: textContent,
  //   })
  //   setDefaultContent(textContent)
  //   setIsDirty(false);
  //   useStore.persist.rehydrate()
  // }
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
      <div className="gap-3 pt-2 flex-row-end">
        {/* <Button type="button" color="gray" onClick={onCancel} hidden={!isDirty}>
          Cancel
        </Button> */}
        <Button
          type="button"
          variant="default"
          onClick={onSave}
          hidden={!isDirty}
        >
          Save
        </Button>
      </div>
    </>
  );
};
export const TemplateEditor = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { query } = useRouter();
  const chatId = query.chatId as string;
  const template = useStore((s) =>
    s.conversations.find((o) => o.id === chatId)
  )?.template;
  return (
    <>
      <Modal opened={opened} onClose={close} title="Template Editor" size="lg">
        <RichtEditor />
        <div className="p-1">
          <Text fw="700">When to use it?</Text>
          <Text color="dimmed">
            The rule of thumb is to use it when you have prompts that you use
            FREQUENTLY such as &quot;generate YouTube title about
            something&quot;, &quot;act as dictionary&quot;...etc.
            <br />
            It is not expected to ask follow-up questions because the language
            model reads only the last message you send.
          </Text>
        </div>
      </Modal>
      <Button onClick={open} leftIcon={<FiEdit3 />} variant="default" size="lg">
        {!!template ? "Edit" : "Create"} Template
      </Button>
    </>
  );
};
