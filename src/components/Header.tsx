import { FaSun } from "react-icons/fa";
import { BsMoonStarsFill } from "react-icons/bs";
import {
  ActionIcon,
  useMantineColorScheme,
  MediaQuery,
  Header as MantineHeader,
  Burger,
} from "@mantine/core";

export function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      c={dark ? "yellow" : "blue"}
      size="lg"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <FaSun size="1.1rem" /> : <BsMoonStarsFill size="1.1rem" />}
    </ActionIcon>
  );
}

//======================================
export const Header = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <MantineHeader
      height={{ base: 60 }}
      p="md"
      className="flex w-full items-center"
    >
      <div className="w-full flex-row-start">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
        <div className=" sm:w-[180px] lg:w-[280px]"></div>
        <div className="mx-auto w-full max-w-3xl flex-row-center"></div>
        <ToggleTheme />
      </div>
    </MantineHeader>
  );
};
