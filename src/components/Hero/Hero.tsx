import { useStore } from "@/hooks";
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
        strokeWidth="0"
      />
    </svg>
    <rect
      width="100%"
      height="100%"
      strokeWidth="0"
      fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
    />
  </svg>
);
const content = {
  cta: "Start Chatting",
};

//======================================
export const Hero = () => {
  const conversations = useStore((state) => state.conversations);
  return (
    <>
      <GridBG />
      <section className=" grid h-[80vh] grow place-items-center">
        <div className="space-y-6 pb-14 flex-col-center">
          <div>
            <h1
              className={
                style.heroHeading +
                " pb-2 text-center text-4xl font-extrabold uppercase tracking-tight sm:text-4xl md:text-5xl"
              }
            >
              Intuitive <br />
              Transparent <br className="sm:hidden" /> Powerfull
            </h1>
            <p className="text-center text-lg text-zinc-400">
              (expirmental project)
            </p>
          </div>
          <Link
            href={
              conversations?.[0]?.id ? `/${conversations?.[0].id}` : "/chat"
            }
            className="mx-auto"
          >
            <button className="mx-auto rounded bg-white/90 px-8 py-2 text-xl font-bold text-zinc-800 duration-200 hover:scale-105">
              {content.cta}
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};
