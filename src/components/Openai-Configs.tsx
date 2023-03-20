import { Button, Paper, PasswordInput, Drawer, Anchor } from "@mantine/core";
import { useStore } from "~/hooks";
import * as React from "react";
import { RiSettings3Line } from "react-icons/ri";
import { useDisclosure } from "@mantine/hooks";

// const openaiModels = [
//   {
//     label: "GPT-4",
//     value: "gpt-4",
//     description: "",
//     // description: "API key required",
//   },
//   {
//     label: "GPT-turbo-3.5",
//     value: "gpt-turbo-3.5",
//     description: "",
//     // description: "API key required",
//   },
//   {
//     label: "Text-davinci-003",
//     value: "text-davinci-003",
//     description: "",
//     // description: "API key required",
//   },
//   {
//     label: "Text-curie-001",
//     value: "text-curie-001",
//     description: "",
//     // description: "Free to use",
//   },
//   {
//     label: "Text-babbage-001",
//     value: "text-babbage-001",
//     description: "",
//     // description: "Free to use",
//   },
//   {
//     label: "Text-ada-001",
//     value: "text-ada-001",
//     description: "",
//     // description: "Free to use",
//   },
// ];

// interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
//   label: string;
//   description: string;
// }

// const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
//   ({ label, description, ...others }: ItemProps, ref) => (
//     <div ref={ref} {...others}>
//       <Group noWrap>
//         {/* <Avatar src={image} /> */}

//         <div>
//           <Text size="sm">{label}</Text>
//           <Text size="xs" opacity={0.65}>
//             {description}
//           </Text>
//         </div>
//       </Group>
//     </div>
//   )
// );
// SelectItem.displayName = "SelectItem";
//======================================
// export const SelectModel = () => {
//   const setModel = useStore((state) => state.setModel);
//   const model = useStore((state) => state.model);
//   const [value, setValue] = React.useState<string | null>(model);
//   return (
//     <div className="">
//       <Select
//         placeholder="Pick a model"
//         label="Pick a model"
//         data={openaiModels}
//         itemComponent={SelectItem}
//         rightSection={<IoChevronDown size="1rem" />}
//         value={value}
//         defaultValue={model}
//         onChange={(value) => {
//           setValue(value);
//           setModel(value as OpenaiModelsT);
//         }}
//         dropdownPosition="bottom"
//       />
//     </div>
//   );
// };

//======================================
export const Content = () => {
  const saveApiKey = useStore((s) => s.saveApiKey);
  const apiKey = useStore((s) => s.apiKey);
  const [form, setForm] = React.useState({
    input: apiKey,
    submitted: false,
  });
  return (
    <Paper className="h-full space-y-4 py-4  md:w-[200px] lg:w-[270px]">
      <div className="w-full">
        <Button
          type="button"
          variant="default"
          onClick={() => {
            if (form.submitted) return;
            setForm((prv) => ({ ...prv, submitted: true }));
            saveApiKey(form.input);
          }}
          className="w-full normal-case"
        >
          {form.submitted ? "Saved" : "Save"}
        </Button>
      </div>
      <div className="min-h-[370px] space-y-3">
        <div className="w-full gap-1 flex-col-start">
          {/* // !bug clicking on show password doesn't work */}
          <PasswordInput
            type="password"
            variant="filled"
            value={form.input}
            onChange={(e) => {
              setForm({ submitted: false, input: e.target.value });
            }}
            placeholder="Your API key"
            className="input w-full"
            label="API key"
          />
          <Anchor
            href="https://platform.openai.com/account/api-keys"
            className="link px-1"
            target="_blank"
            size="xs"
          >
            Get API key from OpenAI
          </Anchor>
        </div>
        {/* <SelectModel /> */}
      </div>
    </Paper>
  );
};
//======================================
export const OpenaiConfig = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer title="Settings" opened={opened} onClose={close} size="auto">
        <Content />
      </Drawer>
      <Button
        variant="default"
        color="gray"
        onClick={open}
        leftIcon={<RiSettings3Line size="17" />}
        className="w-full"
      >
        Settings
      </Button>
    </>
  );
};
