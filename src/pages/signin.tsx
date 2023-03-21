import { Button, Title, Paper } from "@mantine/core";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { useStore } from "~/hooks";
//======================================
const Signin = ({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) => {
  const { data: sessionData } = useSession();
  const conversations = useStore((s) => s.conversations);
  const { push } = useRouter();
  if (sessionData) {
    const path = conversations?.[0]?.id ? `/${conversations?.[0].id}` : "/chat";
    push(path);
  }
  return (
    <div className="grid min-h-screen place-items-center">
      <Paper radius="lg" withBorder shadow="lg" p="xl" className="px-20">
        <Title order={2} ta="center">
          Log in
        </Title>
        <React.Suspense fallback="loading...">
          <div className="gap-y-4 pt-8 flex-col-center">
            {providers &&
              Object.values(providers).map((prov) => (
                <Button
                  key={prov.name}
                  variant="outline"
                  color="gray"
                  size="lg"
                  radius="lg"
                  leftIcon={prov.id === "github" ? <BsGithub /> : <BsGoogle />}
                  onClick={() => void signIn(prov.id)}
                >
                  {prov.name}
                </Button>
              ))}
          </div>
        </React.Suspense>
      </Paper>
    </div>
  );
};
export default Signin;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
