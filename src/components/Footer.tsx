import { Footer as MantineFooter } from "@mantine/core";

//======================================
export const Footer = () => {
  return (
    <MantineFooter height={60} className="w-full flex-row-center">
      <span>
        @{new Date().getFullYear()} <b>NoorAI</b>
      </span>
    </MantineFooter>
  );
};
