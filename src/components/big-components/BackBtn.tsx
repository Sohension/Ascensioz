import Link from "next/link";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type BackButtonProps = {
  href: string;
  label?: string;
};

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`${rajdhani.className}
        inline-flex
        items-center
        gap-2
        rounded-2xl
        bg-white
        px-5
        py-3
        text-lg
        font-semibold
        text-slate-700
        shadow-md
        transition-all
        duration-300
        hover:-translate-x-1
        hover:bg-blue-600
        hover:text-white
        hover:shadow-xl
      `}
    >
      ← {label}
    </Link>
  );
}
