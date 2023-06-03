import { Button } from "@mantine/core";
import { Logo } from "@/components";
import Link from "next/link";

//======================================
export const Header = () => {
  return (
    <header className="flex w-full items-center justify-center px-2 md:px-5">
      <div className="w-full max-w-7xl flex-row-start">
        <Logo />
        <div className="mx-auto w-full max-w-3xl flex-row-center"></div>
        <div className="gap-x-3 flex-row-center">
          <Link href="/signin">
            <Button variant="outline" color="gray" size="xs">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
