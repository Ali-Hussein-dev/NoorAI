import { Footer as MantineFooter } from "@mantine/core";

//======================================
export const Footer = () => {
  return (
    <MantineFooter height={60} className="w-full gap-3 flex-row-center">
      <span>
        @{new Date().getFullYear()} <b>NoorAI</b>
      </span>
      <a
        href="https://ali-hussein.notion.site/Privacy-Policy-678f713bf15b457cbb3335255f79502c"
        target="_blank"
        className="!text-gray-100"
      >
        Privacy policy
      </a>
      <a
        href="https://ali-hussein.notion.site/Terms-of-use-d856c10de5c64587b59cd36650472a02"
        target="_blank"
        className="!text-gray-100"
      >
        Terms of use
      </a>
    </MantineFooter>
  );
};
