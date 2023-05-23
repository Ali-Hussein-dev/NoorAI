import { useStore } from "@/hooks";
import { Button } from "@mantine/core";
import Link from "next/link";
import style from "./Hero.module.css";

const GridBG = () => (
  <svg
    className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
        width="200"
        height="200"
        x="50%"
        y="-1"
        patternUnits="userSpaceOnUse"
      >
        <path d="M.5 200V.5H200" fill="none" />
      </pattern>
    </defs>
    <svg x="50%" y="-1" className="overflow-visible fill-gray-800/20">
      <path
        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
        stroke-width="0"
      />
    </svg>
    <rect
      width="100%"
      height="100%"
      stroke-width="0"
      fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
    />
  </svg>
);
//======================================
export const Hero = () => {
  const conversations = useStore((state) => state.conversations);
  return (
    <>
      <GridBG />
      <section
        className={style.radial + " grid h-[90vh] grow place-items-center"}
      >
        <div className="pb-14 flex-col-center">
          <h1 className="text-center font-extrabold uppercase">
            Intuitive, Transparent, Powerfull
          </h1>
          <Link
            href={
              conversations?.[0]?.id ? `/${conversations?.[0].id}` : "/chat"
            }
          >
            <Button size="lg">Start chating</Button>
          </Link>
        </div>
      </section>
    </>
  );
};
