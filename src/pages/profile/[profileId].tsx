import { Tabs, AppShell, Text, ActionIcon, Button } from "@mantine/core";
import { Footer, Header } from "@/components";
import { signOut, useSession } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";
import * as React from "react";
import { api } from "@/utils";
import Head from "next/head";

//======================================
const Profile = () => {
  const { data: sessionData, status } = useSession();
  const { push, back } = useRouter();
  const { data: userProfile } = api.profile.get.useQuery(
    { id: sessionData?.user.id as string },
    {
      enabled: !!sessionData?.user.id,
    }
  );
  React.useEffect(() => {
    if (status === "unauthenticated") {
      push("/");
    } else {
    }
  }, [status, push]);

  return sessionData ? (
    <>
      <Head>
        <title>Profile | {sessionData.user.name}</title>
      </Head>
      <AppShell
        header={<Header />}
        footer={<Footer />}
        styles={({ colorScheme, colors }) => ({
          main: {
            backgroundColor: colors.dark[colorScheme === "dark" ? 9 : 0],
            color: colors.dark[colorScheme === "dark" ? 0 : 9],
          },
        })}
      >
        <div className="mx-auto w-full max-w-4xl px-1 pt-4">
          <div className="flex-row-between">
            <ActionIcon size="xl" onClick={() => back()}>
              <FaArrowLeft />
            </ActionIcon>
            <Button left="hi" leftIcon={<FiLogOut />} onClick={() => signOut()}>
              Log out
            </Button>
          </div>
          {/* -------------------------TABS */}
          <Tabs defaultValue="account">
            <Tabs.List>
              <Tabs.Tab value="account">Account</Tabs.Tab>
              <Tabs.Tab value="supscription">Plan</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="account" p="sm" className="space-y-2">
              <Text>
                <b>Name:</b> {sessionData.user.name}
              </Text>
              <Text>
                <b>Email:</b> {sessionData.user.email}
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="supscription" p="sm" className="space-y-2">
              Current Plan: {userProfile?.tier || "Free"}
            </Tabs.Panel>
          </Tabs>
        </div>
      </AppShell>
    </>
  ) : null;
};
export default Profile;
