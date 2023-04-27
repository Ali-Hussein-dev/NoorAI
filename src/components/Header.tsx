import { FaSun } from "react-icons/fa";
import { BsMoonStarsFill } from "react-icons/bs";
import {
  ActionIcon,
  useMantineColorScheme,
  MediaQuery,
  Header as MantineHeader,
  Burger,
  Button,
  Avatar,
  Anchor,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Logo } from "@/components";

export function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      size="lg"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <FaSun size="22" /> : <BsMoonStarsFill size="22" />}
    </ActionIcon>
  );
}

//======================================
export const UserDropdown = () => {
  const { data: sessionData } = useSession();
  // const [opened, { toggle }] = useDisclosure(false);
  return (
    <Link
      href={{
        pathname: "/profile/[profileId]",
        query: {
          profileId: sessionData?.user.id,
        },
      }}
    >
      <Avatar radius="xl" size="md" src={sessionData?.user.image} />
    </Link>
  );
};
//======================================
export const Header = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: sessionData } = useSession();

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
        <Anchor className="h-16 w-24 !cursor-pointer overflow-hidden" href="/">
          <Logo />
        </Anchor>
        <div className=" sm:w-[180px] lg:w-[280px]"></div>
        <div className="mx-auto w-full max-w-3xl flex-row-center"></div>
        <div className="gap-x-3 flex-row-center">
          <ToggleTheme />
          {sessionData ? (
            <UserDropdown />
          ) : (
            <Link href="/signin">
              <Button variant="outline" color="gray" radius="md">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </MantineHeader>
  );
};
