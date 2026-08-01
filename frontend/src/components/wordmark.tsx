import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Wordmark({
  tone = "ink",
  src = logo,
  className,
}: {
  tone?: "ink" | "light";
  src?: string;
  className?: string;
}) {
  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label="Emir Pay home">
      <img src={src} alt="Emir Pay" className="h-8 w-auto" />
    </Link>
  );
}
