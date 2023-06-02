import { FaSun } from "react-icons/fa";
import { BsMoonStarsFill } from "react-icons/bs";
import {
  ActionIcon,
  useMantineColorScheme,
  MediaQuery,
  Burger,
  Button,
  Avatar,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      size={26}
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
      <Avatar radius="xl" src={sessionData?.user.image} size={28} />
    </Link>
  );
};
//======================================
export const ChatHeader = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: sessionData } = useSession();
  const { pathname } = useRouter();
  return (
    <header className="flex w-full items-center px-2 pt-4 md:px-4">
      <div className="w-full flex-row-start">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
        <div className="mx-auto w-full max-w-3xl flex-row-center"></div>
        <div className="gap-x-3 flex-row-center">
          {pathname !== "/" && <ToggleTheme />}

          {sessionData && pathname !== "/" ? (
            <UserDropdown />
          ) : (
            <Link href="/signin">
              <Button variant="outline" color="gray" size="xs">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
