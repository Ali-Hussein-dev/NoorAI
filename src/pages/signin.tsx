import { Button, Title, Paper } from "@mantine/core";
import { type GetServerSidePropsContext } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";

import * as React from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
//======================================
const Signin = ({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) => {
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const providers = await getProviders();
  const session = await getSession(ctx);

  if (session)
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };
  return {
    props: {
      providers,
    },
  };
}
