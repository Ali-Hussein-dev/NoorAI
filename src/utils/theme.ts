import { type MantineThemeOverride } from "@mantine/core";

export const themeOverride: MantineThemeOverride = {
  colors: {
    amber: [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
    ],
  },
  primaryColor: "amber",
  //   primaryShade: 9,
  globalStyles: ({ colors, colorScheme }) => ({
    a: {
      color: colors.blue[7],
      "&:hover": {
        color: "inherit",
      },
      //   textDecorationColor: "inherit",
      // textDecoration: "inherit",
    },
    // scrollbar
    "::-webkit-scrollbar": {
      width: 8,
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      background: colorScheme === "dark" ? colors.dark[3] : colors.gray[5],
      borderRadius: 4,
    },
    ".mantine-Textarea-input, .mantine-Input-input, .mantine-Select-input": {
      "&:focus": {
        borderColor: colors.gray[7],
      },
      borderColor: "transparent",
    },
    ".mantine-MultiSelect-input": {
      "&:focus-within": {
        borderColor: colors.gray[7],
      },
      borderColor: "transparent",
    },
  }),
};
