import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo_white.png";

export function Wordmark({
  tone = "ink",
  src,
  className,
  imgClassName,
}: {
  tone?: "ink" | "light";
  src?: string;
  className?: string;
  imgClassName?: string;
}) {
  const logoSrc = src ?? (tone === "light" ? logoWhite : logo);
  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label="Emir Pay home">
      <img src={logoSrc} alt="Emir Pay" className={cn("h-8 w-auto", imgClassName)} />
    </Link>
  );
}
